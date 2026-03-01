import { unstable_cache } from "next/cache";
import { sql } from "@/lib/db";
import { pinyin } from "pinyin-pro";

export interface Song {
  id: number;
  artist: string;
  title: string;
}

export interface Artist {
  artist: string;
  song_count: string;
}

export interface AboutSection {
  section_key: string;
  content_markdown: string;
}

export type SongSort = "artist" | "title" | "newest";

interface SongQueryOptions {
  sort: SongSort;
  artist: string | null;
  searchTerm: string | null;
}

export function normalizeSongSort(value: string | null): SongSort {
  if (value === "title" || value === "newest") {
    return value;
  }

  return "artist";
}

function toNormalizedAlphaNumeric(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function textContainsSearch(text: string, searchTerm: string): boolean {
  return text.toLowerCase().includes(searchTerm.toLowerCase());
}

function getPinyinInitials(text: string): string {
  return toNormalizedAlphaNumeric(
    pinyin(text, {
      pattern: "first",
      toneType: "none",
      nonZh: "removed",
    })
  );
}

function matchesSongBySearchTerm(song: Song, searchTerm: string): boolean {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const normalizedAlphaNumericSearch = toNormalizedAlphaNumeric(normalizedSearchTerm);
  const artistAndTitle = `${song.artist} ${song.title}`;
  const normalizedArtistAndTitle = toNormalizedAlphaNumeric(artistAndTitle);

  if (textContainsSearch(artistAndTitle, normalizedSearchTerm)) {
    return true;
  }

  if (!normalizedAlphaNumericSearch) {
    return false;
  }

  const artistInitials = getPinyinInitials(song.artist);
  const titleInitials = getPinyinInitials(song.title);
  const artistAndTitleInitials = `${artistInitials}${titleInitials}`;

  return (
    normalizedArtistAndTitle.includes(normalizedAlphaNumericSearch) ||
    artistInitials.startsWith(normalizedAlphaNumericSearch) ||
    titleInitials.startsWith(normalizedAlphaNumericSearch) ||
    artistAndTitleInitials.startsWith(normalizedAlphaNumericSearch)
  );
}

async function querySongs({ sort, artist, searchTerm }: SongQueryOptions) {
  const normalizedArtist = artist?.trim() || null;
  const normalizedSearchTerm = searchTerm?.trim() || null;
  let songs: Song[] = [];

  if (sort === "title") {
    songs = normalizedArtist
      ? ((await sql`
          SELECT id, artist, title
          FROM songs
          WHERE artist = ${normalizedArtist}
          ORDER BY title, artist
        `) as Song[])
      : ((await sql`
          SELECT id, artist, title
          FROM songs
          ORDER BY title, artist
        `) as Song[]);
  } else if (sort === "newest") {
    songs = normalizedArtist
      ? ((await sql`
          SELECT id, artist, title
          FROM songs
          WHERE artist = ${normalizedArtist}
          ORDER BY created_at DESC, artist, title
        `) as Song[])
      : ((await sql`
          SELECT id, artist, title
          FROM songs
          ORDER BY created_at DESC, artist, title
        `) as Song[]);
  } else {
    songs = normalizedArtist
      ? ((await sql`
          SELECT id, artist, title
          FROM songs
          WHERE artist = ${normalizedArtist}
          ORDER BY artist, title
        `) as Song[])
      : ((await sql`
          SELECT id, artist, title
          FROM songs
          ORDER BY artist, title
        `) as Song[]);
  }

  if (!normalizedSearchTerm) {
    return songs;
  }

  return songs.filter((song) => matchesSongBySearchTerm(song, normalizedSearchTerm));
}

const getSongsCached = unstable_cache(
  async (sort: SongSort, artist: string | null, searchTerm: string | null) =>
    querySongs({ sort, artist, searchTerm }),
  ["songs-list"],
  {
    revalidate: 60,
    tags: ["songs"],
  }
);

const getArtistsCached = unstable_cache(
  async () =>
    sql`
      SELECT artist, COUNT(*) as song_count
      FROM songs
      GROUP BY artist
      ORDER BY COUNT(*) DESC, artist
    `,
  ["songs-artists"],
  {
    revalidate: 300,
    tags: ["artists"],
  }
);

const getAboutSectionsCached = unstable_cache(
  async () =>
    sql`
      SELECT section_key, content_markdown
      FROM about_sections
      WHERE section_key IN ('about_intro', 'about_songlist')
      ORDER BY section_key
    `,
  ["about-sections"],
  {
    revalidate: 300,
    tags: ["about-sections"],
  }
);

export async function getSongsData(
  options: Partial<SongQueryOptions> = {}
): Promise<Song[]> {
  const sort = options.sort ?? "artist";
  return (await getSongsCached(
    sort,
    options.artist ?? null,
    options.searchTerm ?? null
  )) as Song[];
}

export async function getArtistsData(): Promise<Artist[]> {
  return (await getArtistsCached()) as Artist[];
}

export async function getAboutSectionsData(): Promise<AboutSection[]> {
  return (await getAboutSectionsCached()) as AboutSection[];
}

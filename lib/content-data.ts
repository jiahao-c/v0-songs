import { unstable_cache } from "next/cache";
import { sql } from "@/lib/db";

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

async function querySongs({ sort, artist, searchTerm }: SongQueryOptions) {
  const normalizedArtist = artist?.trim() || null;
  const normalizedSearchTerm = searchTerm?.trim() || null;
  const searchPattern = normalizedSearchTerm ? `%${normalizedSearchTerm}%` : null;

  if (sort === "title") {
    if (normalizedArtist && searchPattern) {
      return sql`
        SELECT id, artist, title
        FROM songs
        WHERE artist = ${normalizedArtist}
          AND (artist ILIKE ${searchPattern} OR title ILIKE ${searchPattern})
        ORDER BY title, artist
      `;
    }

    if (normalizedArtist) {
      return sql`
        SELECT id, artist, title
        FROM songs
        WHERE artist = ${normalizedArtist}
        ORDER BY title, artist
      `;
    }

    if (searchPattern) {
      return sql`
        SELECT id, artist, title
        FROM songs
        WHERE artist ILIKE ${searchPattern} OR title ILIKE ${searchPattern}
        ORDER BY title, artist
      `;
    }

    return sql`
      SELECT id, artist, title
      FROM songs
      ORDER BY title, artist
    `;
  }

  if (sort === "newest") {
    if (normalizedArtist && searchPattern) {
      return sql`
        SELECT id, artist, title
        FROM songs
        WHERE artist = ${normalizedArtist}
          AND (artist ILIKE ${searchPattern} OR title ILIKE ${searchPattern})
        ORDER BY created_at DESC, artist, title
      `;
    }

    if (normalizedArtist) {
      return sql`
        SELECT id, artist, title
        FROM songs
        WHERE artist = ${normalizedArtist}
        ORDER BY created_at DESC, artist, title
      `;
    }

    if (searchPattern) {
      return sql`
        SELECT id, artist, title
        FROM songs
        WHERE artist ILIKE ${searchPattern} OR title ILIKE ${searchPattern}
        ORDER BY created_at DESC, artist, title
      `;
    }

    return sql`
      SELECT id, artist, title
      FROM songs
      ORDER BY created_at DESC, artist, title
    `;
  }

  if (normalizedArtist && searchPattern) {
    return sql`
      SELECT id, artist, title
      FROM songs
      WHERE artist = ${normalizedArtist}
        AND (artist ILIKE ${searchPattern} OR title ILIKE ${searchPattern})
      ORDER BY artist, title
    `;
  }

  if (normalizedArtist) {
    return sql`
      SELECT id, artist, title
      FROM songs
      WHERE artist = ${normalizedArtist}
      ORDER BY artist, title
    `;
  }

  if (searchPattern) {
    return sql`
      SELECT id, artist, title
      FROM songs
      WHERE artist ILIKE ${searchPattern} OR title ILIKE ${searchPattern}
      ORDER BY artist, title
    `;
  }

  return sql`
    SELECT id, artist, title
    FROM songs
    ORDER BY artist, title
  `;
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

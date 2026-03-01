import { SongCatalog } from "@/components/song-catalog";
import {
  getAboutSectionsData,
  getArtistsData,
  getSongsData,
} from "@/lib/content-data";

export default async function Home() {
  const [songs, artists, aboutSections] = await Promise.all([
    getSongsData({ sort: "artist" }),
    getArtistsData(),
    getAboutSectionsData(),
  ]);

  return (
    <SongCatalog
      initialSongs={songs}
      initialArtists={artists}
      initialAboutSections={aboutSections}
    />
  );
}

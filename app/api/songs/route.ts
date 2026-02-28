import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const artist = searchParams.get("artist");
  const search = searchParams.get("search");

  try {
    let songs;

    if (search) {
      songs = await sql`
        SELECT id, artist, title 
        FROM songs 
        WHERE artist ILIKE ${"%" + search + "%"} 
           OR title ILIKE ${"%" + search + "%"}
        ORDER BY artist, title
      `;
    } else if (artist) {
      songs = await sql`
        SELECT id, artist, title 
        FROM songs 
        WHERE artist = ${artist}
        ORDER BY title
      `;
    } else {
      songs = await sql`
        SELECT id, artist, title 
        FROM songs 
        ORDER BY artist, title
      `;
    }

    return NextResponse.json(songs);
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

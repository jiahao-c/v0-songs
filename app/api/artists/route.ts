import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const artists = await sql`
      SELECT artist, COUNT(*) as song_count 
      FROM songs 
      GROUP BY artist 
      ORDER BY COUNT(*) DESC, artist
    `;

    return NextResponse.json(artists);
  } catch (error) {
    console.error("Failed to fetch artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

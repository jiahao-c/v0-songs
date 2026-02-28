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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artist, title } = body;

    if (!artist || !title) {
      return NextResponse.json(
        { error: "artist and title are required" },
        { status: 400 }
      );
    }

    const trimmedArtist = artist.trim();
    const trimmedTitle = title.trim();

    if (!trimmedArtist || !trimmedTitle) {
      return NextResponse.json(
        { error: "artist and title cannot be empty" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO songs (artist, title) 
      VALUES (${trimmedArtist}, ${trimmedTitle})
      RETURNING id, artist, title
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Failed to add song:", error);
    return NextResponse.json(
      { error: "Failed to add song" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await sql`DELETE FROM songs WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete song:", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
}

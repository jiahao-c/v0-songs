import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  MANAGE_AUTH_COOKIE,
  isAdminPasswordConfigured,
  isValidManageAuthCookie,
} from "@/lib/manage-auth";
import { getSongsData, normalizeSongSort } from "@/lib/content-data";

async function requireManageAccess() {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not configured" },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const authCookie = cookieStore.get(MANAGE_AUTH_COOKIE)?.value;
  if (!isValidManageAuthCookie(authCookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const artist = searchParams.get("artist")?.trim() || null;
  const searchTerm = searchParams.get("search")?.trim() || null;
  const sort = normalizeSongSort(searchParams.get("sort"));

  try {
    const songs = await getSongsData({ sort, artist, searchTerm });
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
    const unauthorizedResponse = await requireManageAccess();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

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

    revalidateTag("songs", "max");
    revalidateTag("artists", "max");
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
    const unauthorizedResponse = await requireManageAccess();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await sql`DELETE FROM songs WHERE id = ${id}`;

    revalidateTag("songs", "max");
    revalidateTag("artists", "max");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete song:", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireManageAccess();
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const { id, title } = await request.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: "id and title are required" },
        { status: 400 }
      );
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return NextResponse.json(
        { error: "title cannot be empty" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE songs
      SET title = ${trimmedTitle}
      WHERE id = ${id}
      RETURNING id, artist, title
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "song not found" }, { status: 404 });
    }

    revalidateTag("songs", "max");
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to update song:", error);
    return NextResponse.json(
      { error: "Failed to update song" },
      { status: 500 }
    );
  }
}

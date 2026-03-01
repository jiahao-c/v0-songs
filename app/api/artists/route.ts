import { NextResponse } from "next/server";
import { getArtistsData } from "@/lib/content-data";

export async function GET() {
  try {
    const artists = await getArtistsData();
    return NextResponse.json(artists);
  } catch (error) {
    console.error("Failed to fetch artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  MANAGE_AUTH_COOKIE,
  isAdminPasswordConfigured,
  isValidManageAuthCookie,
} from "@/lib/manage-auth";

const EDITABLE_SECTION_KEYS = ["about_intro", "about_songlist"] as const;
type EditableSectionKey = (typeof EDITABLE_SECTION_KEYS)[number];

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

export async function GET() {
  try {
    const rows = await sql`
      SELECT section_key, content_markdown
      FROM about_sections
      WHERE section_key IN ('about_intro', 'about_songlist')
      ORDER BY section_key
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch about sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch about sections" },
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

    const body = await request.json();
    const { sectionKey, contentMarkdown } = body;

    if (!sectionKey || typeof sectionKey !== "string") {
      return NextResponse.json(
        { error: "sectionKey is required" },
        { status: 400 }
      );
    }

    if (
      !EDITABLE_SECTION_KEYS.includes(sectionKey as EditableSectionKey)
    ) {
      return NextResponse.json(
        { error: "Invalid sectionKey" },
        { status: 400 }
      );
    }

    if (typeof contentMarkdown !== "string") {
      return NextResponse.json(
        { error: "contentMarkdown must be a string" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE about_sections
      SET content_markdown = ${contentMarkdown}, updated_at = NOW()
      WHERE section_key = ${sectionKey}
      RETURNING section_key, content_markdown
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to update about section:", error);
    return NextResponse.json(
      { error: "Failed to update about section" },
      { status: 500 }
    );
  }
}

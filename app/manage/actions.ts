"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  MANAGE_AUTH_COOKIE,
  getManageAuthCookieToken,
  isAdminPasswordConfigured,
  isValidAdminPassword,
} from "@/lib/manage-auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function loginToManage(formData: FormData) {
  if (!isAdminPasswordConfigured()) {
    redirect("/manage?error=not-configured");
  }

  const password = String(formData.get("password") ?? "");
  if (!isValidAdminPassword(password)) {
    redirect("/manage?error=invalid-password");
  }

  const cookieToken = getManageAuthCookieToken();
  if (!cookieToken) {
    redirect("/manage?error=not-configured");
  }

  const cookieStore = await cookies();
  cookieStore.set(MANAGE_AUTH_COOKIE, cookieToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  redirect("/manage");
}

import { createHash, timingSafeEqual } from "node:crypto";

export const MANAGE_AUTH_COOKIE = "manage_auth";
const AUTH_PREFIX = "manage-auth-v1:";

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function buildToken(password: string) {
  return createHash("sha256").update(`${AUTH_PREFIX}${password}`).digest("hex");
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function isValidAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();
  if (!configuredPassword) {
    return false;
  }

  return safeCompare(password, configuredPassword);
}

export function getManageAuthCookieToken() {
  const configuredPassword = getAdminPassword();
  if (!configuredPassword) {
    return null;
  }

  return buildToken(configuredPassword);
}

export function isValidManageAuthCookie(cookieValue?: string) {
  const expectedToken = getManageAuthCookieToken();
  if (!expectedToken || !cookieValue) {
    return false;
  }

  return safeCompare(cookieValue, expectedToken);
}

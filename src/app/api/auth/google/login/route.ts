import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomString } from "@/app/lib/randomString";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPath = searchParams.get("path") || "/";
  // Sanitize: return path must be a relative path starting with a single /
  const returnPath = /^\/(?!\/)/.test(rawPath) ? rawPath : "/";
  const origin = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_DOMAIN}`;

  // Generate a one-time nonce to guard against OAuth CSRF.
  // The nonce is sent to Google as `state` and also stored in an HttpOnly
  // cookie alongside the return path. The callback checks they match.
  const nonce = randomString(24);
  const cookieStore = await cookies();
  cookieStore.set("__oauth_state", JSON.stringify({ nonce, returnPath }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300, // 5 minutes — enough to complete the OAuth round-trip
    path: "/",
  });

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  googleAuthUrl.searchParams.set(
    "redirect_uri",
    `${origin}/api/auth/google/callback`,
  );
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("state", nonce); // state is the nonce only

  return NextResponse.redirect(googleAuthUrl.toString());
}

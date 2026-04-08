import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { randomString } from "@/app/lib/randomString";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const returnPath = state ? decodeURIComponent(state) : "/";
  const origin = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_DOMAIN}`;

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${origin}/api/auth/google/callback`,
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(`${origin}/`);
    }

    // Get user profile from Google
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );
    const profile = await profileResponse.json();
    if (!profile.email || !profile.id) {
      return NextResponse.redirect(`${origin}/`);
    }

    const supabase = createAdminClient();
    const sessionId = randomString(48);

    // Check if user already exists by google_id
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("google_id", profile.id)
      .single();

    let userId: string;

    if (existingUser) {
      // Update existing user
      await supabase
        .from("users")
        .update({
          avatar: profile.picture || null,
          last_active: new Date().toISOString(),
        })
        .eq("id", existingUser.id);
      userId = existingUser.id;
    } else {
      // Generate a random username using the DB function
      const { data: usernameResult } = await supabase.rpc(
        "generate_random_username",
      );
      const username = usernameResult || `User${randomString(8)}`;

      // Create new user
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          google_id: profile.id,
          email: profile.email.toLowerCase(),
          username,
          avatar: profile.picture || null,
        })
        .select("id")
        .single();

      if (!newUser) {
        return NextResponse.redirect(`${origin}/`);
      }
      userId = newUser.id;
    }

    // Create a session row for this device
    await supabase.from("sessions").insert({
      user_id: userId,
      session_id: sessionId,
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return NextResponse.redirect(`${origin}${returnPath}`);
  } catch {
    return NextResponse.redirect(`${origin}/`);
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Error exchanging code for session in auth/callback:", error);
    }
  }

  // If no code or exchange failed, redirect to login with error
  console.warn("Auth callback failed: Code is missing or exchange failed. Redirecting to login.");
  return NextResponse.redirect(`${origin}/login?error=auth-link-failed`);
}

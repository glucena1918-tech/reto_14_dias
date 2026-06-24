import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Check if a session exists before signing out
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  const url = new URL("/login", request.url);
  return NextResponse.redirect(url, {
    status: 302,
  });
}

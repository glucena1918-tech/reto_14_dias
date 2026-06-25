"use server";

import { createClient } from "@supabase/supabase-js";

export async function inviteUser(email: string, role: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Missing Supabase URL or Secret Key on server side!");
  }

  // Create admin client with service_role key to bypass RLS and perform admin auth operations
  const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Call the inviteUserByEmail admin method
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: {
      role: role,
    },
    // Dynamically direct user back to the application auth callback
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
  });

  if (error) {
    console.error("Supabase invite error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

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

  // Dynamically resolve site URL from request headers (works for localhost and Vercel)
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  // 1. Generate the invitation link as a secure fallback (this creates the user in auth.users without SMTP limits)
  let actionLink = "";
  try {
    const linkResult = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: email,
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        data: {
          role: role,
        },
      },
    });

    if (linkResult.data?.properties?.action_link) {
      actionLink = linkResult.data.properties.action_link;
    }
  } catch (err) {
    console.error("Error generating backup invite link:", err);
  }

  // 2. Call inviteUserByEmail so Supabase attempts to deliver the email
  const inviteResult = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: {
      role: role,
    },
    redirectTo: `${siteUrl}/auth/callback`,
  });

  if (inviteResult.error) {
    console.error("Supabase email delivery failed:", inviteResult.error);
    
    // If email sending failed (e.g. rate limit), but we generated the fallback link,
    // we return success along with the link so the administrator can invite them manually!
    if (actionLink) {
      return { 
        success: true, 
        actionLink, 
        message: "Email delivery rate limited by Supabase. Fallen back to direct link." 
      };
    }
    
    return { success: false, error: inviteResult.error.message };
  }

  return { success: true, data: inviteResult.data, actionLink };
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WelcomeContent from "./WelcomeContent";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile from public.users table
  const { data: profile } = await supabase
    .from("users")
    .select("first_name")
    .eq("id", user.id)
    .single();

  const firstName =
    profile?.first_name ||
    user.user_metadata?.first_name ||
    user.email?.split("@")[0] ||
    "";

  return <WelcomeContent firstName={firstName} />;
}

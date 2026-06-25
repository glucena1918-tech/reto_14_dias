"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  avatarUrl: string;
  userName: string;
  userInitials: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface UserProfileContextType {
  profile: UserProfile;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  avatarUrl: "",
  userName: "",
  userInitials: "",
  userEmail: "",
  firstName: "",
  lastName: "",
  phone: "",
  role: "user",
  createdAt: "",
};

const UserProfileContext = createContext<UserProfileContextType>({
  profile: defaultProfile,
  loading: true,
  refreshProfile: async () => {},
});

export function useUserProfile() {
  return useContext(UserProfileContext);
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(defaultProfile);
      setLoading(false);
      return;
    }

    // Fetch profile from users table
    const { data: dbProfile } = await supabase
      .from("users")
      .select("first_name, last_name, phone, avatar_url, role, created_at")
      .eq("id", user.id)
      .single();

    const firstName =
      dbProfile?.first_name || user.user_metadata?.first_name || "";
    const lastName =
      dbProfile?.last_name || user.user_metadata?.last_name || "";
    const phone = dbProfile?.phone || "";
    const avatarUrl = dbProfile?.avatar_url || "";
    const role = dbProfile?.role || "user";
    const createdAt = dbProfile?.created_at || "";

    let userName = "";
    let userInitials = "";

    if (firstName || lastName) {
      userName = `${firstName} ${lastName}`.trim();
      userInitials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (user.email) {
      userName = user.email.split("@")[0];
      userInitials = userName.charAt(0).toUpperCase();
    }

    setProfile({
      avatarUrl,
      userName,
      userInitials,
      userEmail: user.email || "",
      firstName,
      lastName,
      phone,
      role,
      createdAt,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <UserProfileContext.Provider value={{ profile, loading, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

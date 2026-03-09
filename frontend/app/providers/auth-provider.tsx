"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "../stores/auth-store";

/** Initializes auth state on mount by checking the current Supabase session. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

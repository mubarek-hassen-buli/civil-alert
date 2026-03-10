"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth-store";

export default function LogoutPage() {
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await signOut();
      router.push("/login");
    };

    performLogout();
  }, [signOut, router]);

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-semibold text-slate-700">Logging you out safely...</p>
      </div>
    </div>
  );
}

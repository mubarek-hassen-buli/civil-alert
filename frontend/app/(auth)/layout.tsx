import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[1200px] flex gap-8 items-stretch justify-center">
        {children}
      </div>
    </div>
  );
}

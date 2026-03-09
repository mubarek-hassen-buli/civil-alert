"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 pt-8 md:pt-0">
      
      {/* Left Form Section */}
      <div className="w-full max-w-md flex flex-col space-y-8 pl-0 md:pl-8">
        
        {/* Logo Area */}
        <div className="flex items-center space-x-2 justify-center md:justify-start">
          <div className="w-10 h-10 bg-btn-purple rounded-md flex items-center justify-center text-white font-bold text-xl">
            i|
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900">CivicAlerts.</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome Back</h1>
          <p className="text-sm text-neutral-500">Let&apos;s login to grab amazing deal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium">
            {error}
          </div>
        )}

        {/* Social Auth */}
        <div className="flex flex-col space-y-3">
          <Button 
            variant="outline" 
            className="w-full h-12 flex items-center justify-center gap-3 border-zinc-200"
            onClick={handleGoogleLogin}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-zinc-600 font-medium">Continue with Google</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-zinc-400">Or</span>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1">
            <Input 
              type="email" 
              placeholder="Email" 
              className="h-12 bg-zinc-50/50 border-zinc-100 placeholder:text-zinc-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1 relative">
            <Input 
              type="password" 
              placeholder="Password" 
              className="h-12 bg-zinc-50/50 border-zinc-100 placeholder:text-zinc-400 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-zinc-300 text-btn-purple focus:ring-btn-purple" />
              <label htmlFor="remember" className="text-zinc-700 font-medium cursor-pointer">Remember me</label>
            </div>
            <Link href="#" className="font-semibold text-zinc-900 hover:text-btn-purple transition-colors">
              Forgot Password?
            </Link>
          </div>

          <Button 
            type="submit" 
            variant="purple" 
            className="w-full h-12 text-base font-medium mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have an account? <Link href="/signup" className="text-btn-purple font-semibold hover:underline">Sign Up</Link>
        </p>

      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex flex-1 items-center justify-center p-4">
        <div className="relative w-full max-w-[550px] aspect-[4/5]">
             {/* The image with specific rounded corners matching the design */}
             <div className="absolute inset-0 overflow-hidden bg-zinc-100 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-[120px] rounded-br-[120px]">
                <Image
                  src="/images/Heavy-City-Traffic.jpg"
                  alt="City Traffic"
                  fill
                  className="object-cover"
                  priority
                />
             </div>
             
             {/* Overlay Text matching the design closely */}
             <div className="absolute top-10 right-8 text-right max-w-[300px] z-10">
                 <p className="text-white text-xl font-semibold leading-snug">
                     Empower your city <br/> with reliable reporting <br/> and active citizenship.
                 </p>
             </div>
        </div>
      </div>

    </div>
  );
}

import { create } from 'zustand';
import { createSupabaseClient } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  /** Initialize auth state from the current Supabase session. */
  initialize: () => Promise<void>;

  /** Sign up with email and password. */
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;

  /** Sign in with email and password. */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;

  /** Sign in with Google OAuth. */
  signInWithGoogle: () => Promise<void>;

  /** Sign out the current user. */
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    set({
      user: session?.user ?? null,
      session: session ?? null,
      isAuthenticated: !!session,
      isLoading: false,
    });

    // Listen for auth state changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        session: session ?? null,
        isAuthenticated: !!session,
      });
    });
  },

  signUp: async (email, password, fullName) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'user' },
      },
    });

    if (error) return { error: error.message };
    return { error: null };
  },

  signIn: async (email, password) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };
    return { error: null };
  },

  signInWithGoogle: async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },

  signOut: async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false });
  },
}));

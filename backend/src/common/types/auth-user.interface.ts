/** Represents the authenticated user payload extracted from the Supabase JWT. */
export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

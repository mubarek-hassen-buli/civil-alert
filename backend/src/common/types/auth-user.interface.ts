/** Represents the authenticated user payload extracted from the Supabase JWT. */
export class AuthUser {
  id: string;
  email: string;
  role?: string;
}

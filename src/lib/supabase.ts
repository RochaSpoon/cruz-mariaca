import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string;
const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;

// persistSession + autoRefreshToken keep a member signed in on this device until they sign out.
export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'cm-auth', detectSessionInUrl: false },
});

export const SIGNUP_URL = `${url}/functions/v1/signup`;
export const API_KEY = key;
// Supabase Auth wants an email. Usernames map to an address that cannot receive mail.
export const emailFor = (username: string) => `${username.trim().toLowerCase()}@members.cruz-mariaca.invalid`;
export const HAS_SESSION_KEY = 'cm-auth';

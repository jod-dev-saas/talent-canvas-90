import { createClient, SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

// Service client for server-side operations
export const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Get client with user context
export const getSupabaseClient = (accessToken?: string): SupabaseClient => {
  if (!accessToken) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get user from JWT
export const getUserFromToken = async (token: string) => {
  const decoded = verifyToken(token);
  if (!decoded || !decoded.sub) return null;
  
  const { data: user, error } = await supabaseService.auth.admin.getUserById(decoded.sub);
  if (error || !user) return null;
  
  return user;
};

// Create session cookie value
export const createSessionCookie = (token: string, refreshToken: string) => {
  return JSON.stringify({
    access_token: token,
    refresh_token: refreshToken,
    expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  });
};

// Parse session cookie
export const parseSessionCookie = (cookieValue: string) => {
  try {
    return JSON.parse(cookieValue);
  } catch {
    return null;
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  const { data, error } = await supabaseService.auth.refreshSession({
    refresh_token: refreshToken
  });
  
  if (error || !data.session) return null;
  return data.session;
};
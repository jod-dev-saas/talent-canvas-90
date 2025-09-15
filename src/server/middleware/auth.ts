import { Request, Response, NextFunction } from 'express';
import { getUserFromToken, parseSessionCookie, refreshAccessToken, createSessionCookie } from '../lib/supabaseClient';

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
  cookies: Record<string, string>;
  originalUrl: string;
  params: Record<string, string>;
  query: any;
  body: any;
  file?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get session cookie
    const sessionCookie = req.cookies['sb-session'];
    if (!sessionCookie) {
      return res.status(401).json({
        error: 'Authentication required',
        redirect: '/candidate/auth/signin',
        returnTo: req.originalUrl
      });
    }

    const session = parseSessionCookie(sessionCookie);
    if (!session) {
      return res.status(401).json({
        error: 'Invalid session',
        redirect: '/candidate/auth/signin',
        returnTo: req.originalUrl
      });
    }

    // Check if token is expired
    if (Date.now() > session.expires_at) {
      // Try to refresh
      const newSession = await refreshAccessToken(session.refresh_token);
      if (!newSession) {
        res.clearCookie('sb-session');
        return res.status(401).json({
          error: 'Session expired',
          redirect: '/candidate/auth/signin',
          returnTo: req.originalUrl
        });
      }

      // Set new cookie
      const newCookie = createSessionCookie(
        newSession.access_token,
        newSession.refresh_token
      );
      res.cookie('sb-session', newCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

      req.token = newSession.access_token;
      req.user = await getUserFromToken(newSession.access_token);
    } else {
      // Token is still valid
      req.token = session.access_token;
      req.user = await getUserFromToken(session.access_token);
    }

    if (!req.user) {
      return res.status(401).json({
        error: 'Invalid token',
        redirect: '/candidate/auth/signin',
        returnTo: req.originalUrl
      });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Optional auth - doesn't fail if not authenticated
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionCookie = req.cookies['sb-session'];
    if (sessionCookie) {
      const session = parseSessionCookie(sessionCookie);
      if (session && Date.now() <= session.expires_at) {
        req.token = session.access_token;
        req.user = await getUserFromToken(session.access_token);
      }
    }
    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};
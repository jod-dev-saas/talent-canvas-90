// CHANGED_BY: Claude – backend finish (2025-09-15) - Complete OAuth implementation

import { Router } from 'express';
import { supabaseService, createSessionCookie } from '../lib/supabaseClient.ts';
import { AuthRequest, requireAuth } from '../middleware/auth.ts';

const router = Router();

/**
 * POST /api/auth/signin
 * Sign in with email and password
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabaseService.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Set session cookie
    const sessionCookie = createSessionCookie(
      data.session.access_token,
      data.session.refresh_token
    );

    res.cookie('sb-session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({
      user: data.user,
      redirectTo: '/candidate'
    });
  } catch (error: any) {
    console.error('Sign in error:', error);
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
});

/**
 * POST /api/auth/signup
 * Sign up with email and password
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Email, password, and full name are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    const { data, error } = await supabaseService.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    if (data.session) {
      // Set session cookie for immediate sign in
      const sessionCookie = createSessionCookie(
        data.session.access_token,
        data.session.refresh_token
      );

      res.cookie('sb-session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

      res.json({
        user: data.user,
        message: 'Account created successfully',
        redirectTo: '/candidate'
      });
    } else {
      // Email confirmation required
      res.json({
        message: 'Please check your email to confirm your account',
        confirmationRequired: true
      });
    }
  } catch (error: any) {
    console.error('Sign up error:', error);
    res.status(400).json({ error: error.message || 'Failed to create account' });
  }
});

/**
 * POST /api/auth/signout
 * Sign out current user
 */
router.post('/signout', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { error } = await supabaseService.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
    }

    // Clear session cookie
    res.clearCookie('sb-session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.json({ message: 'Signed out successfully' });
  } catch (error: any) {
    console.error('Sign out error:', error);
    res.status(500).json({ error: 'Failed to sign out' });
  }
});

/**
 * GET /api/auth/callback
 * Handle OAuth callbacks for social providers
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error: authError } = req.query;

    // Handle OAuth errors
    if (authError) {
      console.error('OAuth error:', authError);
      return res.redirect(`${process.env.FRONTEND_URL}/candidate/auth/signin?error=${encodeURIComponent(authError as string)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/candidate/auth/signin?error=no_code`);
    }

    // Exchange code for session
    const { data, error } = await supabaseService.auth.exchangeCodeForSession(code as string);

    if (error) {
      console.error('Code exchange error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/candidate/auth/signin?error=${encodeURIComponent(error.message)}`);
    }

    if (data.session) {
      // Set session cookie
      const sessionCookie = createSessionCookie(
        data.session.access_token,
        data.session.refresh_token
      );

      res.cookie('sb-session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed to 'lax' for OAuth redirects
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

      // Check if user is new
      const isNewUser = data.user?.created_at === data.user?.updated_at;
      const redirectPath = isNewUser ? '/candidate' : (state as string || '/candidate');
      
      res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/candidate/auth/signin?error=no_session`);
    }
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/candidate/auth/signin?error=callback_failed`);
  }
});

/**
 * POST /api/auth/oauth/google
 * Initiate Google OAuth flow
 */
router.post('/oauth/google', async (req, res) => {
  try {
    const { data, error } = await supabaseService.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.BACKEND_URL}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) throw error;

    res.json({ 
      url: data.url,
      provider: 'google' 
    });
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    res.status(400).json({ error: error.message || 'Failed to initiate Google OAuth' });
  }
});

/**
 * POST /api/auth/oauth/github
 * Initiate GitHub OAuth flow
 */
router.post('/oauth/github', async (req, res) => {
  try {
    const { data, error } = await supabaseService.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.BACKEND_URL}/api/auth/callback`
      }
    });

    if (error) throw error;

    res.json({ 
      url: data.url,
      provider: 'github' 
    });
  } catch (error: any) {
    console.error('GitHub OAuth error:', error);
    res.status(400).json({ error: error.message || 'Failed to initiate GitHub OAuth' });
  }
});

/**
 * POST /api/auth/oauth/apple
 * Initiate Apple OAuth flow
 */
router.post('/oauth/apple', async (req, res) => {
  try {
    const { data, error } = await supabaseService.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${process.env.BACKEND_URL}/api/auth/callback`
      }
    });

    if (error) throw error;

    res.json({ 
      url: data.url,
      provider: 'apple' 
    });
  } catch (error: any) {
    console.error('Apple OAuth error:', error);
    res.status(400).json({ error: error.message || 'Failed to initiate Apple OAuth' });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh the current session
 */
router.post('/refresh', async (req, res) => {
  try {
    const sessionCookie = req.cookies['sb-session'];
    
    if (!sessionCookie) {
      return res.status(401).json({ error: 'No session found' });
    }

    // Parse the session cookie to get refresh token
    let refreshToken: string;
    try {
      const parsedSession = JSON.parse(sessionCookie);
      refreshToken = parsedSession.refresh_token;
    } catch {
      return res.status(401).json({ error: 'Invalid session format' });
    }

    const { data, error } = await supabaseService.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) throw error;

    // Update session cookie with new tokens
    const newSessionCookie = createSessionCookie(
      data.session.access_token,
      data.session.refresh_token
    );

    res.cookie('sb-session', newSessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({
      user: data.user,
      message: 'Session refreshed successfully'
    });
  } catch (error: any) {
    console.error('Refresh error:', error);
    
    // Clear invalid session cookie
    res.clearCookie('sb-session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(401).json({ error: 'Session expired' });
  }
});

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    res.json({
      user: req.user,
      authenticated: true
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { error } = await supabaseService.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    });

    if (error) throw error;

    res.json({
      message: 'If an account with that email exists, we sent a password reset link'
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { password, access_token, refresh_token } = req.body;

    if (!password || !access_token || !refresh_token) {
      return res.status(400).json({ 
        error: 'Password, access token, and refresh token are required' 
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Set the session with the tokens from the reset link
    const { data: sessionData, error: sessionError } = 
      await supabaseService.auth.setSession({
        access_token,
        refresh_token
      });

    if (sessionError) throw sessionError;

    // Update the password
    const { data, error } = await supabaseService.auth.updateUser({
      password
    });

    if (error) throw error;

    // Create new session cookie
    const sessionCookie = createSessionCookie(
      sessionData.session.access_token,
      sessionData.session.refresh_token
    );

    res.cookie('sb-session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({
      user: data.user,
      message: 'Password updated successfully',
      redirectTo: '/candidate'
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: error.message || 'Failed to reset password' });
  }
});

/**
 * PUT /api/auth/update-profile
 * Update user profile information
 */
router.put('/update-profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { fullName, email } = req.body;
    const updates: any = {};

    if (fullName) {
      updates.data = { full_name: fullName };
    }

    if (email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      updates.email = email;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const { data, error } = await supabaseService.auth.updateUser(updates);

    if (error) throw error;

    res.json({
      user: data.user,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(400).json({ error: error.message || 'Failed to update profile' });
  }
});

/**
 * POST /api/auth/change-password
 * Change password for authenticated user
 */
router.post('/change-password', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    // Password strength validation
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters long' 
      });
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabaseService.auth.signInWithPassword({
      email: req.user.email!,
      password: currentPassword
    });

    if (verifyError) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update to new password
    const { data, error } = await supabaseService.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(400).json({ error: error.message || 'Failed to change password' });
  }
});

export default router;
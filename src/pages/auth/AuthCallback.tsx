import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setStatus('error');
          return;
        }

        if (data.session) {
          setStatus('success');
          // Small delay to show success state
          setTimeout(() => {
            navigate('/candidate', { replace: true });
          }, 1500);
        } else {
          setError('No session found');
          setStatus('error');
        }
      } catch (error: any) {
        console.error('Unexpected error:', error);
        setError(error.message || 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleRetry = () => {
    navigate('/auth/signin', { replace: true });
  };

  if (status === 'loading') {
    return (
      <AuthLayout title="Signing you in..." subtitle="Please wait while we complete your authentication">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Authenticating with Google...</p>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  if (status === 'success') {
    return (
      <AuthLayout title="Success!" subtitle="You've been signed in successfully">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="text-center space-y-2">
                <p className="font-medium text-foreground">Welcome to JOD!</p>
                <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Authentication Error" subtitle="We couldn't sign you in">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center space-y-2">
              <p className="font-medium text-foreground">Something went wrong</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
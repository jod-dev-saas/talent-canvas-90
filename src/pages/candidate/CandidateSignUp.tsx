import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Github } from 'lucide-react';
import { CandidateHeader } from '@/components/CandidateHeader';

export default function SignUp() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const role = (searchParams.get('role') as 'candidate' | 'company') || 'candidate';
  const from = (location.state as any)?.from?.pathname || `/${role}`;

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, role });
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <CandidateHeader />
      <Card className="mt-20 max-w-md border-border shadow-elegant animate-fade-in">
        <CardContent className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Sign up</h1>
            <p>Sign up to continue</p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="group flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-background hover:bg-accent hover:border-primary/50 transition-all">
              <svg className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>

            <button className="group flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-background hover:bg-accent hover:border-primary/50 transition-all">
              <Github className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-foreground" />
              <span className="text-sm font-medium">GitHub</span>
            </button>

            <button className="group flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-background hover:bg-accent hover:border-primary/50 transition-all">
              <svg className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-medium">Or create with email</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="relative">
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder=" "
                className="w-full px-4 pt-6 pb-2 border-2 border-primary rounded-lg bg-background text-foreground focus:outline-none focus:border-primary min-h-[56px] peer"
                required
              />
              <label
                htmlFor="fullName"
                className="absolute left-4 top-4 text-primary font-medium transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder=" "
                className="w-full px-4 pt-6 pb-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary min-h-[56px] peer"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-4 text-muted-foreground transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder=" "
                className="w-full px-4 pt-6 pb-2 pr-12 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary min-h-[56px] peer"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-4 text-muted-foreground transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover-scale shadow-elegant min-h-[44px]"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

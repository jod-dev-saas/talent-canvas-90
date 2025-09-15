import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Github } from 'lucide-react';
import { CompanyHeader } from '@/components/CompanyHeader';

export default function CompanySignUp() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: ''
  });

  // default role to company for this route, allow override via ?role=
  const role = (searchParams.get('role') as 'candidate' | 'company') || 'company';
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
    console.log('Company signup submitted:', { ...formData, role });
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <CompanyHeader />
      <Card className="mt-20 max-w-md border-border shadow-elegant animate-fade-in">
        <CardContent className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Sign up</h1>
            <p>Create a company recruiter account to find candidates</p>
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
            {/* Recruiter Full Name */}
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
                Full name
              </label>
            </div>

            {/* Work Email */}
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
                Work email (company domain)
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


            {/* Company Name */}
            <div className="relative">
              <input
                id="companyName"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder=" "
                className="w-full px-4 pt-6 pb-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary min-h-[56px] peer"
                required
              />
              <label
                htmlFor="companyName"
                className="absolute left-4 top-4 text-muted-foreground transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Company name
              </label>
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
              <Link to="/company/auth/signin" className="text-primary hover:text-primary/80 font-medium">
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

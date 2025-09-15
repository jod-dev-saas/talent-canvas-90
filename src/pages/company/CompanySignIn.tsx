import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Github } from "lucide-react";
import { CompanyHeader } from "@/components/CompanyHeader";

export default function CompanySignIn() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // redirect target — default to company dashboard
  const from = (location.state as any)?.from?.pathname || "/company";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // wire to your auth.signin for companies
    console.log("Company sign in submitted:", formData);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <CompanyHeader />
      <Card className="mt-20 max-w-md border-border shadow-elegant animate-fade-in">
        <CardContent className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Welcome back</h1>
            <p>Sign in to continue to your company dashboard</p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (floating label) */}
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
                Work email
              </label>
            </div>

            {/* Password (floating label) */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
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

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-elegant min-h-[44px]"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/company/auth/signup" className="text-primary hover:text-primary/80 font-medium">
                Create account
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

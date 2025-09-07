/**
 * Role-Aware Header Component
 * 
 * Displays navigation based on user role (candidate/company) stored in localStorage.
 * Updates immediately when role changes via storage events.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, User, Building2 } from "lucide-react";

type UserRole = 'candidate' | 'company' | null;

// Navigation items based on role - exactly as specified
const CANDIDATE_NAV = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/how" },
  { label: "Resume Builder", href: "/resume-builder" },
  { label: "ATS Checker", href: "/ats-checker" },
  { label: "Premium", href: "/premium" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" }
];

const COMPANY_NAV = [
  { label: "Home", href: "/" },
  { label: "Top-rated Candidates", href: "/company/top-rated" },
  { label: "Freshers", href: "/company/freshers" },
  { label: "Experienced", href: "/company/experienced" },
  { label: "Filtered Search", href: "/company" },
  { label: "Ask JOD", href: "/ask-jod" },
  // { label: "Contact", href: "/contact" },
  // { label: "About", href: "/about" }
];

const MINIMAL_NAV = [
  { label: "Home", href: "/" },
  // { label: "About", href: "/about" },
  { label: "How it Works", href: "/how" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" }
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current route is Ask JOD to hide the nav button
  const isOnAskJodPage = location.pathname === '/ask-jod';

  // Read role from localStorage on mount and listen for changes
  useEffect(() => {
    const updateRole = () => {
      const userRole = localStorage.getItem('jod_role') as UserRole;
      setRole(userRole);
    };

    updateRole();
    
    // Listen for storage events (when role changes in other tabs/components)
    window.addEventListener('storage', updateRole);
    
    // Custom event for same-tab role changes
    window.addEventListener('roleChanged', updateRole);
    
    return () => {
      window.removeEventListener('storage', updateRole);
      window.removeEventListener('roleChanged', updateRole);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to set role (for landing page role cards)
  const setUserRole = (newRole: UserRole) => {
    if (newRole) {
      localStorage.setItem('jod_role', newRole);
    } else {
      localStorage.removeItem('jod_role');
    }
    setRole(newRole);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('roleChanged'));
  };

  // Reset role function (for testing)
  const resetRole = () => {
    setUserRole(null);
    navigate('/');
  };

  const getNavItems = () => {
    if (role === 'candidate') return CANDIDATE_NAV;
    if (role === 'company') return COMPANY_NAV;
    return MINIMAL_NAV;
  };

  const navItems = getNavItems();

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 
          bg-background/95 backdrop-blur-sm border-b border-border
          transition-shadow duration-300
          ${isScrolled ? 'shadow-lg' : ''}
        `}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-foreground hover:text-primary transition-colors">
            JOD
          </Link>

          {/* Desktop Navigation - Show all nav items except last 2 (Contact, About) */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.slice().map(item => (
              <Button key={item.href} variant="ghost" asChild>
                <Link to={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            {role && (
              <Badge variant="secondary" className="hidden md:flex items-center gap-1">
                {role === 'candidate' ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Building2 className="h-3 w-3" />
                )}
                {role === 'candidate' ? 'Candidate' : 'Company'}
              </Badge>
            )}

            {/* Ask JOD Button - Hidden when on /ask-jod page */}
            {!isOnAskJodPage && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                onMouseEnter={() => {
                  // Prefetch Ask JOD on hover
                  if (typeof window !== 'undefined') {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = '/ask-jod';
                    document.head.appendChild(link);
                  }
                }}
              >
                <Link to="/ask-jod">Ask JOD</Link>
              </Button>
            )}

            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Show all nav items in mobile */}
                  {navItems.filter(item => !(isOnAskJodPage && item.href === '/ask-jod')).map(item => (
                    <Button 
                      key={item.href} 
                      variant="ghost" 
                      className="justify-start"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to={item.href}>{item.label}</Link>
                    </Button>
                  ))}
                  
                  {/* Role management for mobile */}
                  <div className="pt-4 border-t border-border">
                    {role ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Current role: <span className="font-medium">{role}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetRole}
                          className="w-full"
                        >
                          Reset Role
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground mb-2">Choose your role:</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setUserRole('candidate');
                            setMobileMenuOpen(false);
                            navigate('/candidate');
                          }}
                          className="w-full"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Candidate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setUserRole('company');
                            setMobileMenuOpen(false);
                            navigate('/company');
                          }}
                          className="w-full"
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          Company
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Make setUserRole available globally for landing page role cards */}
      {typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.setUserRole = ${setUserRole.toString()}`
          }}
        />
      )}
    </>
  );
}
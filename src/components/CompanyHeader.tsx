/**
 * Candidate Header Component
 * 
 * Dedicated header for candidate pages with candidate-specific navigation
 * Follows the same theme and structure as the main Header component
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";

const CANDIDATE_NAV = [
  { label: "Home", href: "/" },
  // { label: "Interns", href: "/company/intern" },
  { label: "Freshers", href: "/company/freshers" },
  { label: "Experienced", href: "/company/experienced" },
  { label: "Premium", href: "/company/premium" },
  { label: "Contact", href: "/company/contact" },
  { label: "How it Works", href: "/company/how" }
];

export function CompanyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if current route is Ask JOD to hide the nav button
  const isOnAskJodPage = location.pathname === '/ask-jod';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {CANDIDATE_NAV.map(item => (
            <Button key={item.href} variant="ghost" asChild>
              <Link 
                to={item.href}
                className={location.pathname === item.href ? 'text-primary' : ''}
              >
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
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
                <SheetTitle>Candidate Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {CANDIDATE_NAV.map(item => (
                  <Button 
                    key={item.href} 
                    variant="ghost" 
                    className={`justify-start ${location.pathname === item.href ? 'text-primary' : ''}`}
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to={item.href}>{item.label}</Link>
                  </Button>
                ))}
                
                {/* Ask JOD for Mobile */}
                {!isOnAskJodPage && (
                  <>
                    <div className="pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link to="/ask-jod">Ask JOD</Link>
                      </Button>
                    </div>
                  </>
                )}
                
                {/* Role info for mobile */}
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Logged in as: <span className="font-medium text-primary">Candidate</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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
          TalentCanvas
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" asChild>
            <a href="#about">About</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="#how-it-works">How it Works</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="#contact">Contact</a>
          </Button>
        </nav>

        {/* Theme Toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
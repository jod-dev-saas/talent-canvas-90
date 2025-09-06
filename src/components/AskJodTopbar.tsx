/**
 * Ask JOD Minimal Top Bar - Breadcrumb navigation and theme toggle
 * 
 * Features:
 * - Breadcrumb link back to Home
 * - Centered brand name
 * - Theme toggle on the right
 * - Sticky positioning
 * - Accessible navigation
 */

import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function AskJodTopbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Breadcrumb */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-sm font-medium">Ask JOD</span>
        </div>

        {/* Center: Brand */}
        <Link 
          to="/" 
          className="absolute left-1/2 transform -translate-x-1/2 font-bold text-xl text-foreground hover:text-primary transition-colors"
        >
          TalentCanvas
        </Link>

        {/* Right: Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
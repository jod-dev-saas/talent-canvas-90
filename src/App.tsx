import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import { ChatBot } from "@/components/ChatBot";
import { ScrollToTopOnRouteChange } from "@/components/ScrollToTopOnRouteChange";
import Index from "./pages/Index";
import Candidate from "./pages/Candidate";
import Company from "./pages/Company";
import ResumeBuilder from "./pages/ResumeBuilder";
import ATSChecker from "./pages/ATSChecker";
import AskJod from "./pages/AskJod";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Main App component with global providers and routing
 * Includes custom cursor, chatbot, and scroll-to-top functionality
 * Lazy loads non-critical components for better performance
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <CustomCursor>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTopOnRouteChange />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/candidate" element={<Candidate />} />
              <Route path="/company" element={<Company />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/ats-checker" element={<ATSChecker />} />
              <Route path="/ask-jod" element={<AskJod />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Global ChatBot - available on all pages */}
            <Suspense fallback={null}>
              <ChatBot />
            </Suspense>
          </BrowserRouter>
        </CustomCursor>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

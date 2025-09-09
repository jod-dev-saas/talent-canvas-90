import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import { ChatBot } from "@/components/ChatBot";
import { ScrollToTopOnRouteChange } from "@/components/ScrollToTopOnRouteChange";
import Index from "./pages/Index";
import Candidate from "./pages/Candidate";
import Company from "./pages/Company";
import ResumeBuilder from "./pages/candidate/ResumeBuilder";
import ATSChecker from "./pages/candidate/ATSChecker";
import AskJod from "./pages/AskJod";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CompanyHow from "./pages/company/CompanyHow";
import CompanyContact from "./pages/company/CompanyContact";
import CandidateContact from "./pages/candidate/CandidateContact";
import CandidateHow from "./pages/How";
import CandidatePremium from "./pages/candidate/CandiatePremium";
import CompanyPremium from "./pages/company/CompanyPremium";
import How from "./pages/How";
import Contact from "./pages/Contact";

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
              <Route path="/askjod" element={<AskJod />} />
              <Route path="/about" element={<About />} />
              <Route path="/how" element={<How />} />
              <Route path="/contact" element={<Contact />} />

              {/* Candidate */}

              <Route path="/candidate" element={<Candidate />} />
              <Route path="/candidate/contact" element={<CandidateContact />} />
              <Route path="/candidate/how" element={<CandidateHow />} />
              <Route path="/candidate/resumebuilder" element={<ResumeBuilder />} />
              <Route path="/candidate/atschecker" element={<ATSChecker />} />
              <Route path="/candidate/premium" element={<CandidatePremium />} />
              <Route path="/candidate/askjod" element={<AskJod />} />

              {/* Company */}

              <Route path="/company" element={<Company />} />
              <Route path="/company/premium" element={<CompanyPremium />} />
              <Route path="/company/contact" element={<CompanyContact />} />
              <Route path="/company/how" element={<CompanyHow />} />
              {/* <Route path="/company/top-rated" element={<TopRatedCandidates />} />
              <Route path="/company/freshers" element={<Freshers />} />
              <Route path="/company/experienced" element={<Experienced />} />  */}
              <Route path="/company/askjod" element={<AskJod />} />

              {/* 404 */}

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

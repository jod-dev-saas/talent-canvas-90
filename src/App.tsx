import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom"; // <-- no BrowserRouter here
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
import CandidateHow from "./pages/candidate/CandidateHow";
import CandidatePremium from "./pages/candidate/CandiatePremium";
import CompanyPremium from "./pages/company/CompanyPremium";
import How from "./pages/How";
import Contact from "./pages/Contact";
import SignIn from "./pages/candidate/CandidateSignIn";
import AuthCallback from "./pages/auth/AuthCallback";
import SignUp from "./pages/candidate/CandidateSignUp";
import CompanySignUp from "./pages/company/CompanySignUp";
import CompanySignIn from "./pages/company/CompanySignin";

const queryClient = new QueryClient();

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
            <ScrollToTopOnRouteChange />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/askjod" element={<AskJod />} />
              <Route path="/about" element={<About />} />
              <Route path="/how" element={<How />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/candidate/auth/signin" element={<SignIn />} />
              <Route path="/candidate/auth/signup" element={<SignUp />} />
              <Route path="/candidate/auth/callback" element={<AuthCallback/>} />

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
              <Route path="/company/askjod" element={<AskJod />} />

              <Route path="/company/auth/signup" element={<CompanySignUp />} />
              <Route path="/company/auth/signin" element={<CompanySignIn />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

          {/* Global ChatBot - available on all pages */}
          <Suspense fallback={null}>
            <ChatBot />
          </Suspense>
        </CustomCursor>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

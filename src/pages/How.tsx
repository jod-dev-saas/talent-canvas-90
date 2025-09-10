/**
 * app/candidate/how/page.tsx
 * How-It-Works page (route: /candidate/how)
 *
 * Purpose:
 * - Explain JOD workflow to both Candidates and Company HRs on the same route
 * - Provide a role toggle (Candidate / Company) so visitors immediately see the flow
 * - Keep content compact, action-driven and accessible
 *
 * Notes / README:
 * - Client component (uses local UI state + framer-motion). Keep it client-only.
 * - TODO: Hook analytics events for `role-switch`, `cta-click` and A/B copy testing.
 * - TODO: Add server-side SEO meta overrides if you need role-specific indexed pages.
 * - TODO: Consider preloading Ask JOD and Resume Builder routes for better UX.
 */

"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  User,
  CheckCircle,
  FileText,
  Zap,
  ClipboardList,
  LifeBuoy,
  CalendarCheck,
  Star,
  Building2,
  Search,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { Header } from "@/components/Header";

export const metadata = {
  title: "How it Works — JOD",
  description:
    "How JOD works for candidates and hiring teams. Create project-first profiles, optimize with ATS & Resume tools, or search and hire top software talent faster.",
};

const CANDIDATE_STEPS = [
  {
    id: 1,
    title: "Create a Project-First Profile",
    description:
      "Show your work — projects, GitHub links, short impact bullets and skills used in each project.",
    icon: User,
    highlights: [
      "Add project links and concise outcome-driven bullets",
      "Tag skills so companies find you by filters",
      "Use the Resume Builder to export ATS-friendly PDFs",
    ],
  },
  {
    id: 2,
    title: "Optimize with Free Tools",
    description:
      "Run resume checks, improve keywords and make your profile discoverable to hiring teams.",
    icon: FileText,
    highlights: [
      "ATS Checker shows keyword gaps and formatting fixes",
      "Ask JOD gives quick title & bullet suggestions",
      "Pick clean templates and save drafts for later",
    ],
  },
  {
    id: 3,
    title: "Get Discovered & Interview",
    description:
      "Companies browse the pool and contact candidates directly — schedule interviews with one click.",
    icon: CalendarCheck,
    highlights: [
      "Control visibility (public / limited)",
      "Share your scheduler or accept interview invites",
      "Export a PDF snapshot of your profile for recruiters",
    ],
  },
];

const COMPANY_STEPS = [
  {
    id: 1,
    title: "Search Curated Talent",
    description:
      "Search by skills, projects, experience level or verified GitHub work — find candidates faster.",
    icon: Search,
    highlights: [
      "Use filters for skills, experience, and project tags",
      "Run Ask JOD to generate shortlist prompts",
      "Save searches and create reusable shortlists",
    ],
  },
  {
    id: 2,
    title: "Shortlist & Evaluate",
    description:
      "View candidate snapshots and ATS reports; request code samples or schedule interviews instantly.",
    icon: Users,
    highlights: [
      "See ATS-friendliness & resume recommendations",
      "Request a short technical assessment or GitHub sample",
      "Export shortlisted profiles as PDF for your hiring team",
    ],
  },
  {
    id: 3,
    title: "Hire & Onboard",
    description:
      "Connect directly, schedule interviews and bring new hires on board with minimal fuss.",
    icon: Building2,
    highlights: [
      "Use calendar links and integrated scheduling",
      "Request reference or assessment reports",
      "Manage candidate contacts and offer flow",
    ],
  },
];

const SHARED_BENEFITS = [
  {
    icon: Zap,
    title: "Faster Outcomes",
    desc: "Reduce screening time with focused shortlists and better resume signals.",
  },
  {
    icon: ClipboardList,
    title: "Quality Matches",
    desc: "Project-first profiles increase match quality over keyword-only resumes.",
  },
  {
    icon: LifeBuoy,
    title: "Guidance Built In",
    desc: "Ask JOD and Resume tools help candidates improve and recruiters craft better searches.",
  },
  {
    icon: Star,
    title: "Actionable Insights",
    desc: "ATS scores, keyword gaps and recommended improvements make decisions faster.",
  },
];

export default function How() {
  const [role, setRole] = useState<"candidate" | "company">("candidate");
  const [selectedStep, setSelectedStep] = useState<number | null>(1);

  useEffect(() => {
    // Focus on the first step when role changes (accessibility)
    setSelectedStep(1);
    const el = document.querySelector<HTMLElement>(`[data-step='1']`);
    if (el) el.focus();
  }, [role]);

  const steps = role === "candidate" ? CANDIDATE_STEPS : COMPANY_STEPS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">How JOD Works</h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                Whether you’re looking to be discovered or to hire great software talent —
                JOD matches project-first candidates with companies faster, with
                better signals and fewer wasted interviews.
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <Button
                  variant={role === "candidate" ? "default" : "ghost"}
                  onClick={() => setRole("candidate")}
                  aria-pressed={role === "candidate"}
                >
                  Candidates
                </Button>

                <Button
                  variant={role === "company" ? "default" : "ghost"}
                  onClick={() => setRole("company")}
                  aria-pressed={role === "company"}
                >
                  Hiring Team
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {role === "candidate" ? (
                  <>
                    <Button asChild aria-label="Create profile">
                      <a href="/candidate" className="flex items-center gap-2">
                        Create Profile
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>

                    <Button variant="ghost" asChild aria-label="Open resume builder">
                      <a href="/resume-builder">Resume Builder</a>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild aria-label="Browse talent">
                      <a href="/company">Browse Talent</a>
                    </Button>

                    <Button variant="ghost" asChild aria-label="Contact sales">
                      <a href="/company/premium">Contact Sales</a>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const active = selectedStep === step.id;
                return (
                  <motion.article
                    key={step.id}
                    data-step={step.id}
                    tabIndex={0}
                    onClick={() => setSelectedStep(step.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedStep(step.id);
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    aria-label={`Step ${step.id}: ${step.title}`}
                    className={`group cursor-pointer rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-ring ${
                      active ? "ring-2 ring-primary/40 bg-card" : "bg-card"
                    }`}
                  >
                    <Card className="h-full">
                      <CardHeader className="text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary/70 to-primary/30 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" aria-hidden />
                        </div>
                        <Badge className="mx-auto mb-2" variant="outline">
                          Step {step.id}
                        </Badge>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground max-w-xs mx-auto">
                          {step.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 px-4 pb-4">
                        {step.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-3" aria-hidden>
                            <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{h}</p>
                          </div>
                        ))}

                        <div className="pt-2">
                          <Button asChild className="w-full" aria-label={`Take action for ${step.title}`}>
                            <a
                              href={
                                role === "candidate"
                                  ? step.id === 1
                                    ? "/candidate"
                                    : step.id === 2
                                    ? "/resume-builder"
                                    : "/candidate"
                                  : step.id === 1
                                  ? "/company"
                                  : step.id === 2
                                  ? "/company"
                                  : "/company/premium"
                              }
                              onClick={() => {
                                /* TODO: analytics event: click-step-cta (role, step) */
                              }}
                            >
                              {role === "candidate"
                                ? step.id === 1
                                  ? "Create Profile"
                                  : step.id === 2
                                  ? "Open Resume Builder"
                                  : "Get Discovered"
                                : step.id === 1
                                ? "Search Talent"
                                : step.id === 2
                                ? "Shortlist Candidates"
                                : "Contact Sales"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Shared Benefits */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">What JOD Gives You</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                Tools and workflows focused on practical outcomes — whether you’re
                a candidate or a hiring team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SHARED_BENEFITS.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx * 0.05 }}>
                    <Card className="h-full text-center">
                      <CardHeader>
                        <Icon className="h-7 w-7 text-primary mx-auto mb-3" />
                        <CardTitle className="text-base">{b.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{b.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials (single unified testimonial) */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-400" aria-hidden />
                    ))}
                  </div>

                  <blockquote className="text-lg text-muted-foreground italic mb-4">
                    "JOD helped us cut hiring time in half and onboard candidates who immediately added value."
                  </blockquote>
                  <div className="font-semibold">A Hiring Lead, Tech Startup</div>
                  <div className="text-sm text-muted-foreground">Talent Acquisition</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">Build profiles, run checks or start hiring — fast.</p>

              <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">
                <Button asChild className="w-full">
                  <a href={role === "candidate" ? "/candidate" : "/company"}>
                    {role === "candidate" ? "Create Profile" : "Browse Talent"}
                  </a>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <a href={role === "candidate" ? "/resume-builder" : "/company/premium"}>
                    {role === "candidate" ? "Try Resume Builder" : "Contact Sales"}
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

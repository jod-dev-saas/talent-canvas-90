/**
 * app/company/how/page.tsx
 * Company How-It-Works page for JOD (route: /company/how)
 *
 * Purpose:
 * - Explain the JOD workflow from a company's perspective
 * - Highlight benefits, tools (Ask JOD, candidate filters, ATS compatibility), and next steps for hiring teams
 * - Interactive step cards and CTAs to company flows
 *
 * Notes:
 * - Client component because it uses local UI state & framer-motion.
 * - Add README header comments and TODOs for analytics / Supabase contact capture.
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
  Search,
  Users,
  CalendarCheck,
  CheckCircle,
  Zap,
  Code,
  FileText,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { CompanyHeader } from "@/components/CompanyHeader";

export const metadata = {
  title: "How it Works — Companies | JOD",
  description:
    "How companies can discover and hire top software talent fast with JOD — reverse hiring, smart filters, and Ask JOD recruiter tools.",
};

const PROCESS_STEPS = [
  {
    id: 1,
    title: "Define the Role & Must-Haves",
    description:
      "Create a concise role brief and the must-have skills so our search surfaces only relevant candidates.",
    icon: Search,
    highlights: [
      "Specify skills, experience level, tech stack, and sample projects you care about",
      "Add non-negotiables (e.g., language, timezone, remote/on-site)",
      "Save role briefs as reusable templates for repeated hires",
    ],
  },
  {
    id: 2,
    title: "Search, Shortlist & Score",
    description:
      "Use advanced filters, project tags, and Ask JOD prompts to shortlist the best matches instantly.",
    icon: Users,
    highlights: [
      "Boolean & tag-based search across project-first profiles",
      "Auto-generated search prompts from Ask JOD (simulated for v1)",
      "Quick ATS-friendly snapshot and resume score for each candidate",
    ],
  },
  {
    id: 3,
    title: "Contact, Interview & Hire",
    description:
      "Contact candidates directly, schedule interviews, and convert the best fits — efficiently.",
    icon: CalendarCheck,
    highlights: [
      "Message candidates or request a calendar link for scheduling",
      "Download a PDF snapshot for internal review and feedback",
      "Mark hires and track pipeline within the platform",
    ],
  },
];

const DIFFERENTIATORS = [
  {
    icon: Zap,
    title: "Reverse Hiring",
    desc: "Companies search — candidates are discovered, cutting posting noise.",
  },
  {
    icon: Code,
    title: "Project-First Profiles",
    desc: "See actual work — projects, links, and impact bullets, not just résumés.",
  },
  {
    icon: FileText,
    title: "ATS-Friendly Snapshots",
    desc: "Quick resume scoring and PDF exports for easy internal sharing.",
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    desc: "Candidates choose visibility — contact only those who opt in.",
  },
  {
    icon: Star,
    title: "Fast ROI",
    desc: "Reduce time-to-hire and interviewer hours with better shortlists.",
  },
];

const TESTIMONIALS = [
  {
    quote: "We reduced our screening time by 70% — high-quality shortlists every week.",
    author: "Head of Talent, ScaleX",
    role: "Recruiting Lead",
  },
];

export default function CompanyHow() {
  const [selected, setSelected] = useState<number | null>(1);

  // focus selected card for keyboard users
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-step="${selected}"]`);
    if (el) el.focus();
  }, [selected]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CompanyHeader />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">How JOD Helps Companies</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                Discover top software talent faster with targeted search, project-first profiles, and our recruiter assistant.
              </p>

              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <a href="/company/premium">Explore Plans</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/company">Browse Candidates</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-6">
              {PROCESS_STEPS.map((step) => {
                const Icon = step.icon;
                const active = selected === step.id;
                return (
                  <motion.article
                    key={step.id}
                    data-step={step.id}
                    tabIndex={0}
                    onClick={() => setSelected(step.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelected(step.id);
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`group cursor-pointer rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-ring ${
                      active ? "ring-2 ring-primary/30 bg-card" : "bg-card"
                    }`}
                  >
                    <Card className="h-full">
                      <CardHeader className="text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary/70 to-primary/30 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
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
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{h}</p>
                          </div>
                        ))}

                        <div className="pt-2">
                          <Button asChild className="w-full">
                            <a href="/company">Start Searching<ArrowRight className="ml-2 h-4 w-4" /></a>
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

        {/* Differentiators */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Why Recruiters Choose JOD</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                Focus on quality matches and reduce time spent screening.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIFFERENTIATORS.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
                    <Card className="h-full text-center">
                      <CardHeader>
                        <Icon className="h-7 w-7 text-primary mx-auto mb-3" />
                        <CardTitle className="text-base">{d.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{d.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>

                    <blockquote className="text-lg text-muted-foreground italic mb-4">“{t.quote}”</blockquote>
                    <div className="font-semibold">{t.author}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-muted/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to hire better, faster?</h3>
            <p className="text-muted-foreground mb-6">Start browsing curated software talent or talk to sales for enterprise needs.</p>

            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/company">Browse Candidates</a>
              </Button>

              <Button variant="outline" asChild>
                <a href="/company/premium">Contact Sales</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * app/candidate/how/page.tsx
 * Candidate How-It-Works page for JOD (route: /candidate/how)
 *
 * Purpose:
 * - Explain the JOD workflow from a candidate's perspective
 * - Highlight benefits, tools (resume builder, ATS checker, Ask JOD), and next steps
 * - Interactive step cards and CTAs to candidate flows
 *
 * Notes:
 * - Client component because it uses local UI state & framer-motion.
 * - Add README header comments and TODOs for analytics / A/B copy tests.
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
} from "lucide-react";
import { motion } from "framer-motion";
import { CandidateHeader } from "@/components/CandidateHeader";
import { Header } from "@/components/Header";

export const metadata = {
  title: "How it Works — Candidates | JOD",
  description:
    "Step-by-step guide for candidates: create a project-first profile, optimize with resume & ATS tools, get discovered by companies and land interviews faster.",
};

const PROCESS_STEPS = [
  {
    id: 1,
    title: "Create a Project-First Profile",
    description:
      "Showcase real work — projects, GitHub links, short case-studies, and the skills you actually use.",
    icon: User,
    highlights: [
      "Add project links and short impact bullets (what you built and outcomes)",
      "Add skills as tags so companies can find you via filters",
      "Upload resume or use our Resume Builder to create an ATS-friendly CV",
    ],
  },
  {
    id: 2,
    title: "Optimize & Stand Out",
    description:
      "Use JOD's free tools to make your profile discoverable and recruiter-ready.",
    icon: FileText,
    highlights: [
      "Run the ATS Checker to score and fix resume issues",
      "Pick a clean resume template from Resume Builder and export PDF",
      "Get quick Ask JOD tips for titles, bullet points, and keywords",
    ],
  },
  {
    id: 3,
    title: "Get Discovered & Convert",
    description:
      "Companies search our talent pool — get contacted for interviews and schedule calls directly.",
    icon: CalendarCheck,
    highlights: [
      "Set your visibility (public / limited) and preferred roles",
      "Receive direct messages from hiring teams or share your scheduler link",
      "Export a PDF snapshot of your profile when requested",
    ],
  },
];

const BENEFITS = [
  {
    icon: Zap,
    title: "Faster Interviews",
    desc: "Recruiters find qualified candidates quickly — fewer wasted screens.",
  },
  {
    icon: ClipboardList,
    title: "Better Match",
    desc: "Project-first profiles help you land roles that actually fit your experience.",
  },
  {
    icon: LifeBuoy,
    title: "Career Guidance",
    desc: "Ask JOD provides quick, actionable tips for improving your profile and interview prep.",
  },
  {
    icon: Star,
    title: "Showcase Impact",
    desc: "Highlight measurable outcomes — not just responsibilities.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "JOD helped me land my first backend role — I was contacted within 2 weeks of uploading a project-driven profile.",
    author: "Riya Sharma",
    role: "Backend Engineer",
  },
];

export default function How() {
  const [selected, setSelected] = useState<number | null>(1);

  // Accessibility: ensure focus on selected card for keyboard users
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-step="${selected}"]`);
    if (el) el.focus();
  }, [selected]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How JOD Works — for Candidates
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Create a profile that shows real work. Optimize it for ATS and
                recruiters. Get discovered — faster.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild aria-label="Create profile">
                  <a href="/candidate" className="flex items-center gap-2">
                    Create Profile
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  aria-label="Open resume builder"
                >
                  <a href="/resume-builder">Resume Builder</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-10 px-4">
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
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(step.id);
                      }
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
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
                          <div
                            key={i}
                            className="flex items-start gap-3"
                            aria-hidden
                          >
                            <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {h}
                            </p>
                          </div>
                        ))}

                        <div className="pt-2">
                          <Button
                            asChild
                            className="w-full"
                            aria-label={`Take action for ${step.title}`}
                          >
                            <a
                              href={
                                step.id === 1
                                  ? "/candidate"
                                  : step.id === 2
                                  ? "/resume-builder"
                                  : "/candidate"
                              }
                              onClick={() => {
                                /* TODO: analytics event: click-step-cta */
                              }}
                            >
                              {step.id === 1
                                ? "Create Profile"
                                : step.id === 2
                                ? "Open Resume Builder"
                                : "Get Discovered"}
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

        {/* Benefits */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Why Candidates Love JOD</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                Designed for software professionals — show what you built and be
                found by the right people.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                  >
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

        {/* Testimonial */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 text-yellow-400"
                          aria-hidden
                        />
                      ))}
                    </div>

                    <blockquote className="text-lg text-muted-foreground italic mb-4">
                      “{t.quote}”
                    </blockquote>
                    <div className="font-semibold">{t.author}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                Ready to make your profile work for you?
              </h3>
              <p className="text-muted-foreground mb-6">
                Build, optimize, and get discovered — all in one platform.
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">
                <Button asChild className="w-full">
                  <a href="/candidate">Create Profile</a>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <a href="/resume-builder">Try Resume Builder</a>
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

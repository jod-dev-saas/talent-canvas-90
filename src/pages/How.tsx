/**
 * How It Works Page - JOD process explanation with interactive steps
 * 
 * Shows the 3-step process: Create Profile → Get Discovered → Get Hired
 */

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User, Search, MessageCircle, CheckCircle, Star, Building2, FileText, Zap, Shield, Code, Users } from "lucide-react";
import { motion } from "framer-motion";

const PROCESS_STEPS = [
  {
    id: 1,
    title: "Create Your Profile",
    subtitle: "(candidates)",
    description: "Build a project-first profile — list your skills, showcase projects, link GitHub/portfolio, and upload a resume.",
    icon: User,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Build a project-first profile — list your skills, showcase projects, link GitHub/portfolio",
      "Use our Resume Builder to craft a clean, ATS-friendly CV",
      "Run the ATS Checker to optimize your resume for recruiter systems",
      "Recruiters see your real work and verified skills — not long, generic resumes"
    ]
  },
  {
    id: 2,
    title: "Browse & Discover",
    subtitle: "(companies)",
    description: "Companies search the candidate pool using skill filters, experience level, and project tags.",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    details: [
      "Companies search using skill filters, experience level, and project tags",
      "Use Ask JOD to get instant shortlist prompts or role-specific search strings",
      "View concise candidate profiles and contact top matches directly",
      "No job posting, no wasted interviews — shorten screening time"
    ]
  },
  {
    id: 3,
    title: "Contact, Interview, Hire",
    subtitle: "",
    description: "Connect directly through the profile or use the calendar link to schedule interviews.",
    icon: MessageCircle,
    color: "from-green-500 to-teal-500",
    details: [
      "Connect directly through the profile or use calendar link to schedule interviews",
      "Export candidate details or download a PDF snapshot for your hiring team",
      "Request candidate assessments or references for higher confidence",
      "Smooth flow from discovery → contact → hire reduces time-to-hire and cost-per-hire"
    ]
  }
];

const DIFFERENTIATORS = [
  {
    icon: Zap,
    title: "Reverse Hiring",
    description: "Companies search — candidates are discovered",
    color: "text-yellow-500"
  },
  {
    icon: Code,
    title: "Project-First Profiles", 
    description: "Projects > buzzwords",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    title: "Candidate Tools Included",
    description: "Resume Builder, ATS Checker, Profile Boosts",
    color: "text-green-500"
  },
  {
    icon: MessageCircle,
    title: "Ask JOD Assistant",
    description: "Get recruiter prompts and profile improvement tips instantly",
    color: "text-purple-500"
  },
  {
    icon: Shield,
    title: "Privacy & Consent",
    description: "Candidates control what's public and who can contact them",
    color: "text-red-500"
  }
];

const TESTIMONIALS = [
  {
    quote: "We cut time-to-hire by 60% using JOD's candidate pool.",
    author: "Talent Lead, Startup X",
    role: "Talent Acquisition"
  }
];

export default function How() {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                How JOD Works
              </h1>
              <p className="text-2xl text-primary font-semibold mb-4">
                Hire faster, spend less
              </p>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                One platform. Three steps. Zero guesswork.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {PROCESS_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Connector Line */}
                    {index < PROCESS_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-24 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-10" />
                    )}
                    
                    <Card 
                      className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer"
                      onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="outline" className="w-fit mx-auto mb-3">
                          Step {step.id}
                        </Badge>
                        <CardTitle className="text-2xl">
                          {step.title}
                          {step.subtitle && (
                            <span className="block text-lg text-primary font-normal mt-1">
                              {step.subtitle}
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What Makes JOD Different */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Built for Software Teams — What Makes JOD Different
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIFFERENTIATORS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <Icon className={`h-8 w-8 ${item.color} mx-auto mb-3`} />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What Our Users Say
              </h2>
            </div>

            <div className="grid gap-6">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-lg text-muted-foreground italic mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Get Started?
              </h2>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Candidates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Create your profile — it takes less than 10 minutes.
                    </p>
                    <Button asChild className="w-full">
                      <a href="/candidate">
                        Create Your Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Companies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Browse top software talent or schedule a demo.
                    </p>
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <a href="/company">Browse Talent</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
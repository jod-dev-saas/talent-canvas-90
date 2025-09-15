/**
 * app/company/premium/page.tsx
 *
 * Company Premium / Pricing page (route: /company/premium)
 * - Company-focused pricing tiers (Starter, Growth, Enterprise)
 * - Contact Sales modal saves to localStorage (Supabase integration commented)
 * - Accessible, responsive, and production-ready UI (client component)
 *
 * Notes:
 * - Replace Header import if you use a different header (CompanyHeader / CandidateHeader).
 * - To enable Supabase writes: uncomment the supabase insert block and ensure lib/supabase.ts exists.
 * - Payments: placeholder handlers included with TODO comments.
 */

"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Star, Zap, Crown, ArrowRight, Users, Database } from "lucide-react";
import { motion } from "framer-motion";
import { CompanyHeader } from "@/components/CompanyHeader";

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  popular?: boolean;
  cta: string;
  ctaVariant: "default" | "outline";
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹0",
    period: "/month",
    description: "Small teams — search candidates and shortlist fast.",
    icon: Star,
    features: [
      "10 candidate views / month",
      "Basic filters & skill tags",
      "Email support",
      "Access to public profiles",
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline",
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹4999",
    period: "/month",
    description: "For growing engineering teams — priority visibility & workflows.",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited candidate views",
      "Advanced filters & boolean search",
      "Priority placement & alerts",
      "Bulk outreach templates",
      "Interview scheduling integrations (Cal.com)",
      "CSV export & reports",
    ],
    cta: "Start 14-Day Trial",
    ctaVariant: "default",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "High-volume hiring and custom integrations for enterprises.",
    icon: Crown,
    features: [
      "Everything in Growth",
      "Dedicated account manager",
      "SSO / SCIM & SAML",
      "API access & ATS integrations",
      "On-prem / private indexing options",
      "Dedicated SLAs & onboarding",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline",
  },
];

interface ContactForm {
  name: string;
  email: string;
  company: string;
  plan: string;
  message: string;
}

export const metadata = {
  title: "Premium — Companies | JOD",
  description:
    "Premium plans for companies — fast sourcing, advanced filters, ATS & API integrations, and enterprise support.",
};

export default function CompanyPremium() {
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    company: "",
    plan: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSales = (planId: string) => {
    setSelectedPlan(planId);
    setForm((prev) => ({ ...prev, plan: planId }));
    setContactOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: integrate with Supabase / CRM here. Example:
      // import { supabase } from "@/lib/supabase";
      // await supabase.from("sales_contacts").insert({ ...form, created_at: new Date().toISOString() });

      // Local fallback: save to localStorage
      const contacts = JSON.parse(localStorage.getItem("company_sales_contacts") || "[]");
      contacts.push({
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("company_sales_contacts", JSON.stringify(contacts));

      toast({
        title: "Request received",
        description: "Thanks — our sales team will reach out within 24 hours.",
      });

      // reset form & close modal
      setForm({ name: "", email: "", company: "", plan: "", message: "" });
      setContactOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CompanyHeader />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Premium for Companies
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                Source top software talent faster. Flexible plans for startups,
                scaling teams, and enterprises — built for speed, control, and scale.
              </p>

              <Badge variant="secondary" className="px-3 py-2">
                Includes 14-day free trial for Growth plan
              </Badge>
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {PRICING_TIERS.map((tier, idx) => {
                const Icon = tier.icon;
                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      className={`h-full transition-transform ${
                        tier.popular ? "ring-2 ring-primary/30 scale-102" : "hover:shadow-lg"
                      }`}
                    >
                      {tier.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-primary text-primary-foreground px-4 py-1">
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-6">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                            tier.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="h-8 w-8" />
                        </div>

                        <CardTitle className="text-2xl mb-1">{tier.name}</CardTitle>
                        <div className="mb-3">
                          <span className="text-3xl font-bold">{tier.price}</span>
                          {tier.period && <span className="text-muted-foreground ml-2">{tier.period}</span>}
                        </div>

                        <CardDescription className="text-sm text-muted-foreground max-w-xs mx-auto">
                          {tier.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          {tier.features.map((f, fi) => (
                            <div key={fi} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{f}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <Button
                            className="w-full"
                            variant={tier.ctaVariant}
                            size="lg"
                            onClick={() => {
                              if (tier.id === "enterprise") {
                                handleContactSales(tier.id);
                              } else if (tier.id === "starter") {
                                // Starter: quick onboarding path
                                window.location.href = "/company/signup";
                              } else {
                                // Growth: trial flow placeholder
                                // TODO: wire payments or trial signup flow
                                setSelectedPlan(tier.id);
                                handleContactSales(tier.id); // for now open contact to capture details
                                // toast({ title: "Trial", description: "Trial signup coming soon" });
                              }
                            }}
                          >
                            {tier.cta}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enterprise Benefits */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-3">Enterprise-grade hiring</h2>
                <p className="text-muted-foreground mb-4">
                  For teams hiring at scale, JOD provides robust integrations,
                  analytics, and dedicated support to streamline your recruiting
                  operations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-primary mt-1" />
                    <span className="text-sm text-muted-foreground">
                      API & ATS integrations for one-click candidate sync
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Dedicated onboarding and account management
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Custom SLAs and priority support
                    </span>
                  </li>
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="bg-card rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-2">Trusted by fast-growing teams</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Companies that need velocity in hiring rely on JOD's prioritized candidate pool and recruiter workflows.
                </p>
                <Button variant="outline" onClick={() => handleContactSales("enterprise")}>
                  Contact Sales
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-4">FAQ</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  q: "Do you offer a trial?",
                  a: "Yes — Growth plan includes a 14-day free trial. No credit card required for trial signups.",
                },
                {
                  q: "Can I change plans later?",
                  a: "Absolutely — upgrade or downgrade your plan from the billing settings or contact sales for help.",
                },
                {
                  q: "How fast can we onboard?",
                  a: "Small teams can get started in under an hour; enterprise onboarding timelines vary and include dedicated support.",
                },
                {
                  q: "Do you integrate with our ATS?",
                  a: "Yes — we support integrations via API, webhooks, and custom connectors for major ATS platforms.",
                },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="font-semibold text-foreground mb-1">{faq.q}</div>
                    <div className="text-sm text-muted-foreground">{faq.a}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-muted/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to accelerate hiring?</h3>
            <p className="text-muted-foreground mb-6">
              Talk to our team to design a plan that fits your hiring goals.
            </p>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => handleContactSales("enterprise")}>Contact Sales</Button>
              <Button variant="outline" onClick={() => { window.location.href = "/company/signup"; }}>
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Sales Modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Sales</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                aria-label="Full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                aria-label="Work email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                required
                aria-label="Company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Input id="plan" value={form.plan || selectedPlan} readOnly aria-label="Selected plan" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                rows={4}
                aria-label="Message"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Sending..." : "Send Request"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setContactOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

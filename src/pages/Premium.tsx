/**
 * Premium Pricing Page - Subscription tiers with contact sales modal
 * 
 * Shows pricing plans with Supabase integration for sales contacts
 */

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Star, Zap, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
    price: "Free",
    period: "",
    description: "Perfect for exploring opportunities and building your professional presence.",
    icon: Star,
    features: [
      "Create detailed profile",
      "Basic skill assessments", 
      "Apply to up to 10 jobs/month",
      "Standard profile visibility",
      "Community support"
    ],
    cta: "Get Started Free",
    ctaVariant: "outline"
  },
  {
    id: "growth",
    name: "Growth", 
    price: "$29",
    period: "/month",
    description: "Accelerate your career with premium features and priority visibility.",
    icon: Zap,
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited job applications",
      "Priority profile visibility",
      "Advanced skill verifications",
      "Resume optimization tools",
      "Interview preparation resources",
      "Direct messaging with companies",
      "Salary negotiation guidance"
    ],
    cta: "Start 7-Day Trial",
    ctaVariant: "default"
  },
  {
    id: "enterprise", 
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for companies and high-volume talent acquisition.",
    icon: Crown,
    features: [
      "Everything in Growth",
      "Custom branding options",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "API access for integrations",
      "Custom skill assessments",
      "Bulk hiring tools",
      "Priority customer support"
    ],
    cta: "Contact Sales",
    ctaVariant: "outline"
  }
];

interface ContactForm {
  name: string;
  email: string;
  company: string;
  plan: string;
  message: string;
}

export default function Premium() {
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    company: "",
    plan: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSales = (planId: string) => {
    setSelectedPlan(planId);
    setForm(prev => ({ ...prev, plan: planId }));
    setContactOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: Replace with Supabase integration
      // await supabase.from('sales_contacts').insert({
      //   name: form.name,
      //   email: form.email, 
      //   company: form.company,
      //   plan: form.plan,
      //   message: form.message,
      //   created_at: new Date().toISOString()
      // });

      // Temporary localStorage fallback
      const contacts = JSON.parse(localStorage.getItem('sales_contacts') || '[]');
      contacts.push({
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('sales_contacts', JSON.stringify(contacts));

      toast({
        title: "Contact Request Sent",
        description: "Our sales team will reach out within 24 hours."
      });

      setForm({ name: "", email: "", company: "", plan: "", message: "" });
      setContactOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send contact request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

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
                Accelerate Your Career
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Choose the plan that fits your career goals. Get premium features, 
                priority visibility, and dedicated support to land your dream job faster.
              </p>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                ✨ 7-day free trial • No credit card required
              </Badge>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {PRICING_TIERS.map((tier, index) => {
                const Icon = tier.icon;
                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                      tier.popular 
                        ? 'border-primary shadow-md scale-105 lg:scale-110' 
                        : 'hover:border-primary/50'
                    }`}>
                      {tier.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground px-4 py-1">
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-8">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                          tier.popular 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                          {tier.period && (
                            <span className="text-muted-foreground">{tier.period}</span>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {tier.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {tier.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button 
                          className="w-full"
                          variant={tier.ctaVariant}
                          size="lg"
                          onClick={() => {
                            if (tier.id === 'enterprise') {
                              handleContactSales(tier.id);
                            } else if (tier.id === 'starter') {
                              // Redirect to sign up
                              window.location.href = '/candidate';
                            } else {
                              // TODO: Integrate with payment system
                              toast({
                                title: "Coming Soon",
                                description: "Premium subscriptions will be available soon!"
                              });
                            }
                          }}
                        >
                          {tier.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Common questions about our premium plans and features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "Can I cancel anytime?",
                  answer: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period."
                },
                {
                  question: "Is there a free trial?",
                  answer: "Growth plan includes a 7-day free trial. No credit card required to start, and you can cancel before the trial ends."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers."
                },
                {
                  question: "Do you offer refunds?", 
                  answer: "We offer a 30-day money-back guarantee if you're not satisfied with your premium experience."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Supercharge Your Career?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have accelerated their careers with TalentCanvas Premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => handleContactSales('enterprise')}>
                  Talk to Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Contact Sales Modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Our Sales Team</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your needs..."
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
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
/**
 * Contact Page - JOD Contact form with Supabase integration
 * 
 * Provides multiple ways to contact the team with form submission
 */

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Clock, Calendar, Building2, User, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

interface ContactForm {
  name: string;
  email: string;
  role: string;
  company: string;
  subject: string;
  message: string;
  preferredTime: string;
}

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email Us",
    details: "hello@jod.com",
    description: "Send us an email anytime"
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon–Fri, 9:00 AM – 6:00 PM (IST)",
    description: "We're available during business hours"
  },
  {
    icon: Calendar,
    title: "Schedule a Call",
    details: "Book time with us",
    description: "Schedule a personalized demo"
  }
];

const DIRECT_OPTIONS = [
  {
    title: "Schedule a Demo / Call",
    description: "Book a personalized demo with our team",
    action: "Book Now",
    href: "#", // TODO: Replace with NEXT_PUBLIC_CALCOM_URL
    icon: Calendar
  },
  {
    title: "Press & Partnerships",
    description: "Media inquiries and partnership opportunities",
    action: "Email Us",
    href: "mailto:press@jod.com",
    icon: MessageCircle
  },
  {
    title: "Careers & Hiring",
    description: "Join our team and shape the future of hiring",
    action: "View Careers",
    href: "mailto:careers@jod.com",
    icon: Users
  }
];

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    role: "",
    company: "",
    subject: "",
    message: "",
    preferredTime: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: Replace with Supabase integration
      // await supabase.from('pings').insert({
      //   name: form.name,
      //   email: form.email,
      //   role: form.role,
      //   company: form.company,
      //   subject: form.subject,
      //   message: form.message,
      //   preferred_time: form.preferredTime,
      //   created_at: new Date().toISOString()
      // });

      // Temporary localStorage fallback
      const messages = JSON.parse(localStorage.getItem('contact_pings') || '[]');
      messages.push({
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('contact_pings', JSON.stringify(messages));

      toast({
        title: "Message Sent Successfully",
        description: "Thanks — we received your message. Expect a reply within 48 hours."
      });

      setForm({
        name: "",
        email: "",
        role: "",
        company: "",
        subject: "",
        message: "",
        preferredTime: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calcomUrl = import.meta.env.VITE_CALCOM_URL || "https://cal.com";

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
                Contact JOD
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have a question, partnership idea, or need help? We're here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {CONTACT_INFO.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{info.title}</CardTitle>
                        <CardDescription>{info.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="font-semibold text-foreground">
                          {info.title === "Schedule a Call" ? (
                            <Button asChild variant="outline" size="sm">
                              <a href={calcomUrl} target="_blank" rel="noopener noreferrer">
                                {info.details}
                              </a>
                            </Button>
                          ) : (
                            info.details
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact Form and Direct Options */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 48 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Role *</Label>
                          <Select value={form.role} onValueChange={(value) => setForm(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="candidate">Candidate</SelectItem>
                              <SelectItem value="recruiter">Recruiter</SelectItem>
                              <SelectItem value="partner">Partner</SelectItem>
                              <SelectItem value="press">Press</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={form.company}
                            onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Optional"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={form.subject}
                          onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          value={form.message}
                          onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                          rows={5}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time to Call</Label>
                        <Input
                          id="preferredTime"
                          value={form.preferredTime}
                          onChange={(e) => setForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                          placeholder="e.g., Weekdays 2-4 PM IST (optional)"
                        />
                      </div>

                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Direct Options */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Direct Options</CardTitle>
                    <CardDescription>
                      Quick links for specific needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {DIRECT_OPTIONS.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-foreground mb-1">{option.title}</div>
                            <div className="text-sm text-muted-foreground mb-2">{option.description}</div>
                            <Button asChild variant="outline" size="sm">
                              <a href={option.href} target="_blank" rel="noopener noreferrer">
                                {option.action}
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Support & Response Times */}
                <Card>
                  <CardHeader>
                    <CardTitle>Support & Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium">General inquiries</span>
                      <span className="text-sm text-muted-foreground">Reply within 48 hours</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium">Partnerships / enterprise</span>
                      <span className="text-sm text-muted-foreground">Reply within 24-48 hours</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Urgent / outage</span>
                      <span className="text-sm text-muted-foreground">Priority response</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Want to see candidate profiles now?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="/company">Browse Candidates</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/candidate">Create a Profile</a>
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
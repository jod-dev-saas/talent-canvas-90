/**
 * Contact Page - Contact form with Supabase integration
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
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email Us",
    details: "hello@talentcanvas.com",
    description: "Send us an email anytime"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+1 (555) 123-4567",
    description: "Monday to Friday, 9AM-6PM PST"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "San Francisco, CA",
    description: "Schedule a meeting at our office"
  }
];

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: Replace with Supabase integration
      // await supabase.from('contact_messages').insert({
      //   name: form.name,
      //   email: form.email,
      //   subject: form.subject,
      //   message: form.message,
      //   created_at: new Date().toISOString()
      // });

      // Temporary localStorage fallback
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      messages.push({
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('contact_messages', JSON.stringify(messages));

      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you within 24 hours."
      });

      setForm({ name: "", email: "", subject: "", message: "" });
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
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have questions about TalentCanvas? Need help with your account? 
                We're here to help and would love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Options */}
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
                        <div className="font-semibold text-foreground">{info.details}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact Form and Schedule */}
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
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={form.subject}
                          onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          value={form.message}
                          onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Schedule Meeting */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule a Call</CardTitle>
                    <CardDescription>
                      Prefer to talk? Schedule a 15-minute call with our team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Quick Demo Call</div>
                          <div className="text-sm text-muted-foreground">15 minutes</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Available Times</div>
                          <div className="text-sm text-muted-foreground">Monday-Friday, 9AM-6PM PST</div>
                        </div>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <a href={calcomUrl} target="_blank" rel="noopener noreferrer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Call
                      </a>
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      Or email us at{" "}
                      <a href="mailto:hello@talentcanvas.com" className="text-primary hover:underline">
                        hello@talentcanvas.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Quick Links */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Answers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">How does pricing work?</div>
                      <div className="text-muted-foreground">
                        We offer free and premium plans. <a href="/premium" className="text-primary hover:underline">View pricing</a>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">Is my data secure?</div>
                      <div className="text-muted-foreground">
                        Yes, we use enterprise-grade security and never sell your data.
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-1">How do I delete my account?</div>
                      <div className="text-muted-foreground">
                        Contact us and we'll help you delete your account permanently.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
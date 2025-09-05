/**
 * About Page - Company mission, team, and values
 * 
 * Showcases TalentCanvas mission with interactive team cards and CTA
 */

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Users, Target, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
  email?: string;
  avatar: string;
}

// TODO: Update team members with real data
const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Former talent acquisition leader at Meta and Google. Passionate about revolutionizing how companies discover talent.",
    linkedin: "https://linkedin.com/in/sarahchen",
    email: "sarah@talentcanvas.com",
    avatar: "/team/sarah-chen.jpg"
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-founder", 
    bio: "Ex-engineering manager from Stripe. Builds scalable systems that match the right people to the right opportunities.",
    linkedin: "https://linkedin.com/in/marcusrodriguez",
    email: "marcus@talentcanvas.com",
    avatar: "/team/marcus-rodriguez.jpg"
  },
  {
    name: "Emma Thompson",
    role: "Head of Product",
    bio: "Product strategist with 8 years at LinkedIn. Designs user experiences that make career growth accessible to everyone.",
    linkedin: "https://linkedin.com/in/emmathompson",
    email: "emma@talentcanvas.com",
    avatar: "/team/emma-thompson.jpg"
  }
];

const STATS = [
  { label: "Active Candidates", value: "50K+", description: "Verified professionals" },
  { label: "Partner Companies", value: "1,200+", description: "Hiring actively" },
  { label: "Successful Matches", value: "8,500+", description: "Career transformations" },
  { label: "Average Time to Hire", value: "14 days", description: "From search to offer" }
];

export default function About() {
  const [joinWaitlistOpen, setJoinWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase or email service
    // await supabase.from('waitlist').insert({ email, page: 'about' });
    console.log('Waitlist signup:', email);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setJoinWaitlistOpen(false);
    }, 3000);
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
                About TalentCanvas
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're revolutionizing talent discovery by connecting exceptional professionals 
                with companies that value their unique skills and potential.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To eliminate bias in hiring and create a world where talent is 
                      discovered based on skills, potential, and fit—not just keywords 
                      on a resume.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      A future where every professional has equal access to career 
                      opportunities, and companies can discover diverse talent that 
                      drives innovation and growth.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Our Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Transparency, inclusivity, and innovation guide everything we do. 
                      We believe in authentic connections between people and purposeful work.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're a diverse group of technologists, designers, and talent experts 
                united by the mission to transform how hiring works.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {TEAM_MEMBERS.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-12 w-12 text-primary" />
                        {/* TODO: Replace with actual team photos */}
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                      <div className="flex justify-center gap-2">
                        {member.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {member.email && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${member.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact</h2>
              <p className="text-lg text-muted-foreground">
                Real numbers that represent real career transformations.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
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
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have discovered their dream roles 
                through TalentCanvas. The future of work starts here.
              </p>

              {!joinWaitlistOpen ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => setJoinWaitlistOpen(true)}
                >
                  Join the Waitlist
                </Button>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Join Our Waitlist</CardTitle>
                    <CardDescription>
                      Be the first to know when we launch new features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!submitted ? (
                      <form onSubmit={handleJoinWaitlist} className="space-y-4">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            Join Waitlist
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setJoinWaitlistOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-green-600 font-semibold mb-2">✓ Thank You!</div>
                        <p className="text-sm text-muted-foreground">
                          We'll be in touch soon with updates.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
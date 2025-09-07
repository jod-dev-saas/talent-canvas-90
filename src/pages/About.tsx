/**
 * About Page - JOD company mission, team, and values
 * 
 * Showcases JOD mission with interactive team cards and comparison table
 */

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Users, Target, Eye, Heart, Zap, Shield, TrendingUp, Clock, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

// TODO: Update team members with real data
const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "CEO & Co-founder",
    bio: "Former tech recruiter with 8+ years of experience. Frustrated with traditional hiring, built JOD to make it 10x faster.",
    avatar: "/team/alex-chen.jpg"
  },
  {
    name: "Sarah Martinez",
    role: "CTO & Co-founder", 
    bio: "Ex-Google engineer turned entrepreneur. Passionate about using AI to solve real-world hiring problems.",
    avatar: "/team/sarah-martinez.jpg"
  },
  {
    name: "David Kim",
    role: "Head of Product",
    bio: "Product designer with deep expertise in user experience. Previously at LinkedIn, now making job search delightful.",
    avatar: "/team/david-kim.jpg"
  }
];

const STATS = [
  { label: "Candidates Listed", value: "2,500+", icon: Users, color: "text-blue-500" },
  { label: "Companies Onboarded", value: "120+", icon: TrendingUp, color: "text-green-500" },
  { label: "Faster Hiring Time", value: "85%", icon: Clock, color: "text-purple-500" },
  { label: "Cost Reduction", value: "3x", icon: Target, color: "text-orange-500" }
];

const COMPARISON_DATA = [
  { feature: "Instant candidate matching", jod: true, traditional: false },
  { feature: "Built-in ATS score checker", jod: true, traditional: false },
  { feature: "Free resume builder", jod: true, traditional: false },
  { feature: "Cost-effective hiring", jod: true, traditional: false },
  { feature: "AI-powered insights (coming soon)", jod: true, traditional: false }
];

const CORE_VALUES = [
  {
    icon: Zap,
    title: "Speed & Efficiency",
    description: "Minimize hiring cycles and get results faster",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "No hidden fees, no data selling - complete honesty",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: TrendingUp,
    title: "Empowerment",
    description: "Helping candidates shine and companies thrive",
    color: "from-green-500 to-teal-500"
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Continuously enhancing our tools for better results",
    color: "from-purple-500 to-pink-500"
  }
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
                About JOD
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Jobs on Demand - Redefining how companies find top tech talent 
                and how candidates land their dream jobs faster.
              </p>
              <Button variant="secondary" className="text-lg px-4 py-2">
                🚀 Making hiring 10x faster & 3x more cost-effective
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center justify-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                At <strong>JOD</strong>, we're on a mission to <strong>redefine how companies find top tech talent</strong> and 
                how candidates land their <strong>dream jobs faster</strong>. We believe hiring should be{" "}
                <strong>quick, efficient, and human-centric</strong> — without the endless rounds of interviews 
                or wasting money on irrelevant applicants.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                💡 What We Do
              </h2>
              <p className="text-lg text-muted-foreground">
                JOD is a <strong>smart job-matching platform</strong> built for both{" "}
                <strong>candidates</strong> and <strong>recruiters</strong>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <Users className="h-6 w-6 text-primary" />
                      For Candidates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Build stunning resumes with our free builder</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Check your <strong>ATS score</strong> and optimize your profile</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Get <strong>AI-powered insights</strong> to improve visibility</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      For Companies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Instantly <strong>discover top candidates</strong> that match requirements</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Reduce <strong>hiring time</strong> drastically</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Cut <strong>interviewer costs</strong> significantly</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center justify-center gap-3">
                🌟 Our Vision
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become the <strong>go-to platform</strong> where <strong>top candidates</strong> and{" "}
                <strong>forward-thinking companies</strong> connect effortlessly, making hiring{" "}
                <strong>10x faster</strong> and <strong>3x more cost-effective</strong>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                🔑 Our Core Values
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CORE_VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                📊 Why JOD Stands Out
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Feature</TableHead>
                        <TableHead className="text-center font-semibold text-primary">JOD ✅</TableHead>
                        <TableHead className="text-center font-semibold">Traditional Hiring ❌</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {COMPARISON_DATA.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.feature}</TableCell>
                          <TableCell className="text-center">
                            {row.jod ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.traditional ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">👨‍💻 Meet the Team</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're a passionate team of <strong>developers, designers, and recruiters</strong> who have 
                lived the <strong>frustrations of job hunting and hiring</strong>. Our goal is to make the process{" "}
                <strong>seamless, data-driven, and delightful</strong> for everyone.
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
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </p>
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
              <h2 className="text-3xl font-bold text-foreground mb-4">📈 Our Impact So Far</h2>
              <p className="text-lg text-muted-foreground">
                Real numbers that represent real impact in the hiring world.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="mb-4">
                      <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                      <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="font-semibold text-foreground">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
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
                📬 Join Us on the Journey
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                We're just getting started, and we'd love for you to be part of our story.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      For Candidates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Build your resume, improve your ATS score, and land your dream job.
                    </p>
                    <Button asChild className="w-full">
                      <a href="/candidate">Get Started</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      For Recruiters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Find the right talent <strong>faster</strong> and <strong>smarter</strong>.
                      We are here a to help you get the best Talent ASAP.
                    </p>
                    <Button asChild className="w-full">
                      <a href="/company">Browse Talent</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {!joinWaitlistOpen ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => setJoinWaitlistOpen(true)}
                  variant="secondary"
                >
                  📩 Join Our Waitlist - Get Early Access
                </Button>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Join Our Waitlist</CardTitle>
                    <CardDescription>
                      Get early access to new features and updates.
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
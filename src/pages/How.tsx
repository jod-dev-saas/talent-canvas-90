/**
 * How It Works Page - Process explanation with interactive demo
 * 
 * Shows the 3-step process with animations and modal demo
 */

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User, Search, MessageCircle, CheckCircle, Star, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const PROCESS_STEPS = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Build a comprehensive profile showcasing your skills, experience, and projects. Our AI helps optimize it for maximum visibility.",
    icon: User,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Skills assessment and verification",
      "Project portfolio with live demos",
      "Experience timeline with achievements",
      "AI-powered profile optimization"
    ]
  },
  {
    id: 2,
    title: "Companies Discover You",
    description: "Top companies search our talent database using advanced filters. Your profile appears to hiring managers actively looking for your skills.",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    details: [
      "Advanced skill-based matching",
      "Real-time availability status",
      "Anonymous browsing protection",
      "Verified company access only"
    ]
  },
  {
    id: 3,
    title: "Connect & Interview",
    description: "Get contacted directly by interested employers. No middlemen, no recruiting fees. Just authentic connections with companies that want you.",
    icon: MessageCircle,
    color: "from-green-500 to-teal-500",
    details: [
      "Direct company communication",
      "Interview scheduling tools",
      "Salary transparency upfront",
      "Feedback and follow-up tracking"
    ]
  }
];

const DEMO_SLIDES = [
  {
    title: "Candidate Profile Creation",
    description: "See how easy it is to create a compelling profile that stands out to employers.",
    image: "/demo/profile-creation.png", // TODO: Add actual screenshots
    features: ["Drag & drop project uploads", "Real-time preview", "AI suggestions", "Skills verification"]
  },
  {
    title: "Company Search Interface", 
    description: "Companies use powerful filters to find candidates that match their exact requirements.",
    image: "/demo/company-search.png",
    features: ["Advanced skill filters", "Experience level targeting", "Location preferences", "Availability status"]
  },
  {
    title: "Direct Communication",
    description: "No third-party recruiters. Companies and candidates communicate directly through our platform.",
    image: "/demo/direct-messaging.png", 
    features: ["In-platform messaging", "Interview scheduling", "Document sharing", "Progress tracking"]
  }
];

export default function How() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);
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
                How It Works
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Discover how TalentCanvas connects exceptional professionals with companies 
                that value their unique skills. It's simple, transparent, and effective.
              </p>
              <Button size="lg" onClick={() => setDemoOpen(true)}>
                See Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
                    
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="outline" className="w-fit mx-auto mb-3">
                          Step {step.id}
                        </Badge>
                        <CardTitle className="text-2xl">{step.title}</CardTitle>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{detail}</span>
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

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why TalentCanvas Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Traditional hiring is broken. We're fixing it with transparency, 
                technology, and a human-centered approach.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* For Candidates */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Star className="h-6 w-6 text-blue-500" />
                      </div>
                      <CardTitle className="text-2xl">For Candidates</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">No More Black Holes</div>
                          <div className="text-sm text-muted-foreground">Get real feedback and know where you stand</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Direct Access</div>
                          <div className="text-sm text-muted-foreground">Talk directly to hiring managers, not recruiters</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Salary Transparency</div>
                          <div className="text-sm text-muted-foreground">See compensation ranges upfront</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Skills-First Matching</div>
                          <div className="text-sm text-muted-foreground">Be discovered for what you can do, not just keywords</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* For Companies */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-purple-500" />
                      </div>
                      <CardTitle className="text-2xl">For Companies</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Pre-Qualified Talent</div>
                          <div className="text-sm text-muted-foreground">Access verified professionals actively looking</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Advanced Filtering</div>
                          <div className="text-sm text-muted-foreground">Find exact skills, experience, and culture fit</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">No Recruiting Fees</div>
                          <div className="text-sm text-muted-foreground">Direct hire without expensive middlemen</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Faster Time to Hire</div>
                          <div className="text-sm text-muted-foreground">Average 14 days from search to offer</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
                Ready to Experience the Future of Hiring?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands who have already discovered better career opportunities 
                through TalentCanvas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/candidate">Create Your Profile</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/company">Browse Talent</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Demo Modal */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Platform Demo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Demo Navigation */}
            <div className="flex justify-center gap-2">
              {DEMO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Current Demo Slide */}
            <div className="text-center space-y-4">
              <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                {/* TODO: Replace with actual demo screenshots */}
                <div className="text-muted-foreground">
                  Demo Screenshot: {DEMO_SLIDES[currentSlide].title}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {DEMO_SLIDES[currentSlide].title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {DEMO_SLIDES[currentSlide].description}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {DEMO_SLIDES[currentSlide].features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevSlide}>
                Previous
              </Button>
              <Button onClick={nextSlide}>
                {currentSlide === DEMO_SLIDES.length - 1 ? 'Start Over' : 'Next'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
import { Users, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyHeader } from "@/components/CompanyHeader";

export default function Company() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <CompanyHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Welcome, Companies!
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find exceptional talent that drives your business forward. Access our curated pool of 
              qualified candidates and streamline your hiring process with powerful tools.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Hiring Today
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Quality Talent Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access pre-screened candidates with verified skills and experience across all industries and skill levels.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Targeted Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our advanced algorithms match candidates to your specific requirements, culture, and company values.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Hiring Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your hiring performance with detailed analytics and optimize your recruitment strategy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Notice */}
          <Card className="bg-accent/50 border-accent-foreground/20">
            <CardHeader>
              <CardTitle className="text-center text-accent-foreground">
                🚀 Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                We're building powerful hiring tools for companies. Stay tuned for the complete solution!
              </p>
              <Button variant="outline">
                Get Early Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
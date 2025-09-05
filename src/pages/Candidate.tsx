import { Link } from "react-router-dom";
import { ArrowLeft, Search, Briefcase, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Candidate() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Welcome, Candidates!
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your next career opportunity awaits. Discover positions that match your skills, 
              connect with innovative companies, and take the next step in your professional journey.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Your Job Search
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Job Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our AI-powered platform matches you with positions that align perfectly with your skills and career goals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Top Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect directly with hiring managers at leading companies across various industries and locations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Career Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access resources, insights, and opportunities that help accelerate your career progression.
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
                We're building something amazing for candidates. Stay tuned for the full experience!
              </p>
              <Button variant="outline">
                Get Notified When We Launch
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
import { Link } from "react-router-dom";
import { Users, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NavigationCards() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Choose Your Path
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Whether you're looking for talent or seeking opportunities, we've got you covered.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidate Card */}
          <Link to="/candidate" className="group block">
            <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-border bg-card hover:bg-accent/50 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold text-card-foreground">
                  I'm a Candidate
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Find your next opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Discover amazing career opportunities, connect with top companies, and take the next step in your professional journey.
                </p>
                <div className="inline-flex items-center text-primary font-medium group-hover:text-primary-foreground group-hover:bg-primary px-4 py-2 rounded-md transition-all">
                  Get Started
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Company Card */}
          <Link to="/company" className="group block">
            <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-border bg-card hover:bg-accent/50 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold text-card-foreground">
                  I'm a Company
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Find the perfect talent
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Access a vast pool of qualified candidates, streamline your hiring process, and build your dream team with ease.
                </p>
                <div className="inline-flex items-center text-primary font-medium group-hover:text-primary-foreground group-hover:bg-primary px-4 py-2 rounded-md transition-all">
                  Get Started
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
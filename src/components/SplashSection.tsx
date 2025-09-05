import { useEffect, useState } from "react";

export function SplashSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-accent-foreground/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className={`
        text-center z-10 px-4 max-w-4xl mx-auto
        transform transition-all duration-1000 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}>
        <h1 className={`
          text-5xl md:text-7xl font-bold mb-6 
          bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent
          transform transition-all duration-1200 ease-out delay-200
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          TalentCanvas
        </h1>
        
        <p className={`
          text-xl md:text-2xl text-muted-foreground font-light
          transform transition-all duration-1000 ease-out delay-500
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          Where Companies Search for Talent
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className={`
        absolute bottom-8 left-1/2 transform -translate-x-1/2
        transition-all duration-1000 ease-out delay-1000
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full animate-bounce mt-2"></div>
        </div>
      </div>
    </section>
  );
}
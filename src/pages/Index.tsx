import { Header } from "@/components/Header";
import { SplashSection } from "@/components/SplashSection";
import { NavigationCards } from "@/components/NavigationCards";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <SplashSection />
        <NavigationCards />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

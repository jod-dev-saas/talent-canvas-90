import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg text-foreground mb-4">TalentCanvas</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting exceptional talent with innovative companies. 
              Your next career move or perfect hire is just a click away.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/candidate" className="text-muted-foreground hover:text-primary transition-colors">
                  For Candidates
                </Link>
              </li>
              <li>
                <Link to="/company" className="text-muted-foreground hover:text-primary transition-colors">
                  For Companies
                </Link>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} TalentCanvas. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-muted-foreground text-sm">
            Made with ❤️ for the future of work
          </div>
        </div>
      </div>
    </footer>
  );
}
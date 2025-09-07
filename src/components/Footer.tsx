import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg text-foreground mb-4">JOD</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Jobs on Demand - Connecting exceptional software talent with innovative companies. 
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
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} JOD. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-muted-foreground text-sm">
            Made with ❤️ for the future of work
          </div>
        </div>
      </div>
    </footer>
  );
}
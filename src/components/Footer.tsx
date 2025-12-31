import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-primary-foreground">
      <div className="container-wide mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-semibold">Casa Serena</h3>
            <p className="text-primary-foreground/70 font-sans text-sm leading-relaxed">
              A tranquil retreat nestled in the heart of the countryside. Experience 
              warm hospitality and timeless elegance.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3 font-sans text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Our Rooms", path: "/rooms" },
                { name: "Gallery", path: "/gallery" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-4 font-sans text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  123 Countryside Lane<br />
                  Tuscany Valley, TV 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:+1234567890" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a href="mailto:hello@casaserena.com" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  hello@casaserena.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Stay Updated</h4>
            <p className="text-primary-foreground/70 font-sans text-sm">
              Subscribe for exclusive offers and updates.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary transition-colors font-sans text-sm"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-lg bg-primary text-primary-foreground font-sans text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 font-sans text-sm">
              © {new Date().getFullYear()} Casa Serena. All rights reserved.
            </p>
            <div className="flex gap-6 font-sans text-sm">
              <a href="#" className="text-primary-foreground/50 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/50 hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

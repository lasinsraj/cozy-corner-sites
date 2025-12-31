import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Rooms", path: "/rooms" },
  { name: "Gallery", path: "/gallery" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className={cn(
              "font-serif text-2xl font-semibold transition-colors duration-300",
              isScrolled ? "text-foreground" : "text-primary-foreground"
            )}>
              Casa Serena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "relative font-sans text-sm font-medium transition-colors duration-300 hover:text-primary",
                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                    location.pathname === link.path
                      ? isScrolled ? "text-primary after:w-full" : "text-primary-foreground after:w-full after:bg-primary-foreground"
                      : isScrolled ? "text-foreground" : "text-primary-foreground/90"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild variant={isScrolled ? "default" : "hero-outline"} size="default">
              <Link to="/contact">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden p-2 transition-colors",
              isScrolled ? "text-foreground" : "text-primary-foreground"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden absolute top-full left-0 right-0 bg-background shadow-card overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <ul className="flex flex-col py-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "block px-6 py-3 font-sans text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-primary bg-secondary"
                      : "text-foreground hover:text-primary hover:bg-secondary"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="px-4 pt-2">
              <Button asChild className="w-full">
                <Link to="/contact">Book Now</Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;

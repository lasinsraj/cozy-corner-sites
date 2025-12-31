import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wifi, Coffee, Car, UtensilsCrossed, Bath, Mountain } from "lucide-react";
import heroImage from "@/assets/hero-guesthouse.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSingle from "@/assets/room-single.jpg";
import roomSuite from "@/assets/room-suite.jpg";

const features = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Coffee, label: "Breakfast Included" },
  { icon: Car, label: "Free Parking" },
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: Bath, label: "Spa Services" },
  { icon: Mountain, label: "Scenic Views" },
];

const featuredRooms = [
  {
    name: "Comfort Room",
    description: "Perfect for solo travelers seeking comfort and tranquility.",
    price: 89,
    image: roomSingle,
    features: ["Queen Bed", "Garden View", "En-suite Bathroom"],
  },
  {
    name: "Deluxe Room",
    description: "Spacious retreat with premium amenities for couples.",
    price: 149,
    image: roomDeluxe,
    features: ["King Bed", "Balcony", "Premium Linens"],
  },
  {
    name: "Grand Suite",
    description: "Luxurious suite with separate living area for families.",
    price: 249,
    image: roomSuite,
    features: ["Living Room", "Panoramic View", "Mini Kitchen"],
  },
];

const HomePage = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Casa Serena Guesthouse exterior with beautiful garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-up">
          <span className="inline-block font-sans text-sm tracking-[0.3em] uppercase text-primary-foreground/80 mb-4">
            Welcome to
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold text-primary-foreground mb-6 leading-tight">
            Casa Serena
          </h1>
          <p className="font-sans text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            A tranquil retreat where timeless elegance meets warm hospitality. 
            Discover your perfect escape in the heart of the countryside.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/rooms">View Our Rooms</Link>
            </Button>
            <Button asChild variant="hero-outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
              A Haven of Comfort & Elegance
            </h2>
            <p className="font-sans text-muted-foreground text-lg leading-relaxed mb-8">
              Nestled among rolling hills and olive groves, Casa Serena offers an 
              authentic retreat from the everyday. Our family-run guesthouse combines 
              traditional charm with modern comforts, creating an atmosphere where 
              every guest feels at home.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Discover Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-background shadow-soft hover:shadow-card transition-shadow duration-300"
              >
                <feature.icon className="w-8 h-8 text-primary" />
                <span className="font-sans text-sm font-medium text-foreground text-center">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <div className="text-center mb-12">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              Accommodations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              Our Rooms
            </h2>
            <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
              Each room is thoughtfully designed to provide comfort and serenity, 
              with views of our beautiful gardens and the surrounding landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <article
                key={room.name}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-sans text-sm font-semibold">
                    From ${room.price}/night
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-card-foreground mb-2">
                    {room.name}
                  </h3>
                  <p className="font-sans text-muted-foreground text-sm mb-4 leading-relaxed">
                    {room.description}
                  </p>
                  <ul className="flex flex-wrap gap-2 mb-6">
                    {room.features.map((feature) => (
                      <li
                        key={feature}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full font-sans text-xs"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/rooms">View Details</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/rooms">View All Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Casa Serena garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/80" />
        </div>
        <div className="relative z-10 container-wide mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary-foreground mb-6">
            Ready for Your Perfect Getaway?
          </h2>
          <p className="font-sans text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Book your stay today and experience the warmth and tranquility of Casa Serena.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/contact">Book Your Stay</Link>
            </Button>
            <Button asChild variant="hero-outline" size="lg">
              <a href="tel:+1234567890">Call Us Now</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Leaf, Star, Users } from "lucide-react";
import heroImage from "@/assets/hero-guesthouse.jpg";
import galleryLounge from "@/assets/gallery-lounge.jpg";

const values = [
  {
    icon: Heart,
    title: "Warm Hospitality",
    description: "Every guest is treated like family. Our dedicated team ensures your comfort from arrival to departure.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "We're committed to eco-friendly practices, from locally-sourced ingredients to energy-efficient systems.",
  },
  {
    icon: Star,
    title: "Excellence",
    description: "We take pride in every detail, from the quality of our linens to the freshness of our breakfast.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We support local artisans, farmers, and businesses, sharing the best of our region with our guests.",
  },
];

const AboutPage = () => {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-secondary">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              Our Story
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              About Casa Serena
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              More than just a place to stay, Casa Serena is a sanctuary where 
              travelers find peace, comfort, and the warmth of genuine hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={heroImage}
                alt="Casa Serena guesthouse exterior"
                className="rounded-2xl shadow-card w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-elevated hidden sm:block">
                <span className="font-serif text-4xl font-bold block">25+</span>
                <span className="font-sans text-sm">Years of Excellence</span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                A Family Legacy of Hospitality
              </h2>
              <div className="space-y-4 font-sans text-muted-foreground leading-relaxed">
                <p>
                  Casa Serena began as a dream in 1998 when the Moretti family 
                  transformed their ancestral home into a welcoming retreat for 
                  travelers seeking an authentic countryside experience.
                </p>
                <p>
                  What started as a modest guesthouse with just three rooms has 
                  blossomed into a beloved destination, while maintaining the 
                  intimate, family atmosphere that makes every visit special.
                </p>
                <p>
                  Today, three generations of Morettis continue to welcome guests, 
                  sharing their love for the region's culture, cuisine, and natural 
                  beauty. Every detail, from the locally-sourced breakfast to the 
                  handpicked furnishings, reflects our commitment to creating 
                  memorable experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={galleryLounge}
            alt="Casa Serena lounge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/85" />
        </div>
        <div className="relative z-10 container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              Our Mission
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary-foreground mb-6">
              Creating Moments of Serenity
            </h2>
            <p className="font-sans text-lg text-primary-foreground/80 leading-relaxed mb-8">
              Our mission is simple: to provide a haven where guests can disconnect 
              from the demands of daily life and reconnect with themselves, nature, 
              and the people they love. We believe that true luxury lies in simplicity, 
              authenticity, and heartfelt care.
            </p>
            <blockquote className="font-serif text-2xl italic text-primary-foreground/90">
              "A place where time slows down and every moment feels like a gift."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <div className="text-center mb-12">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
              Our Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 rounded-xl hover:bg-secondary transition-colors duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary block">
                Why Choose Us
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                The Casa Serena Difference
              </h2>
              <div className="space-y-4">
                {[
                  "Family-owned and operated for over 25 years",
                  "Prime location with stunning countryside views",
                  "Farm-to-table breakfast with local ingredients",
                  "Personalized service tailored to your needs",
                  "Eco-friendly practices and sustainable tourism",
                  "Authentic cultural experiences and local insights",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="font-sans text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="mt-4">
                <Link to="/contact">Book Your Stay</Link>
              </Button>
            </div>

            <div className="order-1 lg:order-2">
              <img
                src={galleryLounge}
                alt="Casa Serena lounge"
                className="rounded-2xl shadow-card w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

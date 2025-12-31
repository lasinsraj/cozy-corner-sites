import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Wifi, Coffee, Tv, Bath, Wind, Mountain, Users, Bed } from "lucide-react";
import roomSingle from "@/assets/room-single.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";

const rooms = [
  {
    id: 1,
    name: "Comfort Room",
    description: "Our cozy Comfort Room is perfect for solo travelers or couples seeking a peaceful retreat. Featuring warm décor, quality linens, and views of our landscaped gardens.",
    longDescription: "Wake up to gentle morning light filtering through sheer curtains, enjoy your morning coffee on the window seat, and fall asleep to the peaceful sounds of nature.",
    price: 89,
    image: roomSingle,
    size: "25 m²",
    guests: 2,
    bed: "Queen Bed",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "En-suite Bathroom", "Garden View", "Daily Housekeeping"],
    featured: false,
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "Spacious and elegantly appointed, our Deluxe Room offers premium comfort with a private balcony overlooking the countryside.",
    longDescription: "Indulge in extra space and luxury with our most popular room type. The private balcony is perfect for enjoying your breakfast or evening wine while taking in the stunning views.",
    price: 149,
    image: roomDeluxe,
    size: "35 m²",
    guests: 2,
    bed: "King Bed",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "En-suite Bathroom", "Private Balcony", "Mini Bar", "Premium Linens", "Bathrobes & Slippers"],
    featured: true,
  },
  {
    id: 3,
    name: "Grand Suite",
    description: "Our luxurious Grand Suite features a separate living area, panoramic views, and exclusive amenities for an unforgettable stay.",
    longDescription: "Experience the ultimate in comfort and space with our Grand Suite. Perfect for families or those seeking extra indulgence, featuring a fully equipped kitchenette and expansive living area.",
    price: 249,
    image: roomSuite,
    size: "55 m²",
    guests: 4,
    bed: "King Bed + Sofa Bed",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "En-suite Bathroom", "Panoramic Views", "Separate Living Area", "Mini Kitchen", "Premium Linens", "Bathrobes & Slippers", "Complimentary Breakfast"],
    featured: true,
  },
];

const services = [
  {
    name: "Gourmet Breakfast",
    description: "Start your day with our complimentary breakfast featuring local and seasonal ingredients.",
    price: "Included with select rooms",
    icon: Coffee,
  },
  {
    name: "High-Speed Wi-Fi",
    description: "Stay connected with complimentary high-speed wireless internet throughout the property.",
    price: "Complimentary",
    icon: Wifi,
  },
  {
    name: "Free Parking",
    description: "Secure on-site parking available for all guests at no additional charge.",
    price: "Complimentary",
    icon: Mountain,
  },
  {
    name: "Room Service",
    description: "Enjoy meals and refreshments delivered directly to your room.",
    price: "Available 7AM - 10PM",
    icon: Bath,
  },
];

const RoomsPage = () => {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-secondary">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              Accommodations
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              Our Rooms & Suites
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Each of our rooms has been thoughtfully designed to provide the perfect 
              blend of comfort and elegance. Choose your ideal retreat and let us 
              take care of the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <div className="space-y-16">
            {rooms.map((room, index) => (
              <article
                key={room.id}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-card">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    {room.featured && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-sans text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""} space-y-6`}>
                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
                      {room.name}
                    </h2>
                    <p className="font-sans text-muted-foreground leading-relaxed">
                      {room.description}
                    </p>
                    <p className="font-sans text-muted-foreground leading-relaxed mt-3">
                      {room.longDescription}
                    </p>
                  </div>

                  {/* Room Details */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Bed className="w-5 h-5 text-primary" />
                      <span className="font-sans text-sm">{room.bed}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-sans text-sm">Up to {room.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Wind className="w-5 h-5 text-primary" />
                      <span className="font-sans text-sm">{room.size}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="grid grid-cols-2 gap-2">
                    {room.amenities.slice(0, 6).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span className="font-sans text-sm text-muted-foreground">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                    <div>
                      <span className="font-serif text-3xl text-primary font-semibold">
                        ${room.price}
                      </span>
                      <span className="font-sans text-muted-foreground">/night</span>
                    </div>
                    <Button asChild size="lg" className="sm:ml-auto">
                      <Link to="/contact">Book This Room</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-secondary">
        <div className="container-wide mx-auto">
          <div className="text-center mb-12">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              Guest Services
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
              Included Amenities
            </h2>
            <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
              Every stay includes access to our curated selection of services 
              designed to make your experience exceptional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-background rounded-xl p-6 shadow-soft hover:shadow-card transition-shadow duration-300"
              >
                <service.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {service.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground mb-3 leading-relaxed">
                  {service.description}
                </p>
                <span className="font-sans text-xs text-primary font-medium">
                  {service.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
            Questions About Our Rooms?
          </h2>
          <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Our team is here to help you find the perfect accommodation for your stay.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default RoomsPage;

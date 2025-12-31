import { useState } from "react";
import { X } from "lucide-react";
import roomSingle from "@/assets/room-single.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import galleryGarden from "@/assets/gallery-garden.jpg";
import galleryBreakfast from "@/assets/gallery-breakfast.jpg";
import galleryLounge from "@/assets/gallery-lounge.jpg";
import galleryView from "@/assets/gallery-view.jpg";
import heroImage from "@/assets/hero-guesthouse.jpg";

const categories = ["All", "Rooms", "Facilities", "Surroundings"];

const images = [
  { src: heroImage, alt: "Casa Serena exterior view", category: "Surroundings" },
  { src: roomDeluxe, alt: "Deluxe room interior", category: "Rooms" },
  { src: galleryGarden, alt: "Garden and terrace area", category: "Facilities" },
  { src: roomSingle, alt: "Comfort room interior", category: "Rooms" },
  { src: galleryBreakfast, alt: "Breakfast service", category: "Facilities" },
  { src: galleryView, alt: "Countryside view from balcony", category: "Surroundings" },
  { src: galleryLounge, alt: "Guest lounge area", category: "Facilities" },
  { src: roomSuite, alt: "Grand suite interior", category: "Rooms" },
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-secondary">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4 block">
              Visual Journey
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              Gallery
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Take a visual tour of Casa Serena. Explore our beautifully appointed rooms, 
              tranquil gardens, and the stunning countryside that surrounds us.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="font-sans text-sm text-primary-foreground">
                    {image.alt}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-primary-foreground hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>
          <div
            className="max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-contain rounded-lg"
            />
            <p className="text-center text-primary-foreground font-sans mt-4">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;

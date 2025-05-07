
import { useEffect, useState } from "react";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Aula de fotografia de paisagem",
    title: "Fotografia de Paisagem",
  },
  {
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Workshop de fotografia florestal",
    title: "Fotografia de Natureza",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Alunos em campo",
    title: "Aula de Campo",
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Expedição fotográfica",
    title: "Expedições",
  },
  {
    url: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Aula de fotografia alpina",
    title: "Workshops Avançados",
  },
  {
    url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Alunos em prática",
    title: "Prática em Grupo",
  },
];

const GallerySection = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload images in background
    const imagePromises = galleryImages.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.url;
        img.onload = resolve;
      });
    });

    // Mark all images as loaded when complete
    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Nossa escola em ação</h2>
          <p className="text-lg text-gray-600 mt-6">
            Confira momentos marcantes das nossas aulas, workshops e expedições fotográficas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="photo-card group h-72 md:h-80">
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                width="800"
                height="600"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imagesLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="photo-card-overlay">
                <h3 className="text-white text-xl font-bold">{image.title}</h3>
                <p className="text-gray-200 text-sm">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;


import { useEffect, useState } from "react";

const images = [
  "/lovable-uploads/a84c73d6-1fa4-46f1-ad58-d9cbe93ca920.png",
  "/lovable-uploads/f3d335ec-b381-4f93-bb65-4e1fade8dea8.png",
  "/lovable-uploads/954b0df9-8e93-468e-a5b9-8f25fc44eeba.png"
];

interface HeroBackgroundSliderProps {
  offset: number;
}

const HeroBackgroundSlider = ({ offset }: HeroBackgroundSliderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Background images with parallax effect */}
      {images.map((image, index) => (
        <div
          key={image}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${image})`,
            transform: `translateY(${offset * 0.5}px)`,
            opacity: index === currentImageIndex ? 0.6 : 0,
          }}
        />
      ))}
      
      {/* Add animated particles effect */}
      <div className="absolute inset-0 z-5 opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 3 + 1}px rgba(255,255,255,0.8)`,
              animation: `float ${Math.random() * 8 + 12}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translateY(${offset * (Math.random() * 0.2 + 0.3)}px)`,
            }}
          />
        ))}
      </div>
      
      {/* Add floating geometric shapes */}
      <div className="absolute inset-0 z-5 opacity-30">
        {[...Array(10)].map((_, i) => {
          const size = Math.random() * 80 + 40;
          const type = Math.floor(Math.random() * 3); // 0: circle, 1: triangle, 2: square
          const color = i % 3 === 0 ? 'rgba(155,135,245,0.3)' : i % 3 === 1 ? 'rgba(30,174,219,0.3)' : 'rgba(217,70,239,0.3)';
          
          return (
            <div
              key={i + "shape"}
              className={`absolute ${type === 0 ? 'rounded-full' : type === 1 ? 'triangle' : ''}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                border: `2px solid ${color}`,
                backgroundColor: 'transparent',
                transform: `rotate(${Math.random() * 360}deg) translateY(${offset * (Math.random() * 0.15 + 0.15)}px)`,
                animation: `float ${Math.random() * 10 + 20}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default HeroBackgroundSlider;

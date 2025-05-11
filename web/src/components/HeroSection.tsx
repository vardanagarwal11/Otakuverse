
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayCircle, Palette, Users } from "lucide-react";
import HeroBackgroundSlider from "./HeroBackgroundSlider";

const HeroSection = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center bg-otaku-dark overflow-hidden">
      {/* Background image with parallax */}
      <HeroBackgroundSlider offset={offset} />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-otaku-dark via-otaku-dark/70 to-transparent z-10"></div>
      
      {/* Neon grid effect */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(155,135,245,0.1) 1px, transparent 1px), 
                           linear-gradient(0deg, rgba(155,135,245,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: `0 ${offset * 0.2}px`,
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-28 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-cyber font-bold mb-6">
            <span className="neon-text">Watch.</span>{" "}
            <span className="neon-text-blue">Collect.</span>{" "}
            <span className="neon-text-pink">Connect.</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-cyber text-white mb-8">
            The Ultimate Anime Community Platform
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join dedicated anime communities, collect exclusive NFTs, and earn rewards while watching your favorite series on the first decentralized anime platform.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <Link to="/auth?register=true">
              <Button size="lg" className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber min-w-[180px] animate-neon-pulse">
                Connect Wallet
              </Button>
            </Link>
            <Link to="/anime">
              <Button size="lg" variant="outline" className="border-otaku-blue text-otaku-blue hover:bg-otaku-blue/20 font-cyber min-w-[180px]">
                <PlayCircle className="mr-2 h-5 w-5" /> Watch Anime
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="border-otaku-pink text-otaku-pink hover:bg-otaku-pink/20 font-cyber min-w-[180px]">
                <Palette className="mr-2 h-5 w-5" /> Browse NFTs
              </Button>
            </Link>
            <Link to="/communities">
              <Button size="lg" variant="outline" className="border-otaku-purple text-otaku-purple hover:bg-otaku-purple/20 font-cyber min-w-[180px]">
                <Users className="mr-2 h-5 w-5" /> Join Communities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

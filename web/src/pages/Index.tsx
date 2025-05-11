
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AnimeCard from "@/components/AnimeCard";
import CreatorCard from "@/components/CreatorCard";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/FeaturesSection";
import NFTShowcase from "@/components/NFTShowcase";
import CommunitiesShowcase from "@/components/CommunitiesShowcase";
import WaitlistSection from "@/components/WaitlistSection";

const Index = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trendingAnime = [
    {
      id: 1,
      title: "Demon Slayer",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
      rating: 4.8,
      genre: "Action",
      progress: 80,
    },
    {
      id: 2,
      title: "Attack on Titan",
      image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500",
      rating: 4.9,
      genre: "Drama",
      progress: 65,
    },
    {
      id: 3,
      title: "My Hero Academia",
      image: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=500",
      rating: 4.7,
      genre: "Adventure",
      progress: 45,
    },
    {
      id: 4,
      title: "Jujutsu Kaisen",
      image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=500",
      rating: 4.9,
      genre: "Action",
      progress: 100,
    }
  ];

  const topCreators = [
    {
      id: 1,
      name: "AnimeArtist",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=120",
      followers: "120K",
      content: "Original Animation",
      earnings: "45,569 OTK"
    },
    {
      id: 2,
      name: "MangaMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120",
      followers: "95K",
      content: "Manga & Comics",
      earnings: "32,450 OTK"
    },
    {
      id: 3,
      name: "VoiceArtisan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120",
      followers: "86K",
      content: "Voice Acting",
      earnings: "28,120 OTK"
    }
  ];

  return (
    <div className="bg-otaku-dark min-h-screen text-white overflow-x-hidden">
      <Navbar />
      
      <HeroSection />
      
      {/* Scroll indicator */}
      <div className="flex justify-center -mt-20 mb-8 animate-bounce">
        <ChevronDown className="w-10 h-10 text-white/70" />
      </div>
      
      {/* Core Features Section */}
      <FeaturesSection />
      
      {/* Waitlist Section (Replacing the Crowdfunding Section) */}
      <section className="container mx-auto px-4 py-16" style={{ transform: `translateY(-${scrollPosition * 0.05}px)` }}>
        <WaitlistSection />
      </section>
      
      {/* Communities Showcase */}
      <CommunitiesShowcase />
      
      {/* NFT Marketplace Showcase */}
      <NFTShowcase />
      
      {/* Top Earning Creators */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-transparent to-black/30">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-cyber font-bold neon-text-blue">Top Earning Creators</h2>
          <Link to="/creators" className="btn-outline-neon text-sm">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topCreators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
      
      {/* Popular Shows */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-cyber font-bold neon-text-pink">Popular Shows</h2>
          <Link to="/anime" className="btn-outline-neon text-sm">View Library</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingAnime.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

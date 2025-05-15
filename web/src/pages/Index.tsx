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
import CommunityFlipCard from "@/components/CommunityFlipCard";

import ComingSoonModal from '@/components/ComingSoonModal';

const Index = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trendingAnime = [
    {
      id: 0,
      title: "One Punch Man Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BNzMwOGQ5MWItNzE3My00ZDYyLTk4NzAtZWIyYWI0NTZhYzY0XkEyXkFqcGc@._V1_.jpg",
      rating: 4.7,
      genre: "Action",
    },
    {
      id: 2,
      title: "Tokyo Revengers Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BNGYzMjBhMTMtM2Q4YS00OGMyLTk2ZWItYTg3MDk2YWIxNmVkXkEyXkFqcGc@._V1_.jpg",
      rating: 4.0,
      genre: "Action",
    },
    {
      id: 3,
      title: "Mushoku Tensei: Jobless Reincarnation Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BYWQwNjk3MDItNDAxMS00YTQ2LWEyNDctMGYyZTE5OGQxNGQ1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 3.9,
      genre: "Adventure",
    },
    {
      id: 4,
      title: "Classroom of the Elite Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BMDg3MGVhNWUtYTQ2NS00ZDdiLTg5MTMtZmM5MjUzN2IxN2I4XkEyXkFqcGc@._V1_.jpg",
      rating: 4.8,
      genre: "Drama",
    }
  ];

  const topCreators = [
    {
      id: 1,
      name: "AnimeArtist",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=120",
      followers: "120K",
      content: "Original Animation",
      earnings: "45,569 SOL"
    },
    {
      id: 2,
      name: "MangaMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120",
      followers: "95K",
      content: "Manga & Comics",
      earnings: "32,450 SOL"
    },
    {
      id: 3,
      name: "VoiceArtisan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120",
      followers: "86K",
      content: "Voice Acting",
      earnings: "28,120 SOL"
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
      
      {/* Communities Showcase - replaced with communities from Communities.tsx */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-cyber font-bold neon-text">Community Hubs</h2>
          <Link to="/communities" 
            style={{
              border: '1.5px solid #a78bfa',
              background: '#181c27',
              borderRadius: '2rem',
              fontFamily: 'var(--font-cyber, Orbitron, monospace)',
              color: '#a78bfa',
              padding: '0.55rem 1.8rem',
              fontSize: '1.2rem',
              textShadow: '0 0 8px #a78bfa',
              transition: 'all 0.2s',
              cursor: 'pointer',
              outline: 'none',
            }}
          >View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              name: "Demon Slayer",
              image: "https://www.sheknows.com/wp-content/uploads/2024/03/how-to-watch-demon-slayer-season-4-FI.jpg",
              icon: "🔥",
              members: 12450,
              posts: 3240,
              theme: "green",
              description: "Join the Demon Slayer Corps! Discuss episodes, share fan theories, and connect with other fans of Tanjiro's journey.",
              categories: ["Action", "Fantasy", "Supernatural"],
            },
            {
              id: 2,
              name: "Attack on Titan",
              image: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/12/eren-vs-colossal-titan-in-trost.jpg",
              icon: "⚔️",
              members: 18320,
              posts: 5120,
              theme: "blue",
              description: "Dedicate your hearts! The ultimate community for discussing all things Attack on Titan, from the anime to the manga's conclusion.",
              categories: ["Dark Fantasy", "Action", "Post-Apocalyptic"],
            },
            {
              id: 3,
              name: "My Hero Academia",
              image: "https://d.newsweek.com/en/full/2613601/my-hero-academia-season-8.webp?w=1600&h=900&q=88&f=624ff73786216c987d4c6348140b7e16",
              icon: "👊",
              members: 10280,
              posts: 2870,
              theme: "yellow",
              description: "Go beyond, plus ultra! Join fellow heroes to discuss quirks, character development, and the latest episodes.",
              categories: ["Superheroes", "Action", "School"],
            }
          ].map(community => (
            <CommunityFlipCard key={community.id} community={community} />
          ))}
        </div>
      </section>
      
      {/* NFT Marketplace Showcase */}
      <NFTShowcase />
      
      {/* Top Earning Creators */}
      <ComingSoonModal open={showComingSoon} onClose={() => setShowComingSoon(false)} />
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-transparent to-black/30">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-cyber font-bold neon-text-blue">Top Earning Creators</h2>
          <button
            type="button"
            onClick={() => setShowComingSoon(true)}
            style={{
              border: '1.5px solid #a78bfa',
              background: '#181c27',
              borderRadius: '2rem',
              fontFamily: 'var(--font-cyber, Orbitron, monospace)',
              color: '#a78bfa',
              padding: '0.55rem 1.8rem',
              fontSize: '1.2rem',
              textShadow: '0 0 8px #a78bfa',
              transition: 'all 0.2s',
              cursor: 'pointer',
              outline: 'none',
            }}
          >View All</button>
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
          <Link to="/anime" 
            style={{
              border: '1.5px solid #a78bfa',
              background: '#181c27',
              borderRadius: '2rem',
              fontFamily: 'var(--font-cyber, Orbitron, monospace)',
              color: '#a78bfa',
              padding: '0.55rem 1.8rem',
              fontSize: '1.2rem',
              textShadow: '0 0 8px #a78bfa',
              transition: 'all 0.2s',
              cursor: 'pointer',
              outline: 'none',
            }}
          >View Library</Link>
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

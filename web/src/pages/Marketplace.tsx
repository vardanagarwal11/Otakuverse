import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useWallet from "@/hooks/useWallet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Featured NFTs that will be in the rotating carousel
const featuredNfts = [
  {
    id: 1,
    name: "Saitama Genesis",
    anime: "One Punch Man",
    image: "https://preview.redd.it/9esa8cif2ja81.png?width=1080&crop=smart&auto=webp&s=8ec49edea780fcd7b1c12bc6dd26886e7d7b17c4",
    price: "2.5 SOL",
    type: "purchasable",
    rarity: "RARE"
  },
  {
    id: 2,
    name: "All Might Portrait",
    anime: "My Hero Academia",
    image: "https://i.pinimg.com/236x/e9/b2/45/e9b2453a07b5948aa5d97283d240b42b.jpg",
    price: "1.52 SOL",
    type: "purchasable",
    rarity: "EPIC"
  },
  {
    id: 3,
    name: "Scout Regiment Badge",
    anime: "Attack on Titan",
    image: "https://media.sketchfab.com/models/8812126a43144d85abaae7d88e4d868c/thumbnails/73f4c01a9cfa489f94203b14dfe4520f/cee19a4936a245b29209ed09569afaab.jpeg",
    price: "Community Reward",
    type: "earned",
    rarity: "LEGENDARY"
  },
  {
    id: 7,
    name: "Tanjiro's Sword",
    anime: "Demon Slayer",
    image: "https://www.coolkatana.com/cdn/shop/articles/power_of_coolKatana_s_tanjiro_nichirin_sword_9103e7bb-20f1-4f7d-bec5-d43f9e727840.jpg?v=1740042664",
    price: "1.8 SOL",
    type: "purchasable",
    rarity: "EPIC"
  }
];

// All NFT cards for the marketplace grid
const nftCards = [
  {
    id: 1,
    name: "Saitama Genesis",
    anime: "One Punch Man",
    image: "https://preview.redd.it/9esa8cif2ja81.png?width=1080&crop=smart&auto=webp&s=8ec49edea780fcd7b1c12bc6dd26886e7d7b17c4",
    price: "2.5 SOL",
    type: "purchasable",
    rarity: "RARE"
  },
  {
    id: 2,
    name: "All Might Portrait",
    anime: "My Hero Academia",
    image: "https://i.pinimg.com/236x/e9/b2/45/e9b2453a07b5948aa5d97283d240b42b.jpg",
    price: "1.52 SOL",
    type: "purchasable",
    rarity: "EPIC"
  },
  {
    id: 3,
    name: "Scout Regiment Badge",
    anime: "Attack on Titan",
    image: "https://media.sketchfab.com/models/8812126a43144d85abaae7d88e4d868c/thumbnails/73f4c01a9cfa489f94203b14dfe4520f/cee19a4936a245b29209ed09569afaab.jpeg",
    price: "Community Reward",
    type: "earned",
    rarity: "LEGENDARY"
  },
  {
    id: 4,
    name: "Genos Cyborg Core",
    anime: "One Punch Man",
    image: "https://i.redd.it/vyilsxvkyhn91.jpg",
    price: "Community Reward",
    type: "earned",
    rarity: "LEGENDARY"
  },
  {
    id: 5,
    name: "Speed-o'-Sound Sonic Shadow",
    anime: "One Punch Man",
    image: "https://w0.peakpx.com/wallpaper/269/864/HD-wallpaper-speed-o-sound-sonic-aesthetic-anime-art-blue-edit-electric-glow-lightning-one-punch-man.jpg",
    price: "Community Reward",
    type: "earned",
    rarity: "EPIC"
  },
  {
    id: 6,
    name: "Mumen Rider Justice",
    anime: "One Punch Man",
    image: "https://wallpapers.com/images/hd/mumen-rider-1280-x-854-wallpaper-iba0xjxkf7ebqjfc.jpg",
    price: "0.8 SOL",
    type: "purchasable",
    rarity: "COMMON"
  },
  {
    id: 7,
    name: "Tanjiro's Sword",
    anime: "Demon Slayer",
    image: "https://www.coolkatana.com/cdn/shop/articles/power_of_coolKatana_s_tanjiro_nichirin_sword_9103e7bb-20f1-4f7d-bec5-d43f9e727840.jpg?v=1740042664",
    price: "1.8 SOL",
    type: "purchasable",
    rarity: "EPIC"
  }
];

// NFT Card component that displays differently based on if it's purchasable or earned
const NFTCard = ({ card }: { card: any }) => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const [showWalletNotif, setShowWalletNotif] = useState(false);

  const handlePurchase = () => {
    if (!connected) {
      setShowWalletNotif(true);
      setTimeout(() => setShowWalletNotif(false), 2000);
      return;
    }
    navigate("/payment", { state: { nft: card } });
  };
  const backgroundColor = card.type === 'purchasable' 
    ? 'from-red-900/90 to-red-950/95' // Red background for purchasable
    : 'from-purple-900/90 to-blue-900/95'; // Purple/blue for earned

  const rarityColor = {
    'COMMON': 'bg-gray-500',
    'RARE': 'bg-blue-500',
    'EPIC': 'bg-green-500',
    'LEGENDARY': 'bg-yellow-500'
  }[card.rarity] || 'bg-gray-500';

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br ${backgroundColor} hover:scale-105 transition-all duration-300 flex flex-col h-full`}>
      {/* Status & Rarity Tags */}
      <div className="absolute top-2 left-2 z-10 flex space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${card.type === 'purchasable' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
          {card.type === 'purchasable' ? 'PURCHASABLE' : 'EARNED'}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${rarityColor} text-white`}>
          {card.rarity}
        </span>
      </div>

      {/* NFT Image */}
      <div className="h-52 overflow-hidden">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* NFT Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-1 text-white">{card.name}</h2>
          <p className="text-sm text-cyan-400 mb-3">{card.anime}</p>
        </div>

        {/* Price or Community Reward */}
        <div className="mt-auto">
          {card.type === 'purchasable' ? (
            <div className="flex justify-between items-center">
              <span className="text-cyan-300 font-cyber">{card.price}</span>
              <>
                <Button
                  variant="default"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-cyber text-xs px-4 py-1"
                  onClick={handlePurchase}
                >
                  Purchase
                </Button>
                {showWalletNotif && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg text-xs font-semibold z-50 animate-fade-in">
                    Wallet not connected. Please connect your wallet to purchase.
                  </div>
                )}
              </>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-purple-300 font-cyber">Community Reward</span>
              <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white font-cyber text-xs px-4 py-1">
                View Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Card-style animated carousel for featured NFTs
const NFTCarousel = ({ nfts }: { nfts: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === nfts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3500);
    return () => resetTimeout();
  }, [currentIndex, nfts.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-16">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-cyber text-cyan-400">Featured NFTs</h2>
      </div>
      <div className="flex justify-center items-center relative h-[480px] overflow-visible"> {/* Increased height, allow overflow */}
        {nfts.map((nft, idx) => {
          // Animate: current card is centered, others are scaled/shifted
          const isActive = idx === currentIndex;
          const isPrev = idx === (currentIndex === 0 ? nfts.length - 1 : currentIndex - 1);
          const isNext = idx === (currentIndex === nfts.length - 1 ? 0 : currentIndex + 1);
          return (
            <div
              key={nft.id}
              className={`absolute transition-all duration-700 ease-in-out
                ${isActive ? 'z-20 scale-125 shadow-2xl opacity-100' : 'z-10 scale-90 opacity-60'}
                ${isPrev ? '-translate-x-56 blur-[2px]' : ''}
                ${isNext ? 'translate-x-56 blur-[2px]' : ''}
                ${!isActive && !isPrev && !isNext ? 'opacity-0 pointer-events-none' : ''}
              `}
              style={{ left: '50%', transform: `translateX(-50%) ${isPrev ? 'translateX(-14rem)' : ''} ${isNext ? 'translateX(14rem)' : ''} ${isActive ? '' : ''}` }}
            >
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${nft.type === 'purchasable' ? 'from-red-900/90 to-red-950/95' : 'from-purple-900/90 to-blue-900/95'} flex flex-col items-center w-[370px] h-[470px] animate-pulse-fast p-4`} style={{boxSizing:'border-box'}}> {/* More padding, more height, no cut-off */}
                <div className="absolute top-3 left-3 z-10 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${nft.type === 'purchasable' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
                    {nft.type === 'purchasable' ? 'PURCHASABLE' : 'EARNED'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${nft.rarity === 'LEGENDARY' ? 'bg-yellow-500' : nft.rarity === 'EPIC' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                    {nft.rarity}
                  </span>
                </div>
                <div className="h-72 w-full flex items-center justify-center bg-black rounded-xl"> {/* Even more image height */}
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="object-contain max-h-full max-w-full drop-shadow-xl transition-transform duration-500"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between w-full"> {/* Increased padding */}
                  <h3 className="text-2xl font-bold mb-2 text-white text-center">{nft.name}</h3>
                  <p className="text-lg text-cyan-400 mb-3 text-center">{nft.anime}</p>
                  {nft.type === 'purchasable' ? (
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <span className="text-cyan-300 font-cyber text-xl">{nft.price}</span>
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-cyber text-xs px-8 py-2 mt-2 w-36">Purchase</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <span className="text-purple-300 font-cyber text-xl">Community Reward</span>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white font-cyber text-xs px-8 py-2 mt-2 w-36">View Details</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {nfts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-cyan-400' : 'bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [displayedCards, setDisplayedCards] = useState(6); // Initially display 6 cards

  const loadMore = () => {
    setDisplayedCards(Math.min(displayedCards + 3, nftCards.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-otaku-dark via-otaku-blue/10 to-otaku-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Marketplace Title with View All button */}
        <div className="flex items-center mb-10">
          <h1 className="text-4xl font-cyber font-bold text-cyan-400">NFT Marketplace</h1>
        </div>
        
        {/* Featured NFT Carousel */}
        <NFTCarousel nfts={featuredNfts} />
        
        {/* NFT Grid Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-cyber text-cyan-400 mb-6">All NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
            {nftCards.slice(0, displayedCards).map(card => (
              <NFTCard key={card.id} card={card} />
            ))}
          </div>

          {/* Load More Button at the bottom - always visible, does nothing for now */}
          <div className="flex justify-center mt-10">
            <button
              className="btn-outline-neon px-8 py-3 inline-flex items-center"
              style={{ borderRadius: '2rem', fontFamily: 'var(--font-cyber, Orbitron, monospace)', fontSize: '1.2rem' }}
              onClick={() => {
                if (window && window['toast']) {
                  window['toast']('More cards coming soon', {
                    duration: 3500,
                    style: {
                      background: 'linear-gradient(90deg, #3a2257 0%, #8a4fff 100%)',
                      color: '#fff',
                    },
                    className: 'neon-text',
                    icon: false,
                  });
                }
              }}
            >
              Load More <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;

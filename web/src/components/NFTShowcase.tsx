
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface NFT {
  id: number;
  name: string;
  image: string;
  type: "earned" | "paid";
  rarity: "common" | "uncommon" | "rare" | "legendary";
  anime: string;
  price?: number;
}

const NFTS: NFT[] = [
  {
    id: 1,
    name: "Demon Slayer: Tanjiro's Sword",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
    type: "paid",
    rarity: "rare",
    anime: "Demon Slayer",
    price: 230
  },
  {
    id: 2,
    name: "Attack on Titan: Scout Regiment Badge",
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500",
    type: "earned",
    rarity: "legendary",
    anime: "Attack on Titan"
  },
  {
    id: 3,
    name: "My Hero Academia: All Might Portrait",
    image: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=500",
    type: "paid",
    rarity: "uncommon",
    anime: "My Hero Academia",
    price: 150
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "bg-gray-500";
    case "uncommon": return "bg-green-500";
    case "rare": return "bg-blue-500";
    case "legendary": return "bg-amber-500";
    default: return "bg-gray-500";
  }
};

const NFTShowcase = () => {
  const [activeNFT, setActiveNFT] = useState<number>(0);

  useEffect(() => {
    // Auto-cycle through NFTs
    const interval = setInterval(() => {
      setActiveNFT((prev) => (prev + 1) % NFTS.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-16 overflow-hidden relative">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-cyber font-bold neon-text-blue">NFT Marketplace</h2>
        <Link to="/marketplace" className="flex items-center text-otaku-blue hover:text-otaku-blue-sky transition-colors">
          <span className="mr-2">View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="relative h-[560px]">
        {/* Background grid effect */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(30, 174, 219, 0.05) 1px, transparent 1px), 
                             linear-gradient(0deg, rgba(30, 174, 219, 0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        ></div>
        
        {/* NFT Cards */}
        <div className="relative z-10 flex justify-center">
          {NFTS.map((nft, index) => (
            <div 
              key={nft.id}
              className={`nft-card absolute w-64 md:w-80 transition-all duration-500 ease-in-out`}
              style={{
                transform: index === activeNFT 
                  ? 'translateX(0) scale(1) perspective(1000px)' 
                  : index < activeNFT 
                    ? 'translateX(-120%) scale(0.8) perspective(1000px) rotateY(-15deg)' 
                    : 'translateX(120%) scale(0.8) perspective(1000px) rotateY(15deg)',
                opacity: index === activeNFT ? 1 : 0.5,
                zIndex: index === activeNFT ? 10 : 5
              }}
            >
              <div className="bg-gradient-to-b from-otaku-blue/30 to-transparent p-[1px] rounded-xl overflow-hidden">
                <div className="bg-black/80 rounded-xl overflow-hidden">
                  {/* NFT Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Rarity Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${getRarityColor(nft.rarity)} font-cyber uppercase`}>{nft.rarity}</Badge>
                    </div>
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${nft.type === 'earned' ? 'bg-otaku-pink' : 'bg-otaku-purple'} font-cyber uppercase`}>
                        {nft.type === 'earned' ? 'Earned' : 'Purchasable'}
                      </Badge>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                  
                  {/* NFT Info */}
                  <div className="p-4">
                    <h3 className="font-cyber font-bold text-lg mb-1">{nft.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{nft.anime}</p>
                    
                    <div className="flex justify-between items-center">
                      {nft.type === 'paid' ? (
                        <div className="font-cyber text-otaku-blue text-lg">{nft.price} OTK</div>
                      ) : (
                        <div className="text-otaku-pink text-sm">Community Reward</div>
                      )}
                      <button className="bg-otaku-blue/80 hover:bg-otaku-blue-sky text-white text-sm py-2 px-3 rounded font-cyber">
                        {nft.type === 'paid' ? 'Purchase' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card Reflection Effect */}
              <div 
                className="w-full h-16 mt-2 rounded-lg opacity-30 blur-sm"
                style={{
                  background: `linear-gradient(to bottom, rgba(30, 174, 219, 0.3), transparent)`,
                  transform: 'scaleY(-0.3) translateY(-30%)'
                }}
              ></div>
            </div>
          ))}
        </div>
        
        {/* Indicator Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {NFTS.map((_, index) => (
            <button 
              key={index} 
              className={`h-2 rounded-full transition-all ${
                activeNFT === index ? 'w-8 bg-otaku-blue' : 'w-2 bg-white/30'
              }`}
              onClick={() => setActiveNFT(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NFTShowcase;

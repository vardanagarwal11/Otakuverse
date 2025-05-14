
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
    name: "Saitama Genesis",
    image: "https://preview.redd.it/9esa8cif2ja81.png?width=1080&crop=smart&auto=webp&s=8ec49edea780fcd7b1c12bc6dd26886e7d7b17c4",
    type: "paid",
    rarity: "rare",
    anime: "One Punch Man",
    price: 2.5
  },
  {
    id: 2,
    name: "All Might Portrait",
    image: "https://i.pinimg.com/236x/e9/b2/45/e9b2453a07b5948aa5d97283d240b42b.jpg",
    type: "paid",
    rarity: "rare",
    anime: "My Hero Academia",
    price: 1.52
  },
  {
    id: 3,
    name: "Scout Regiment Badge",
    image: "https://media.sketchfab.com/models/8812126a43144d85abaae7d88e4d868c/thumbnails/73f4c01a9cfa489f94203b14dfe4520f/cee19a4936a245b29209ed09569afaab.jpeg",
    type: "earned",
    rarity: "legendary",
    anime: "Attack on Titan"
  },
  {
    id: 4,
    name: "Tanjiro's Sword",
    image: "https://www.coolkatana.com/cdn/shop/articles/power_of_coolKatana_s_tanjiro_nichirin_sword_9103e7bb-20f1-4f7d-bec5-d43f9e727840.jpg?v=1740042664",
    type: "paid",
    rarity: "rare",
    anime: "Demon Slayer",
    price: 1.8
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
                        <div className="font-cyber text-otaku-blue text-lg">{nft.price} SOL</div>
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

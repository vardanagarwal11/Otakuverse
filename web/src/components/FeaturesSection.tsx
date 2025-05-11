
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Palette, Play } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-cyber font-bold text-center mb-12 neon-text">
        Immerse Yourself in the <span className="neon-text-blue">Otaku</span>
        <span className="neon-text-pink">verse</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Community Hubs Feature */}
        <div className="bg-gradient-to-b from-otaku-purple/20 to-transparent p-[1px] rounded-2xl overflow-hidden group">
          <div className="bg-black/60 h-full rounded-2xl p-8 flex flex-col items-center text-center relative hover:bg-otaku-dark/80 transition-colors">
            <div className="absolute -top-10 left-0 right-0 h-32 bg-gradient-radial from-otaku-purple/40 to-transparent opacity-70 blur-2xl"></div>
            <Users className="w-16 h-16 text-otaku-purple mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-cyber font-bold mb-4 neon-text">Community Hubs</h3>
            <p className="text-white/80 mb-6">
              Join dedicated anime communities, engage in discussions, share fanart, and earn badges as a top contributor.
            </p>
            <div className="mt-auto">
              <Link to="/communities">
                <Button className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber">
                  Explore Communities
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* NFT Marketplace Feature */}
        <div className="bg-gradient-to-b from-otaku-blue/20 to-transparent p-[1px] rounded-2xl overflow-hidden group">
          <div className="bg-black/60 h-full rounded-2xl p-8 flex flex-col items-center text-center relative hover:bg-otaku-dark/80 transition-colors">
            <div className="absolute -top-10 left-0 right-0 h-32 bg-gradient-radial from-otaku-blue/40 to-transparent opacity-70 blur-2xl"></div>
            <Palette className="w-16 h-16 text-otaku-blue mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-cyber font-bold mb-4 neon-text-blue">NFT Marketplace</h3>
            <p className="text-white/80 mb-6">
              Collect, mint, and trade exclusive anime NFTs. Earn special non-purchasable NFTs by being an active community member.
            </p>
            <div className="mt-auto">
              <Link to="/marketplace">
                <Button className="bg-otaku-blue hover:bg-otaku-blue-sky text-white font-cyber">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Anime Watching Feature */}
        <div className="bg-gradient-to-b from-otaku-pink/20 to-transparent p-[1px] rounded-2xl overflow-hidden group">
          <div className="bg-black/60 h-full rounded-2xl p-8 flex flex-col items-center text-center relative hover:bg-otaku-dark/80 transition-colors">
            <div className="absolute -top-10 left-0 right-0 h-32 bg-gradient-radial from-otaku-pink/40 to-transparent opacity-70 blur-2xl"></div>
            <Play className="w-16 h-16 text-otaku-pink mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-cyber font-bold mb-4 neon-text-pink">Anime Watching</h3>
            <p className="text-white/80 mb-6">
              Watch your favorite anime with an immersive player, track your progress, and unlock achievements and special NFTs.
            </p>
            <div className="mt-auto">
              <Link to="/anime">
                <Button className="bg-otaku-pink hover:bg-otaku-pink/80 text-white font-cyber">
                  Start Watching
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

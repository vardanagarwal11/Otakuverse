
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");

  const handleJoinWaitlist = () => {
    // In a real application, you would send this to your backend
    // For now, we'll just show a success notification
    toast({
      title: "Success! You're on the list",
      description: "You'll be the first to know when we launch new features.",
      variant: "default",
    });
    
    setEmail("");
  };

  return (
    <div className="rounded-2xl overflow-hidden relative">
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-otaku-purple/30 via-otaku-blue/20 to-otaku-pink/30 opacity-50"></div>
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Content */}
      <div className="relative p-8 md:p-12 flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 rounded-full bg-otaku-purple/20 flex items-center justify-center mb-6">
          <Bell className="text-otaku-purple w-8 h-8" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4 neon-text">
          Join the Otaku<span className="neon-text-blue">verse</span> Waitlist
        </h2>
        
        <p className="text-lg text-white/80 max-w-2xl mb-8">
          Be the first to access our exclusive creator tools, community features, 
          and NFT drops. Sign up now and get priority access when we launch!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 bg-black/50 border border-otaku-purple/30 rounded-lg text-white focus:outline-none focus:border-otaku-purple"
          />
          
          <Button 
            onClick={handleJoinWaitlist}
            className="px-8 py-6 bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber transition-all duration-300 hover:shadow-[0_0_10px_#9b87f5] animate-neon-pulse"
          >
            Join Waitlist
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-otaku-purple rounded-full animate-pulse"></div>
            <span>Early Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-otaku-blue rounded-full animate-pulse"></div>
            <span>Exclusive NFTs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-otaku-pink rounded-full animate-pulse"></div>
            <span>Priority Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSection;

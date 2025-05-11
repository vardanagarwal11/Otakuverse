
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { connectPhantom, isPhantomAvailable } from "../utils/walletUtils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    if (!isPhantomAvailable()) {
      toast({
        title: "Wallet not detected",
        description: "Please install a Solana wallet like Phantom or Backpack",
        variant: "destructive",
      });
      navigate("/auth?register=true");
      return;
    }
    
    try {
      const result = await connectPhantom();
      if (result) {
        toast({
          title: "Wallet connected!",
          description: `Connected to ${result.name} wallet`,
        });
        // In a real app, you would update the UI to show the connected wallet
      } else {
        navigate("/auth?register=true");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      navigate("/auth?register=true");
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent py-4 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-3xl md:text-4xl font-cyber font-bold text-white">
            <span className="text-otaku-purple">Otaku</span>
            <span className="text-otaku-blue">verse</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-cyber text-white hover:text-otaku-purple transition-colors">Home</Link>
            <Link to="/about" className="font-cyber text-white hover:text-otaku-purple transition-colors">About</Link>
            <Link to="/services" className="font-cyber text-white hover:text-otaku-purple transition-colors">Services</Link>
            <Link to="/marketplace" className="font-cyber text-white hover:text-otaku-purple transition-colors">Marketplace</Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="outline" className="border-otaku-blue text-otaku-blue hover:bg-otaku-blue/20 font-cyber">
              Login with Crunchyroll
            </Button>
          </Link>
          <Button 
            onClick={handleConnectWallet}
            className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber flex items-center gap-2"
          >
            <Wallet size={18} />
            Connect Wallet
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 z-40 pt-4 px-4">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/services" 
              className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/marketplace" 
              className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            
            <div className="pt-4 flex flex-col space-y-4">
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-otaku-blue text-otaku-blue hover:bg-otaku-blue/20 font-cyber">
                  Login with Crunchyroll
                </Button>
              </Link>
              <Button
                onClick={() => {
                  handleConnectWallet();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber flex items-center justify-center gap-2"
              >
                <Wallet size={18} />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { publicKey } = useWallet();

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
          <div className="ml-2">
            <WalletMultiButton className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber flex items-center gap-2" />
          </div>
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
              <div className="w-full flex justify-center">
                <WalletMultiButton className="w-full bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber flex items-center justify-center gap-2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

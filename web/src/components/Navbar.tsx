import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import {
  Dialog as UIDialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ComingSoonModal from "./ComingSoonModal";

// WalletInfoModal component for wallet connection UI
const WalletInfoModal = () => {
  const [open, setOpen] = useState(false);
  const [walletConnected] = useState(true); // Set to true to show modal trigger
  const [walletAddress] = useState("5a2d...9F3C");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!walletConnected) return null;

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="ml-2 font-cyber border-otaku-blue text-otaku-blue hover:bg-otaku-blue/20"
        >
          Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs flex flex-col items-center gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">Wallet Connected</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-sm font-mono bg-otaku-dark px-3 py-2 rounded-lg border border-otaku-blue/40 mb-2">
            {walletAddress}
          </span>
          <Button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 bg-otaku-blue hover:bg-otaku-purple-vivid text-white font-cyber"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Address"}
          </Button>
          <Button className="w-full bg-otaku-pink hover:bg-otaku-blue text-white font-cyber mt-2">
            Change Wallet
          </Button>
          <Button className="w-full bg-otaku-dark border border-otaku-pink text-otaku-pink hover:bg-otaku-pink/10 font-cyber mt-2">
            Disconnect
          </Button>
        </div>
      </DialogContent>
    </UIDialog>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, signOut } = useAuth();

  const [showComingSoon, setShowComingSoon] = useState(false);
  const handleCreatorStudioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
  };

  return (
    <>
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
            <Link
              to="/"
              className="font-cyber text-white hover:text-otaku-purple transition-colors"
            >
              Home
            </Link>
            <Link
              to="/anime"
              className="font-cyber text-white hover:text-otaku-purple transition-colors"
            >
              Anime
            </Link>
            <Link
              to="/marketplace"
              className="font-cyber text-white hover:text-otaku-purple transition-colors"
            >
              Marketplace
            </Link>
            <Link
              to="/communities"
              className="font-cyber text-white hover:text-otaku-purple transition-colors"
            >
              Communities
            </Link>

            <Link
              to="/dashboard"
              className="font-cyber text-white hover:text-otaku-purple transition-colors"
            >
              Dashboard
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Button onClick={() => signOut()} className="font-cyber">
                  Logout
                </Button>
                {/* Wallet Modal Trigger (visible if wallet is connected) */}
                <WalletInfoModal />
              </>
            ) : (
              <UIDialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-otaku-blue text-otaku-blue hover:bg-otaku-blue/20 font-cyber"
                  >
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center gap-6 max-w-xs">
                  <DialogHeader>
                    <DialogTitle className="text-center">Login</DialogTitle>
                  </DialogHeader>
                  <SignInButton mode="modal">
                    <Button className="w-full bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber">
                      Login with Google
                    </Button>
                  </SignInButton>
                  <WalletMultiButton className="w-full bg-otaku-blue hover:bg-otaku-purple-vivid text-white font-cyber" />
                </DialogContent>
              </UIDialog>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
                to="/anime"
                className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Anime
              </Link>
              <Link
                to="/marketplace"
                className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/communities"
                className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Communities
              </Link>
              <Link
                to="/dashboard"
                className="font-cyber text-xl py-2 px-4 rounded-md hover:bg-otaku-purple/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>

              <div className="pt-4 flex flex-col space-y-4">
                {isSignedIn ? (
                  <Button onClick={() => signOut()} className="font-cyber">
                    Logout
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full border-otaku-blue text-otaku-blue hover:bg-otaku-blue/20 font-cyber"
                    >
                      Login
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <ComingSoonModal open={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </>
  );
};

export default Navbar;

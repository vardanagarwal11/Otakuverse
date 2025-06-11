import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Check, X, AlertCircle } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import { initiateTrade, acceptTrade, cancelTrade } from "@/utils/programUtils";

interface NFT {
  id: string;
  name: string;
  anime: string;
  image: string;
  type: string;
  rarity: string;
  owner?: string;
}

interface Trade {
  id: number;
  initiator: string;
  initiatorNft: NFT;
  counterparty: string;
  counterpartyNft: NFT;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
}

const Trading = () => {
  const navigate = useNavigate();
  const { wallet, publicKey, connected } = useWallet();
  
  // Mock NFTs owned by the user
  const [userNfts, setUserNfts] = useState<NFT[]>([
    {
      id: "nft1",
      name: "Naruto Sage Mode",
      anime: "Naruto",
      image: "/nfts/naruto-sage.jpg",
      type: "Character",
      rarity: "Legendary",
    },
    {
      id: "nft2",
      name: "Sasuke Uchiha",
      anime: "Naruto",
      image: "/nfts/sasuke.jpg",
      type: "Character",
      rarity: "Epic",
    },
    {
      id: "nft3",
      name: "One Piece Ship",
      anime: "One Piece",
      image: "/nfts/one-piece-ship.jpg",
      type: "Item",
      rarity: "Rare",
    },
  ]);
  
  // Mock NFTs available for trade
  const [availableNfts, setAvailableNfts] = useState<NFT[]>([
    {
      id: "nft4",
      name: "Luffy Gear 5",
      anime: "One Piece",
      image: "/nfts/luffy-gear5.jpg",
      type: "Character",
      rarity: "Legendary",
      owner: "7ZpQ...mNkR",
    },
    {
      id: "nft5",
      name: "Gojo Satoru",
      anime: "Jujutsu Kaisen",
      image: "/nfts/gojo.jpg",
      type: "Character",
      rarity: "Epic",
      owner: "3RtF...pQxZ",
    },
    {
      id: "nft6",
      name: "Demon Slayer Sword",
      anime: "Demon Slayer",
      image: "/nfts/demon-slayer-sword.jpg",
      type: "Item",
      rarity: "Rare",
      owner: "9KjL...tYbW",
    },
  ]);
  
  // Mock active trades
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: 1,
      initiator: "5XnY...wAJb",
      initiatorNft: {
        id: "nft2",
        name: "Sasuke Uchiha",
        anime: "Naruto",
        image: "/nfts/sasuke.jpg",
        type: "Character",
        rarity: "Epic",
      },
      counterparty: "7ZpQ...mNkR",
      counterpartyNft: {
        id: "nft4",
        name: "Luffy Gear 5",
        anime: "One Piece",
        image: "/nfts/luffy-gear5.jpg",
        type: "Character",
        rarity: "Legendary",
      },
      status: "pending",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
    },
  ]);
  
  const [selectedUserNft, setSelectedUserNft] = useState<NFT | null>(null);
  const [selectedAvailableNft, setSelectedAvailableNft] = useState<NFT | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInitiateTrade = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet to initiate a trade");
      return;
    }
    
    if (!selectedUserNft || !selectedAvailableNft) {
      alert("Please select NFTs for trade");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const tradeId = Date.now();
      await initiateTrade(
        tradeId,
        selectedUserNft.id,
        selectedAvailableNft.owner!,
        selectedAvailableNft.id,
        wallet
      );
      
      // Add to local state (in a real app, you'd fetch from blockchain)
      setTrades([
        {
          id: tradeId,
          initiator: publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4),
          initiatorNft: selectedUserNft,
          counterparty: selectedAvailableNft.owner!,
          counterpartyNft: selectedAvailableNft,
          status: "pending",
          createdAt: new Date(),
        },
        ...trades,
      ]);
      
      setSelectedUserNft(null);
      setSelectedAvailableNft(null);
    } catch (error) {
      console.error("Error initiating trade:", error);
      alert(`Failed to initiate trade: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAcceptTrade = async (tradeId: number) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet to accept a trade");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await acceptTrade(tradeId, wallet);
      
      // Update local state (in a real app, you'd fetch from blockchain)
      setTrades(trades.map(trade => {
        if (trade.id === tradeId) {
          return {
            ...trade,
            status: "completed",
          };
        }
        return trade;
      }));
    } catch (error) {
      console.error("Error accepting trade:", error);
      alert(`Failed to accept trade: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancelTrade = async (tradeId: number) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet to cancel a trade");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await cancelTrade(tradeId, wallet);
      
      // Update local state (in a real app, you'd fetch from blockchain)
      setTrades(trades.map(trade => {
        if (trade.id === tradeId) {
          return {
            ...trade,
            status: "cancelled",
          };
        }
        return trade;
      }));
    } catch (error) {
      console.error("Error cancelling trade:", error);
      alert(`Failed to cancel trade: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18142b] to-[#2c225a]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">NFT Trading</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Your NFTs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userNfts.map((nft) => (
                <Card 
                  key={nft.id} 
                  className={`bg-white/10 backdrop-blur-lg border ${selectedUserNft?.id === nft.id ? 'border-[#6c47ff]' : 'border-white/20'} cursor-pointer transition-all hover:border-[#6c47ff]/70`}
                  onClick={() => setSelectedUserNft(selectedUserNft?.id === nft.id ? null : nft)}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={nft.image} 
                      alt={nft.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/300x300/6c47ff/FFFFFF?text=NFT";
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold">{nft.name}</h3>
                    <p className="text-white/70 text-sm">{nft.anime}</p>
                    <div className="flex justify-between mt-2">
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{nft.type}</Badge>
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{nft.rarity}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Available for Trade</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableNfts.map((nft) => (
                <Card 
                  key={nft.id} 
                  className={`bg-white/10 backdrop-blur-lg border ${selectedAvailableNft?.id === nft.id ? 'border-[#6c47ff]' : 'border-white/20'} cursor-pointer transition-all hover:border-[#6c47ff]/70`}
                  onClick={() => setSelectedAvailableNft(selectedAvailableNft?.id === nft.id ? null : nft)}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={nft.image} 
                      alt={nft.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/300x300/6c47ff/FFFFFF?text=NFT";
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold">{nft.name}</h3>
                    <p className="text-white/70 text-sm">{nft.anime}</p>
                    <div className="flex justify-between mt-2">
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{nft.type}</Badge>
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{nft.rarity}</Badge>
                    </div>
                    <p className="text-white/60 text-xs mt-2">Owner: {nft.owner}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-12">
          <Button 
            className="bg-[#6c47ff] hover:bg-[#7c5aff] flex items-center gap-2 px-8 py-6"
            disabled={!selectedUserNft || !selectedAvailableNft || isSubmitting}
            onClick={handleInitiateTrade}
          >
            <ArrowLeftRight className="w-5 h-5" />
            {isSubmitting ? "Processing..." : "Initiate Trade"}
          </Button>
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-6">Active Trades</h2>
        <div className="grid grid-cols-1 gap-6">
          {trades.map((trade) => (
            <Card key={trade.id} className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white">Trade #{trade.id}</CardTitle>
                  {getStatusBadge(trade.status)}
                </div>
                <CardDescription className="text-white/70">
                  Initiated by {trade.initiator} on {formatDate(trade.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <p className="text-white/70 mb-2">Offering</p>
                    <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-lg mb-2">
                      <img 
                        src={trade.initiatorNft.image} 
                        alt={trade.initiatorNft.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/300x300/6c47ff/FFFFFF?text=NFT";
                        }}
                      />
                    </div>
                    <h3 className="text-white font-semibold">{trade.initiatorNft.name}</h3>
                    <p className="text-white/70 text-sm">{trade.initiatorNft.anime}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{trade.initiatorNft.type}</Badge>
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{trade.initiatorNft.rarity}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <p className="text-white/70 mb-2">Requesting</p>
                    <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-lg mb-2">
                      <img 
                        src={trade.counterpartyNft.image} 
                        alt={trade.counterpartyNft.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/300x300/6c47ff/FFFFFF?text=NFT";
                        }}
                      />
                    </div>
                    <h3 className="text-white font-semibold">{trade.counterpartyNft.name}</h3>
                    <p className="text-white/70 text-sm">{trade.counterpartyNft.anime}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{trade.counterpartyNft.type}</Badge>
                      <Badge className="bg-[#6c47ff]/30 text-[#a084fa]">{trade.counterpartyNft.rarity}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {trade.status === "pending" && (
                <CardFooter className="flex justify-end space-x-4">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2" 
                    onClick={() => handleAcceptTrade(trade.id)}
                    disabled={isSubmitting}
                  >
                    <Check className="w-4 h-4" /> Accept
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2" 
                    onClick={() => handleCancelTrade(trade.id)}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </CardFooter>
              )}
              
              {trade.status === "completed" && (
                <CardFooter>
                  <div className="w-full flex items-center justify-center py-2 text-green-400 gap-2">
                    <Check className="w-5 h-5" /> Trade completed successfully
                  </div>
                </CardFooter>
              )}
              
              {trade.status === "cancelled" && (
                <CardFooter>
                  <div className="w-full flex items-center justify-center py-2 text-red-400 gap-2">
                    <AlertCircle className="w-5 h-5" /> Trade was cancelled
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
          
          {trades.length === 0 && (
            <div className="text-center py-12 text-white/60">
              No active trades found. Initiate a trade to get started.
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Trading;
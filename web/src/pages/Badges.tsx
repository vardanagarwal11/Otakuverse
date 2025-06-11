import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mintBadge, verifyAccess } from '@/utils/programUtils';
import { useToast } from '@/components/ui/use-toast';

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  requirements: string;
  type: 'achievement' | 'membership' | 'special';
}

interface AccessPass {
  id: string;
  name: string;
  description: string;
  image: string;
  area: string;
  expiryDate: string;
}

const Badges: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const wallet = useWallet();
  const { toast } = useToast();
  
  // State for badge minting
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // State for access verification
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [accessArea, setAccessArea] = useState('');
  
  // Mock data for badges
  const badges: Badge[] = [
    {
      id: '1',
      name: 'Early Adopter',
      description: 'Awarded to the first 100 members of OtakuVerse',
      image: '/lovable-uploads/badge-early-adopter.svg',
      requirements: 'Be among the first 100 registered users',
      type: 'achievement'
    },
    {
      id: '2',
      name: 'Anime Expert',
      description: 'For those who have watched over 50 anime series',
      image: '/lovable-uploads/badge-anime-expert.svg',
      requirements: 'Watch 50+ anime series',
      type: 'achievement'
    },
    {
      id: '3',
      name: 'Premium Member',
      description: 'Exclusive badge for premium members',
      image: '/lovable-uploads/badge-premium.svg',
      requirements: 'Subscribe to premium membership',
      type: 'membership'
    },
    {
      id: '4',
      name: 'Event Organizer',
      description: 'For members who have organized community events',
      image: '/lovable-uploads/badge-event.svg',
      requirements: 'Organize at least one community event',
      type: 'special'
    },
  ];
  
  // Mock data for access passes
  const accessPasses: AccessPass[] = [
    {
      id: '1',
      name: 'VIP Access',
      description: 'Grants access to exclusive content and events',
      image: '/lovable-uploads/access-vip.svg',
      area: 'VIP Lounge',
      expiryDate: '2023-12-31'
    },
    {
      id: '2',
      name: 'Creator Pass',
      description: 'For content creators in the OtakuVerse ecosystem',
      image: '/lovable-uploads/access-creator.svg',
      area: 'Creator Studio',
      expiryDate: '2023-12-31'
    },
    {
      id: '3',
      name: 'Moderator Badge',
      description: 'For community moderators',
      image: '/lovable-uploads/access-moderator.svg',
      area: 'Moderation Tools',
      expiryDate: '2023-12-31'
    },
  ];
  
  // Handle badge minting
  const handleMintBadge = async (badge: Badge) => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint badges",
        variant: "destructive"
      });
      return;
    }
    
    setIsMinting(true);
    setSelectedBadge(badge);
    
    try {
      await mintBadge(badge.id, wallet);
      setMintSuccess(true);
      toast({
        title: "Badge Minted!",
        description: `You've successfully minted the ${badge.name} badge`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error minting badge:", error);
      toast({
        title: "Minting Failed",
        description: "There was an error minting your badge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };
  
  // Handle access verification
  const handleVerifyAccess = async (area: string) => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to verify access",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    setAccessArea(area);
    
    try {
      await verifyAccess(area, wallet);
      setVerifySuccess(true);
      toast({
        title: "Access Verified!",
        description: `You have access to ${area}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error verifying access:", error);
      toast({
        title: "Verification Failed",
        description: "You don't have access to this area or there was an error verifying your access.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Badges & Access</h1>
      
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="access">Access Passes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="badges" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{badge.name}</CardTitle>
                  <CardDescription>{badge.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                    <img 
                      src={badge.image} 
                      alt={badge.name} 
                      className="h-32 w-32 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <p className="text-sm mb-2">{badge.description}</p>
                  <p className="text-xs text-gray-500">Requirements: {badge.requirements}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleMintBadge(badge)} 
                    disabled={isMinting && selectedBadge?.id === badge.id}
                    className="w-full"
                  >
                    {isMinting && selectedBadge?.id === badge.id ? 'Minting...' : 'Mint Badge'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="access" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessPasses.map((pass) => (
              <Card key={pass.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{pass.name}</CardTitle>
                  <CardDescription>Expires: {pass.expiryDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                    <img 
                      src={pass.image} 
                      alt={pass.name} 
                      className="h-32 w-32 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <p className="text-sm mb-2">{pass.description}</p>
                  <p className="text-xs text-gray-500">Access Area: {pass.area}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleVerifyAccess(pass.area)} 
                    disabled={isVerifying && accessArea === pass.area}
                    className="w-full"
                  >
                    {isVerifying && accessArea === pass.area ? 'Verifying...' : 'Verify Access'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {mintSuccess && (
        <Alert className="mt-6 bg-green-50 border-green-200">
          <AlertTitle>Badge Minted Successfully!</AlertTitle>
          <AlertDescription>
            Congratulations! You've successfully minted the {selectedBadge?.name} badge. It will appear in your wallet shortly.
          </AlertDescription>
        </Alert>
      )}
      
      {verifySuccess && (
        <Alert className="mt-6 bg-green-50 border-green-200">
          <AlertTitle>Access Verified!</AlertTitle>
          <AlertDescription>
            You have been granted access to {accessArea}. You can now access exclusive content and features.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Badges;
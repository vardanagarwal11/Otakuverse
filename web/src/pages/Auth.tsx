import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { 
  connectBackpack, 
  isBackpackAvailable,
  WalletInfo
} from "../utils/walletUtils";
import { Wallet } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get('register') === 'true' ? 'register' : 'login'
  );
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Implementation would go here in a real app to check for existing connections
    };
    
    checkWalletConnection();
  }, []);
  
  
  // Handle Backpack wallet connection
  const handleBackpackConnect = async () => {
    setIsConnecting(true);
    
    try {
      const walletData = await connectBackpack();
      
      if (walletData) {
        setWalletInfo(walletData);
        toast({
          title: "Wallet connected!",
          description: `Connected to Backpack (${walletData.publicKey.substring(0, 6)}...${walletData.publicKey.substring(walletData.publicKey.length - 4)})`,
        });
        
        // In a real app, you might want to redirect or update the UI
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast({
          title: "Backpack not installed",
          description: "Please install the Backpack wallet extension",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to Backpack wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-otaku-dark text-white">
      <Navbar />
      
      <div 
        className="min-h-screen flex items-center justify-center py-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-otaku-dark via-otaku-dark/90 to-otaku-dark/80"></div>
        
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-cyber font-bold neon-text mb-2">
              Welcome to <span className="text-otaku-blue">Otakuverse</span>
            </h2>
            <p className="text-white/70">
              {activeTab === 'login' 
                ? 'Sign in to continue to your account' 
                : 'Join the revolution in anime streaming'}
            </p>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-otaku-purple/30 p-6 shadow-[0_0_15px_rgba(155,135,245,0.3)]">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login" className="font-cyber">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="font-cyber">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-otaku-blue hover:underline">Forgot password?</a>
                    </div>
                    <Input id="password" type="password" />
                  </div>
                  
                  <Button className="w-full bg-otaku-purple hover:bg-otaku-purple-vivid font-cyber">
                    Sign In
                  </Button>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10"></span>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-black/50 px-2 text-xs text-white/50">OR CONTINUE WITH</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="border-otaku-blue/50 hover:border-otaku-blue hover:bg-otaku-blue/20">
                      <img src="https://cdn.worldvectorlogo.com/logos/google-icon.svg" className="w-5 h-5 mr-2" alt="Google" />
                      Google
                    </Button>
                    <Button variant="outline" className="border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/20">
                      <span className="font-bold mr-2 text-orange-500">C</span>
                      Crunchyroll
                    </Button>
                  </div>
                  
                  <div className="flex justify-center my-2">
  <WalletMultiButton className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber w-full" />
</div>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded border-gray-500 text-otaku-purple focus:ring-otaku-purple" />
                    <label htmlFor="terms" className="text-sm text-white/70">
                      I agree to the <a href="#" className="text-otaku-blue hover:underline">Terms of Service</a> and <a href="#" className="text-otaku-blue hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  
                  <Button className="w-full bg-otaku-purple hover:bg-otaku-purple-vivid font-cyber">
                    Create Account
                  </Button>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10"></span>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-black/50 px-2 text-xs text-white/50">OR REGISTER WITH</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="border-otaku-blue/50 hover:border-otaku-blue hover:bg-otaku-blue/20">
                      <img src="https://cdn.worldvectorlogo.com/logos/google-icon.svg" className="w-5 h-5 mr-2" alt="Google" />
                      Google
                    </Button>
                    <Button variant="outline" className="border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/20">
                      <span className="font-bold mr-2 text-orange-500">C</span>
                      Crunchyroll
                    </Button>
                  </div>
                  
                  <div className="flex justify-center my-2">
  <WalletMultiButton className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber w-full" />
</div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

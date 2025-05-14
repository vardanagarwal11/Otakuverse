
import { useState } from 'react';
import ComingSoonModal from '@/components/ComingSoonModal';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, Rocket, PenTool, ShoppingBag, 
  Gift, BarChart2, Clock, Heart, Award, User
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const userData = {
    name: "Anime Fan",
    watchTime: "124h 35m",
    earnedTokens: "2,456 SOL",
    nftBadges: 8,
    watchlist: 12
  };

  const menuItems = [
    { 
      title: "Watch Anime", 
      icon: <PlayCircle className="w-8 h-8" />, 
      color: "bg-gradient-to-br from-otaku-blue to-otaku-blue-sky",
      link: "/anime" 
    },

    { 
      title: "Creator Studio", 
      icon: <PenTool className="w-8 h-8" />, 
      color: "bg-gradient-to-br from-otaku-pink to-purple-500",
      onClick: () => setComingSoonOpen(true)
    },
    { 
      title: "Marketplace", 
      icon: <ShoppingBag className="w-8 h-8" />, 
      color: "bg-gradient-to-br from-otaku-orange to-yellow-500",
      link: "/marketplace" 
    },
    { 
      title: "My Rewards", 
      icon: <Gift className="w-8 h-8" />, 
      color: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/rewards" 
    },
  ];

  return (
    <div className="min-h-screen bg-otaku-dark text-white">
      <Navbar />
      <ComingSoonModal open={comingSoonOpen} onClose={() => setComingSoonOpen(false)} />
      
      <div className="container mx-auto px-4 py-20">
        {/* User Profile Summary */}
        <div className="mb-10">
          <div className="rounded-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-otaku-purple via-otaku-blue to-otaku-pink relative">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.4
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-otaku-dark/90 to-transparent"></div>
            </div>
            
            <div className="bg-card p-6 flex flex-col md:flex-row items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative -mt-16 md:-mt-10 mr-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-otaku-purple to-otaku-blue p-[2px]">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-otaku-dark rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-otaku-blue" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
                  <div className="flex items-center text-white/60 text-sm">
                    <span>Premium Member</span>
                    <span className="mx-2">•</span>
                    <span>Joined May 2025</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 md:mt-0 md:ml-auto">
                <div className="flex flex-col items-center p-3 rounded-lg bg-otaku-dark/50">
                  <Clock className="w-5 h-5 text-otaku-blue mb-1" />
                  <span className="block font-bold">{userData.watchTime}</span>
                  <span className="text-xs text-white/60">Watch Time</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-otaku-dark/50">
                  <BarChart2 className="w-5 h-5 text-otaku-purple mb-1" />
                  <span className="block font-bold">{userData.earnedTokens}</span>
                  <span className="text-xs text-white/60">Tokens Earned</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-otaku-dark/50">
                  <Award className="w-5 h-5 text-otaku-pink mb-1" />
                  <span className="block font-bold">{userData.nftBadges}</span>
                  <span className="text-xs text-white/60">NFT Badges</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-otaku-dark/50">
                  <Heart className="w-5 h-5 text-otaku-orange mb-1" />
                  <span className="block font-bold">{userData.watchlist}</span>
                  <span className="text-xs text-white/60">Watchlist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tiles */}
        <div className="grid gap-6 mb-0" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          display: 'grid'
        }}>

          {menuItems.map((item, idx) => {
            const vibrantRing = [
              'from-otaku-blue to-otaku-blue-sky',
              'from-otaku-pink to-purple-500',
              'from-otaku-orange to-yellow-500',
              'from-green-400 to-green-600'
            ][idx % 4];
            const content = (
              <>
                <div className={`mb-3 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br ${vibrantRing} shadow-lg`}>
                  {item.icon}
                </div>
                <span className="font-bold text-lg mb-1 group-hover:text-otaku-pink transition-colors text-center w-full block">
                  {item.title}
                </span>
              </>
            );
            return item.onClick ? (
              <button
                key={item.title}
                onClick={item.onClick}
                className={`rounded-2xl p-6 flex flex-col items-center shadow-xl group hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer bg-otaku-dark/80 border border-otaku-blue/10`}
                style={{ minHeight: 170 }}
              >
                {content}
              </button>
            ) : (
              <Link
                key={item.title}
                to={item.link}
                className={`rounded-2xl p-6 flex flex-col items-center shadow-xl group hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer bg-otaku-dark/80 border border-otaku-blue/10`}
                style={{ minHeight: 170 }}
              >
                {content}
              </Link>
            );
          })}
        </div>
        
        {/* Continue Watching Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="anime-card">
                <div className="relative aspect-video">
                  <img
                    src={`https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500&h=280&fit=crop&auto=format&random=${item}`}
                    alt={`Anime ${item}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-12 h-12" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <div className="flex justify-between text-xs">
                      <span>Episode 12</span>
                      <span>12:24 / 24:30</span>
                    </div>
                    <Progress value={50} className="h-1 mt-1 bg-white/20" />
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium truncate">Anime Title {item}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Progress = ({ value, className = "" }: { value: number, className?: string }) => {
  return (
    <div className={`w-full bg-gray-700 ${className}`}>
      <div 
        className="bg-otaku-purple h-full" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default Dashboard;

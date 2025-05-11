import { ArrowRight, Heart, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Community {
  id: number;
  name: string;
  banner: string;
  members: number;
  posts: number;
  description: string;
  topContributors: {
    avatar: string;
    username: string;
    isLeader: boolean;
  }[];
}

const COMMUNITIES: Community[] = [
  {
    id: 1,
    name: "Demon Slayer",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
    members: 12450,
    posts: 3240,
    description: "Join the Demon Slayer Corps! Discuss episodes, share theories, and connect with other fans of Tanjiro's journey.",
    topContributors: [
      { avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120", username: "SlayerFan", isLeader: true },
      { avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120", username: "DemonHunter", isLeader: false },
      { avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=120", username: "TanjiroStan", isLeader: false }
    ]
  },
  {
    id: 2,
    name: "Attack on Titan",
    banner: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=800",
    members: 18320,
    posts: 5120,
    description: "Dedicate your hearts! The ultimate community for discussing all things Attack on Titan, from the anime to the manga.",
    topContributors: [
      { avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=120", username: "ErenJaeger", isLeader: true },
      { avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120", username: "MikasaAckerman", isLeader: false },
      { avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120", username: "ArminAlert", isLeader: false }
    ]
  }
];

const CommunitiesShowcase = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-cyber font-bold neon-text">Community Hubs</h2>
        <Link to="/communities" className="flex items-center text-otaku-purple hover:text-otaku-purple-vivid transition-colors group">
          <span className="mr-2 font-cyber">View All</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COMMUNITIES.map((community) => (
          <div 
            key={community.id} 
            className="bg-gradient-to-b from-otaku-purple/30 to-transparent p-[1px] rounded-xl overflow-hidden group"
          >
            <div className="bg-black/60 rounded-xl overflow-hidden hover:bg-black/70 transition-colors">
              {/* Community Banner */}
              <div className="h-40 relative overflow-hidden">
                <img 
                  src={community.banner} 
                  alt={community.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-2xl font-cyber font-bold text-white">{community.name}</h3>
                  <div className="flex items-center space-x-4 text-white/80">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span className="text-sm">{community.members.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare size={16} className="mr-1" />
                      <span className="text-sm">{community.posts.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Community Content */}
              <div className="p-4">
                <p className="text-white/80 text-sm mb-4">{community.description}</p>
                
                {/* Top Contributors */}
                <div className="mb-4">
                  <h4 className="text-sm text-white/70 mb-2">Top Contributors</h4>
                  <div className="flex items-center">
                    {community.topContributors.map((contributor, index) => (
                      <div key={index} className="flex flex-col items-center mr-4">
                        <div className="relative">
                          <img 
                            src={contributor.avatar} 
                            alt={contributor.username} 
                            className={`w-10 h-10 rounded-full object-cover border-2 ${
                              contributor.isLeader ? 'border-otaku-pink' : 'border-otaku-purple/50'
                            }`}
                          />
                          {contributor.isLeader && (
                            <div className="absolute -bottom-1 -right-1 bg-otaku-pink rounded-full p-0.5">
                              <Heart className="w-3 h-3 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs mt-1">{contributor.username}</span>
                        {contributor.isLeader && (
                          <Badge variant="outline" className="text-[10px] h-4 border-otaku-pink text-otaku-pink mt-1">Leader</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link to={`/communities/${community.id}`}>
                  <button className="w-full py-2 bg-otaku-purple hover:bg-otaku-purple-vivid transition-colors rounded-md text-sm font-medium font-cyber">
                    Join Community
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunitiesShowcase;

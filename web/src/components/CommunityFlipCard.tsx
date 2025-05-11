
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Community } from '@/types/community';

interface CommunityFlipCardProps {
  community: Community;
}

const CommunityFlipCard = ({ community }: CommunityFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const themeColors = {
    green: 'from-green-500/30 to-green-800/10 border-green-500/30',
    blue: 'from-blue-500/30 to-blue-800/10 border-blue-500/30',
    purple: 'from-purple-500/30 to-purple-800/10 border-purple-500/30',
    red: 'from-red-500/30 to-red-800/10 border-red-500/30',
    yellow: 'from-yellow-500/30 to-yellow-800/10 border-yellow-500/30',
    orange: 'from-orange-500/30 to-orange-800/10 border-orange-500/30',
    pink: 'from-pink-500/30 to-pink-800/10 border-pink-500/30',
  };

  const themeColor = themeColors[community.theme as keyof typeof themeColors] || themeColors.purple;

  return (
    <div 
      className="flip-card h-[400px] perspective-1000 cursor-pointer w-full"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`flip-card-inner w-full h-full relative transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front Side */}
        <div className={`flip-card-front w-full h-full absolute backface-hidden rounded-xl overflow-hidden border bg-gradient-to-b ${themeColor}`}>
          <div className="h-[60%] relative">
            <img 
              src={community.image} 
              alt={community.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
          </div>
          
          <div className="p-4 flex flex-col justify-between h-[40%]">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-cyber font-bold">{community.name}</h3>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {community.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-white/30 bg-white/10">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-white/70 text-sm">
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{community.members.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare size={14} className="mr-1" />
                <span>{community.posts.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Side - Only enlarged image */}
        <div className={`flip-card-back absolute w-full h-full backface-hidden rounded-xl overflow-hidden rotate-y-180 border`}>
          <div className="w-full h-full overflow-hidden">
            <img 
              src={community.image} 
              alt={community.name}
              className="w-full h-full object-cover scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end justify-center p-6">
              <Link to={`/communities/${community.id}`}>
                <button className="py-3 px-6 bg-white/20 hover:bg-white/30 transition-colors rounded-md flex items-center justify-center gap-2 font-cyber">
                  <span>Visit Community</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityFlipCard;

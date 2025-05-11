
interface CreatorCardProps {
  creator: {
    id: number;
    name: string;
    avatar: string;
    followers: string;
    content: string;
    earnings: string;
  };
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  return (
    <div className="rounded-xl bg-gradient-to-r from-otaku-purple/20 to-otaku-blue/20 p-[1px] overflow-hidden card-hover">
      <div className="bg-card rounded-xl p-6 h-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-otaku-blue"
            />
            <div className="absolute -bottom-1 -right-1 bg-otaku-purple rounded-full p-1">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg neon-text">{creator.name}</h3>
            <p className="text-sm text-white/70">{creator.content}</p>
          </div>
        </div>
        
        <div className="flex justify-between text-sm mb-6">
          <div>
            <p className="text-white/70">Followers</p>
            <p className="font-bold">{creator.followers}</p>
          </div>
          <div>
            <p className="text-white/70">Earnings</p>
            <p className="font-bold neon-text-blue">{creator.earnings}</p>
          </div>
        </div>
        
        <button className="w-full py-2 bg-otaku-blue/80 hover:bg-otaku-blue transition-colors rounded-md text-sm font-medium">
          Support Creator
        </button>
      </div>
    </div>
  );
};

export default CreatorCard;

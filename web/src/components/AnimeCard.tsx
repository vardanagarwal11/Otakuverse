
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "@/components/ui/sonner";

interface AnimeCardProps {
  anime: {
    id: number;
    title: string;
    image: string;
    rating: number;
    genre: string;
    progress?: number;
  };
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  return (
    <div className="anime-card group">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        

        
        <div className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-1 flex items-center">
          <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
          <span className="text-xs font-medium">{anime.rating}</span>
        </div>
        
        <div className="absolute top-2 right-2 bg-otaku-purple-vivid/80 rounded-full px-2 py-1">
          <span className="text-xs font-medium">{anime.genre}</span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-[#9944FF] flex items-center justify-center">
                <span className="text-xs font-bold">SOL</span>
              </div>
              <span className="text-xs text-white/90">Earn while watching</span>
            </div>
            <button 
              onClick={() => {
                if (!isSignedIn) {
                  toast.error("You need to be logged in to watch anime.", {
                    style: { background: '#e11d48', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' },
                    duration: 5000,
                  });
                  return;
                }
                navigate(`/watch/${anime.id}`);
              }}
              className="w-full py-2 bg-otaku-blue hover:bg-otaku-blue-sky transition-colors rounded-md text-sm font-medium"
            >
              Watch Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{anime.title}</h3>
      </div>
    </div>
  );
};

export default AnimeCard;

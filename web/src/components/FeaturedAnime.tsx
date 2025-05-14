
import { Progress } from "@/components/ui/progress";

interface FeaturedAnimeProps {
  title: string;
  description: string;
  image: string;
  progress: number;
  backers: number;
  daysLeft: number;
}

const FeaturedAnime = ({
  title,
  description,
  image,
  progress,
  backers,
  daysLeft,
}: FeaturedAnimeProps) => {
  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-otaku-purple/30 to-otaku-blue/30 p-[1px]">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-otaku-dark to-black/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="relative aspect-video md:aspect-auto md:col-span-1 lg:col-span-1 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-t"></div>
          
          {/* Mobile overlay title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
            <h3 className="text-2xl font-bold font-cyber neon-text mb-1">{title}</h3>
          </div>
        </div>
        
        <div className="p-6 md:p-8 lg:col-span-2">
          {/* Desktop title */}
          <div className="hidden md:block mb-4">
            <h3 className="text-3xl font-bold font-cyber neon-text mb-1">{title}</h3>
            <div className="inline-block px-3 py-1 rounded-full bg-otaku-blue/20 text-otaku-blue text-xs font-medium">
              Original Animation
            </div>
          </div>
          
          <p className="text-white/80 mb-6">
            {description}
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Funded: {progress}%</span>
              <span className="text-white/70">Goal: 100,000 SOL</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <p className="text-sm text-white/70">Backers</p>
              <p className="font-cyber font-bold neon-text">{backers}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <p className="text-sm text-white/70">Days Left</p>
              <p className="font-cyber font-bold neon-text-pink">{daysLeft}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <p className="text-sm text-white/70">Min. Pledge</p>
              <p className="font-cyber font-bold neon-text-blue">50 SOL</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button className="flex-1 py-3 bg-otaku-purple hover:bg-otaku-purple-vivid transition-colors rounded-md text-sm font-medium font-cyber">
              Back This Project
            </button>
            <button className="flex-1 py-3 border border-otaku-blue/80 text-otaku-blue hover:bg-otaku-blue/20 transition-colors rounded-md text-sm font-medium font-cyber">
              Watch Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAnime;

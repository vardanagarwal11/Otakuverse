
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircle, Pause, Volume2, VolumeX, Maximize, 
  Settings, ChevronLeft, ChevronRight, ChevronDown, 
  Heart, Share2, Plus
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const WatchPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [earnedTokens, setEarnedTokens] = useState(12);
  const navigate = useNavigate();
  
  const episodes = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Episode ${i + 1}`,
    duration: '24:30',
    thumbnail: `https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=200&h=100&fit=crop&auto=format&random=${i}`
  }));

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Simulate earning tokens while watching
    if (!isPlaying) {
      const interval = setInterval(() => {
        setEarnedTokens(prev => prev + 1);
      }, 10000); // Earn 1 token every 10 seconds
      return () => clearInterval(interval);
    }
  };

  return (
    <div className="min-h-screen bg-otaku-dark text-white">
      <Navbar />
      
      <div className="pt-16">
        {/* Video Player */}
        <div className="relative aspect-video bg-black overflow-hidden">
          {/* Video placeholder */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('/lovable-uploads/054764f3-fbb6-4a02-bd1b-1b13f66e7c97.png')`,
              filter: 'brightness(0.7)'
            }}
          ></div>
          
          {/* Video controls */}
          {showControls && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 flex flex-col justify-between p-4">
              {/* Top controls */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigate('/anime')}
                  className="flex items-center text-white/90 hover:text-white"
                >
                  <ChevronLeft className="h-6 w-6 mr-2" />
                  Back to Library
                </button>
                
                <div className="flex items-center space-x-4">
                  <button className="text-white/90 hover:text-white">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="text-white/90 hover:text-white">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="text-white/90 hover:text-white">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-otaku-purple/80 hover:bg-otaku-purple flex items-center justify-center transition-transform duration-200 hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="h-10 w-10" />
                  ) : (
                    <PlayCircle className="h-10 w-10" />
                  )}
                </button>
              </div>
              
              {/* Bottom controls */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button onClick={togglePlay} className="text-white">
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <PlayCircle className="h-5 w-5" />
                    )}
                  </button>
                  
                  <div className="text-sm">12:24 / 24:30</div>
                  
                  <div className="flex-grow">
                    <div className="h-1 bg-white/30 rounded-full">
                      <div className="h-full bg-otaku-purple rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  
                  <button onClick={() => setIsMuted(!isMuted)} className="text-white">
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button className="text-white">
                    <Settings className="h-5 w-5" />
                  </button>
                  
                  <button className="text-white">
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">NEXUS: Beyond The Void</h1>
                  <div className="text-sm text-white/80">Season 1, Episode {currentEpisode}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Token earning indicator */}
          <div className="absolute top-4 right-4 bg-black/70 rounded-full px-3 py-1 flex items-center">
            <div className="w-5 h-5 rounded-full bg-otaku-pink flex items-center justify-center mr-2">
              <span className="text-[10px] font-bold">OTK</span>
            </div>
            <span className="text-sm font-medium">{earnedTokens} tokens earned</span>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Episode info */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-2">Episode {currentEpisode}: The Awakening</h2>
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-2 py-1 bg-otaku-purple/20 rounded text-xs">Fantasy</span>
                <span className="px-2 py-1 bg-otaku-blue/20 rounded text-xs">Adventure</span>
                <span className="px-2 py-1 bg-otaku-pink/20 rounded text-xs">Sci-Fi</span>
                <div className="flex items-center">
                  <span className="text-xs text-white/70">Original Release: May 2, 2025</span>
                </div>
              </div>
              
              <p className="text-white/80 mb-8">
                Kira discovers a mysterious artifact that allows her to see into parallel dimensions. 
                As she grapples with this newfound power, shadowy figures begin tracking her movements, 
                revealing that her discovery is part of something far greater than she could have imagined.
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-neon">
                  <Heart className="h-4 w-4 mr-2" /> Add to Favorites
                </button>
                <button className="btn-outline-neon">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </button>
              </div>
            </div>
            
            {/* Episode list */}
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Episodes</h3>
                <div className="flex items-center">
                  <button className="p-1 hover:bg-white/10 rounded-md">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="mx-2 text-sm">Season 1</span>
                  <button className="p-1 hover:bg-white/10 rounded-md">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {episodes.map(episode => (
                  <div 
                    key={episode.id}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                      currentEpisode === episode.id ? 'bg-otaku-purple/30 border-l-2 border-otaku-purple' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setCurrentEpisode(episode.id)}
                  >
                    <div className="w-16 h-10 rounded overflow-hidden mr-3">
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{episode.title}</h4>
                      <p className="text-xs text-white/60">{episode.duration}</p>
                    </div>
                    {currentEpisode === episode.id && (
                      <div className="w-2 h-2 rounded-full bg-otaku-purple"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;

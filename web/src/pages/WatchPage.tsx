import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft,
  Heart, Share2, Plus
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Episode {
  id: number;
  title: string;
  videoId: string;
  duration: string;
}

const WatchPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { animeId } = useParams<{ animeId: string }>();
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [earnedTokens, setEarnedTokens] = useState<number>(0);

  // One Punch Man episodes from YouTube playlist
  const episodes: Episode[] = [
    {
      id: 1,
      title: 'One Punch Man | Episode 1 | The Strongest Man',
      videoId: 'BjzQITTh188',
      duration: '23:39'
    },
    {
      id: 2,
      title: 'One Punch Man | Episode 2 | The Lone Cyborg',
      videoId: 'K-JJm8ykSco',
      duration: '23:39'
    },
    {
      id: 3,
      title: 'One Punch Man | Episode 3 | The Obsessive Scientist',
      videoId: 'a2-vuLKoEak',
      duration: '23:39'
    },
    {
      id: 4,
      title: 'One Punch Man | Episode 4 | The Modern Ninja',
      videoId: '4Oh0T6o5-hs',
      duration: '23:39'
    },
    {
      id: 5,
      title: 'One Punch Man | Episode 5 | The Ultimate Master',
      videoId: 'EuOdDzt4H38',
      duration: '23:39'
    },
    {
      id: 6,
      title: 'One Punch Man | Episode 6 | The Terrifying City',
      videoId: 'dBPNIp0AcFI',
      duration: '23:39'
    },
    {
      id: 7,
      title: 'One Punch Man | Episode 7 | The Ultimate Disciple',
      videoId: 'g2miy-jdQKA',
      duration: '23:39'
    },
    {
      id: 8,
      title: 'One Punch Man | Episode 8 | The Deep Sea King',
      videoId: 'VnawF_we774',
      duration: '23:39'
    },
    {
      id: 9,
      title: 'One Punch Man | Episode 9 | Unyielding Justice',
      videoId: 'J-I0QKFexjE',
      duration: '23:39'
    },
    {
      id: 10,
      title: 'One Punch Man | Episode 10 | Unparalleled Peril',
      videoId: 'jsIvgxBO4mk',
      duration: '23:39'
    },
    {
      id: 11,
      title: 'One Punch Man | Episode 11 | The Dominator of the Universe',
      videoId: 'RWQCORZZLLw',
      duration: '23:39'
    },
    {
      id: 12,
      title: 'One Punch Man | Episode 12 | The Strongest Hero',
      videoId: '_J71sZlvcsI',
      duration: '23:39'
    }
  ];

  useEffect(() => {
    // Only load One Punch Man episodes for anime ID 0
    if (animeId === '0') {
      // Start with episode 1
      setCurrentEpisode(0);
    } else {
      // Redirect to anime library if not One Punch
      navigate('/anime');
    }
  }, [animeId, navigate]);

  useEffect(() => {
    // Simulate earning tokens while watching
    const interval = setInterval(() => {
      setEarnedTokens(prev => prev + 1);
    }, 10000); // Earn 1 token every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-otaku-dark text-white">
      <Navbar />
      <div className="pt-16 max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-black overflow-hidden rounded-xl shadow-lg">
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${episodes[currentEpisode].videoId}?autoplay=1&modestbranding=1&rel=0&controls=1&iv_load_policy=3&disablekb=1`}
              title={episodes[currentEpisode].title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            {/* Top controls */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
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
            </div>

          </div>
          {/* Anime Info Section Below Video */}
          <section className="w-full max-w-2xl mx-auto mt-6 mb-4 p-6 rounded-2xl bg-gradient-to-br from-otaku-gray/80 to-otaku-dark/90 shadow-lg border border-otaku-purple/30">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white leading-tight">One Punch Man</h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-pink-500 text-xs font-semibold px-2 py-1 rounded shadow uppercase">PG-13</span>
              <span className="bg-otaku-purple text-xs font-semibold px-2 py-1 rounded shadow uppercase">HD</span>
              <span className="bg-green-600 text-xs font-semibold px-2 py-1 rounded shadow uppercase">CC</span>
              <span className="bg-otaku-gray text-xs font-semibold px-2 py-1 rounded shadow uppercase">TV</span>
              <span className="bg-otaku-gray text-xs font-semibold px-2 py-1 rounded shadow">24m</span>
            </div>
            <p className="text-base md:text-lg text-white/90 leading-relaxed">
              In a world of superhuman beings, Saitama is a unique hero who can defeat any opponent with a single punch. But being devastatingly powerful is boring—Saitama is constantly seeking an opponent who can challenge him and give his life meaning. Join Saitama and his cyborg disciple Genos as they take on monsters, villains, and the Hero Association in this action-packed, hilarious anime adventure.
            </p>
          </section>
        </div>
        {/* Sidebar Episode List */}
        <aside className="w-full md:w-96 max-w-full md:max-w-xs h-[420px] md:h-[calc(100vh-7rem)] overflow-y-auto bg-otaku-gray/70 rounded-xl shadow-lg p-4 flex flex-col gap-2">
          <h2 className="text-xl font-bold mb-4 text-otaku-purple">Episodes</h2>
          {episodes.map((episode, index) => (
            <div 
              key={episode.id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all mb-1
                ${currentEpisode === index ? 'bg-otaku-purple/30 ring-2 ring-otaku-purple' : 'hover:bg-otaku-purple/10'}`}
              onClick={() => setCurrentEpisode(index)}
            >
              <img 
                src={`https://img.youtube.com/vi/${episode.videoId}/mqdefault.jpg`}
                alt={episode.title}
                className="w-20 h-12 object-cover rounded-md border border-otaku-purple/40"
              />
              <div className="flex-1 min-w-0">
                <h3 className={`truncate font-medium ${currentEpisode === index ? 'text-otaku-purple' : ''}`}>{episode.title}</h3>
                <p className="text-xs text-gray-400">{episode.duration}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default WatchPage;

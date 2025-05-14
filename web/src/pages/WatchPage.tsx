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

  // Episode lists for each anime
  const onePunchManEpisodes: Episode[] = [
    { id: 1, title: 'One Punch Man | Episode 1 | The Strongest Man', videoId: 'BjzQITTh188', duration: '23:39' },
    { id: 2, title: 'One Punch Man | Episode 2 | The Lone Cyborg', videoId: 'K-JJm8ykSco', duration: '23:39' },
    { id: 3, title: 'One Punch Man | Episode 3 | The Obsessive Scientist', videoId: 'a2-vuLKoEak', duration: '23:39' },
    { id: 4, title: 'One Punch Man | Episode 4 | The Modern Ninja', videoId: '4Oh0T6o5-hs', duration: '23:39' },
    { id: 5, title: 'One Punch Man | Episode 5 | The Ultimate Master', videoId: 'EuOdDzt4H38', duration: '23:39' },
    { id: 6, title: 'One Punch Man | Episode 6 | The Terrifying City', videoId: 'dBPNIp0AcFI', duration: '23:39' },
    { id: 7, title: 'One Punch Man | Episode 7 | The Ultimate Disciple', videoId: 'g2miy-jdQKA', duration: '23:39' },
    { id: 8, title: 'One Punch Man | Episode 8 | The Deep Sea King', videoId: 'VnawF_we774', duration: '23:39' },
    { id: 9, title: 'One Punch Man | Episode 9 | Unyielding Justice', videoId: 'J-I0QKFexjE', duration: '23:39' },
    { id: 10, title: 'One Punch Man | Episode 10 | Unparalleled Peril', videoId: 'jsIvgxBO4mk', duration: '23:39' },
    { id: 11, title: 'One Punch Man | Episode 11 | The Dominator of the Universe', videoId: 'RWQCORZZLLw', duration: '23:39' },
    { id: 12, title: 'One Punch Man | Episode 12 | The Strongest Hero', videoId: '_J71sZlvcsI', duration: '23:39' }
  ];

  const tokyoRevengersEpisodes: Episode[] = [
    { id: 1, title: 'Tokyo Revengers | Episode 1', videoId: 'GRdOLXV2ctE', duration: '24:00' },
    { id: 2, title: 'Tokyo Revengers | Episode 2', videoId: 'JpY_xHjepos', duration: '24:00' },
    { id: 3, title: 'Tokyo Revengers | Episode 3', videoId: '2ckew7xZFow', duration: '24:00' },
    { id: 4, title: 'Tokyo Revengers | Episode 4', videoId: 'Ri4cBO9NV_0', duration: '24:00' },
    { id: 5, title: 'Tokyo Revengers | Episode 5', videoId: 'yEQHBODgkzg', duration: '24:00' },
    { id: 6, title: 'Tokyo Revengers | Episode 6', videoId: 'oQV3iKxSjQY', duration: '24:00' },
    { id: 7, title: 'Tokyo Revengers | Episode 7', videoId: 'qk2lPC1YTyo', duration: '24:00' },
    { id: 8, title: 'Tokyo Revengers | Episode 8', videoId: 'UGF7CvTuAQo', duration: '24:00' },
    { id: 9, title: 'Tokyo Revengers | Episode 9', videoId: 'Ar5EZkC7Dt0', duration: '24:00' },
    { id: 10, title: 'Tokyo Revengers | Episode 10', videoId: 'tfhmZrdoPqs', duration: '24:00' },
    { id: 11, title: 'Tokyo Revengers | Episode 11', videoId: 'QFVjaJYhbyM', duration: '24:00' },
    { id: 12, title: 'Tokyo Revengers | Episode 12', videoId: 'qgMMfbS0ukY', duration: '24:00' },
    { id: 13, title: 'Tokyo Revengers | Episode 13', videoId: 'tEf3Y3G1qSs', duration: '24:00' },
    { id: 14, title: 'Tokyo Revengers | Episode 14', videoId: 'fknCVVjs_UI', duration: '24:00' },
    { id: 15, title: 'Tokyo Revengers | Episode 15', videoId: 'lBJYLsf-BsU', duration: '24:00' },
    { id: 16, title: 'Tokyo Revengers | Episode 16', videoId: 'OzGTuW9myO4', duration: '24:00' },
    { id: 17, title: 'Tokyo Revengers | Episode 17', videoId: '6XtN_C288hw', duration: '24:00' },
    { id: 18, title: 'Tokyo Revengers | Episode 18', videoId: '6SHQH-AkBfg', duration: '24:00' },
    { id: 19, title: 'Tokyo Revengers | Episode 19', videoId: 'ig2HE1iSNaM', duration: '24:00' },
    { id: 20, title: 'Tokyo Revengers | Episode 20', videoId: 'HqeWyYXz8a8', duration: '24:00' },
    { id: 21, title: 'Tokyo Revengers | Episode 21', videoId: 'yRNepqENlrk', duration: '24:00' },
    { id: 22, title: 'Tokyo Revengers | Episode 22', videoId: 'JlhmaO--pbA', duration: '24:00' },
    { id: 23, title: 'Tokyo Revengers | Episode 23', videoId: 'DfrYMUrxd8g', duration: '24:00' },
    { id: 24, title: 'Tokyo Revengers | Episode 24', videoId: 'M5Lh5epv1lY', duration: '24:00' },
  ];

  // Anime info by id
  const animeInfo = {
    '0': {
      title: 'One Punch Man',
      description: 'Saitama is a hero who only became a hero for fun. After three years of special training, he becomes so strong that he’s practically invincible. Now, alongside Genos, his faithful cyborg disciple, Saitama is ready to begin his official duties as a professional hero.',
      episodes: onePunchManEpisodes,
      cover: 'https://m.media-amazon.com/images/M/MV5BNzMwOGQ5MWItNzE3My00ZDYyLTk4NzAtZWIyYWI0NTZhYzY0XkEyXkFqcGc@._V1_.jpg',
      totalEpisodes: onePunchManEpisodes.length,
      rating: 'PG-13',
    },
    '2': {
      title: 'Tokyo Revengers',
      description: 'Takemichi Hanagaki learns that his ex-girlfriend was murdered by the Tokyo Manji Gang. Suddenly, he finds himself time-leaping twelve years into the past, where he vows to save her and change the future.',
      episodes: tokyoRevengersEpisodes,
      cover: 'https://m.media-amazon.com/images/M/MV5BNGYzMjBhMTMtM2Q4YS00OGMyLTk2ZWItYTg3MDk2YWIxNmVkXkEyXkFqcGc@._V1_.jpg',
      totalEpisodes: tokyoRevengersEpisodes.length,
      rating: 'PG-13',
    }
  };

  // Pick anime or fallback
  const selectedAnime = animeInfo[animeId || ''] || animeInfo['0'];
  const episodes = selectedAnime.episodes;

  useEffect(() => {
    setCurrentEpisode(0);
  }, [animeId]);

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
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white leading-tight">{selectedAnime.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-pink-500 text-xs font-semibold px-2 py-1 rounded shadow uppercase">{selectedAnime.rating}</span>
              <span className="bg-otaku-purple text-xs font-semibold px-2 py-1 rounded shadow uppercase">HD</span>
              <span className="bg-green-600 text-xs font-semibold px-2 py-1 rounded shadow uppercase">CC</span>
              <span className="bg-otaku-gray text-xs font-semibold px-2 py-1 rounded shadow uppercase">TV</span>
              <span className="bg-otaku-gray text-xs font-semibold px-2 py-1 rounded shadow">{episodes[currentEpisode].duration}</span>
            </div>
            <p className="text-base md:text-lg text-white/90 leading-relaxed">
              {selectedAnime.description}
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

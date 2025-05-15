
import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import AnimeCard from '@/components/AnimeCard';
import Footer from '@/components/Footer';

const AnimeLibrary = () => {
  const [activeGenre, setActiveGenre] = useState('all');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Only show these genres for advanced filter
  const advancedGenres = ['All', 'Action', 'Romance', 'Comedy', 'Drama', 'Adventure'];
  
  const filters = [
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New Releases' },
    { id: 'crowdfunded', label: 'Crowdfunded' },
    { id: 'popular', label: 'Most Popular' },
  ];
  
  // Read watch progress from localStorage
  function getWatchProgress(animeId: number, totalEpisodes: number): number {
    try {
      const watched = JSON.parse(localStorage.getItem(`watched_${animeId}`) || '[]');
      if (Array.isArray(watched) && totalEpisodes > 0) {
        return Math.min(100, Math.round((watched.length / totalEpisodes) * 100));
      }
    } catch {}
    return 0;
  }

  const animeList = [
    {
      id: 0,
      title: "One Punch Man Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BNzMwOGQ5MWItNzE3My00ZDYyLTk4NzAtZWIyYWI0NTZhYzY0XkEyXkFqcGc@._V1_.jpg",
      rating: 4.7,
      genre: "Action",
      link: "/watch/0"
    },
    {
      id: 2,
      title: "Tokyo Revengers Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BNGYzMjBhMTMtM2Q4YS00OGMyLTk2ZWItYTg3MDk2YWIxNmVkXkEyXkFqcGc@._V1_.jpg",
      rating: 4.0,
      genre: "Action",
      link: "/watch/2"
    },
    {
      id: 3,
      title: "Mushoku Tensei: Jobless Reincarnation Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BYWQwNjk3MDItNDAxMS00YTQ2LWEyNDctMGYyZTE5OGQxNGQ1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 3.9,
      genre: "Adventure",
    },
    {
      id: 4,
      title: "Classroom of the Elite Season 1",
      image: "https://m.media-amazon.com/images/M/MV5BMDg3MGVhNWUtYTQ2NS00ZDdiLTg5MTMtZmM5MjUzN2IxN2I4XkEyXkFqcGc@._V1_.jpg",
      rating: 4.8,
      genre: "Drama",
    },
    {
      id: 5,
      title: "The God of High School",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/The_God_of_High_School_Volume_1_Cover.jpg/250px-The_God_of_High_School_Volume_1_Cover.jpg",
      rating: 3.7,
      genre: "Action",
    }
  ];

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filtered anime list by genre and search
  const filteredAnime = animeList.filter(a => {
    const matchesGenre = activeGenre === 'all' || a.genre.toLowerCase() === activeGenre.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-otaku-dark text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-cyber font-bold neon-text">Anime Library</h1>
          {/* Search box */}
          <div className="relative hidden md:block w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/50" />
            </div>
            <input
              type="text"
              placeholder="Search anime..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-otaku-dark border border-otaku-purple/30 text-white placeholder-white/50 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-otaku-purple/50"
            />
          </div>
        </div>

        {/* Advanced Filter Button */}
        <div className="flex gap-4 mb-6">
          <button
            className="bg-otaku-purple px-4 py-2 rounded-lg font-bold text-white hover:bg-otaku-blue transition"
            onClick={() => setShowAdvanced(v => !v)}
          >
            {showAdvanced ? 'Hide Advanced Filter' : 'Advanced Filter'}
          </button>
          {showAdvanced && (
            <div className="flex gap-2">
              {advancedGenres.map(genre => (
                <button
                  key={genre}
                  className={`px-3 py-1 rounded-full font-semibold border-2 transition-colors ${activeGenre === genre.toLowerCase() ? 'bg-otaku-blue text-white border-otaku-blue' : 'bg-otaku-dark text-white border-otaku-purple/40 hover:bg-otaku-purple/40'}`}
                  onClick={() => setActiveGenre(genre.toLowerCase())}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Search */}
        <div className="relative block md:hidden mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search anime..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-otaku-dark border border-otaku-purple/30 text-white placeholder-white/50 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-otaku-purple/50"
          />
        </div>
        
        {/* Anime cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          {filteredAnime.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
        
        {/* Load more */}
        <div className="mt-12 text-center">
          <button
            className="btn-outline-neon px-8 py-3 inline-flex items-center"
            onClick={() => {
              if (window && window['toast']) {
                window['toast']('More anime coming soon', {
                  duration: 3500,
                  style: {
                    background: 'linear-gradient(90deg, #3a2257 0%, #8a4fff 100%)',
                    color: '#fff',
                  },
                  className: 'neon-text',
                  icon: false,
                });
              }
            }}
          >
            Load More <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AnimeLibrary;

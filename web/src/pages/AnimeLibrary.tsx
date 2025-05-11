
import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnimeCard from '@/components/AnimeCard';
import Footer from '@/components/Footer';

const AnimeLibrary = () => {
  const [activeGenre, setActiveGenre] = useState('all');
  const [activeFilter, setActiveFilter] = useState('trending');
  
  const genres = [
    'All', 'Action', 'Romance', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Sci-Fi', 'Slice of Life', 'Sports'
  ];
  
  const filters = [
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New Releases' },
    { id: 'crowdfunded', label: 'Crowdfunded' },
    { id: 'popular', label: 'Most Popular' },
  ];
  
  const animeList = [
    {
      id: 1,
      title: "Demon Slayer",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
      rating: 4.8,
      genre: "Action",
      progress: 80,
    },
    {
      id: 2,
      title: "Attack on Titan",
      image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500",
      rating: 4.9,
      genre: "Drama",
      progress: 65,
    },
    {
      id: 3,
      title: "My Hero Academia",
      image: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=500",
      rating: 4.7,
      genre: "Adventure",
      progress: 45,
    },
    {
      id: 4,
      title: "Jujutsu Kaisen",
      image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=500",
      rating: 4.9,
      genre: "Action",
      progress: 100,
    },
    {
      id: 5,
      title: "Tokyo Revengers",
      image: "https://images.unsplash.com/photo-1516905041604-7935af78f572?q=80&w=500",
      rating: 4.5,
      genre: "Action",
    },
    {
      id: 6,
      title: "Spy x Family",
      image: "https://images.unsplash.com/photo-1612036782180-6f0822045d55?q=80&w=500",
      rating: 4.6,
      genre: "Comedy",
    },
    {
      id: 7,
      title: "Chainsaw Man",
      image: "https://images.unsplash.com/photo-1568059151110-949642101088?q=80&w=500",
      rating: 4.8,
      genre: "Action",
    },
    {
      id: 8,
      title: "One Piece",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500",
      rating: 4.9,
      genre: "Adventure",
      progress: 30,
    },
  ];

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
              className="bg-otaku-dark border border-otaku-purple/30 text-white placeholder-white/50 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-otaku-purple/50"
            />
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="relative block md:hidden mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search anime..."
            className="bg-otaku-dark border border-otaku-purple/30 text-white placeholder-white/50 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-otaku-purple/50"
          />
        </div>
        
        {/* Filters bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button className="flex items-center text-white/70 text-sm hover:text-white">
              <Filter className="h-4 w-4 mr-1" />
              Advanced Filter
            </button>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 mb-4 pb-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-otaku-purple text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 pb-2">
              {genres.map((genre, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    activeGenre === genre.toLowerCase()
                      ? 'bg-otaku-blue text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  onClick={() => setActiveGenre(genre.toLowerCase())}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {animeList.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
        
        {/* Load more */}
        <div className="mt-12 text-center">
          <button className="btn-outline-neon px-8 py-3 inline-flex items-center">
            Load More <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AnimeLibrary;

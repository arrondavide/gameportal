import React, { ReactNode, useState } from 'react';
import { Upload, Search, Play, Sparkles } from 'lucide-react';
import { Game } from '../types/game';
import { useGames, useGameLikes } from '../lib/supabase/hooks'

// Custom Card component instead of importing from shadcn/ui
const Card = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={`bg-gray-900 border border-white/10 rounded-xl ${className}`}>
    {children}
  </div>
);

const GameCard = ({ game }: { game: Game }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
      <img
        src={game.thumbnailUrl}
        alt={game.title}
        className="w-full h-64 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            🔥 {Math.floor(Math.random() * 1000)}
          </span>
          <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            ❤️ {Math.floor(Math.random() * 500)}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          {game.title}
          {game.author === "Verified Creator" && <Sparkles size={16} className="text-yellow-400" />}
        </h2>
        <p className="text-gray-200 text-sm mb-4 line-clamp-2">{game.description}</p>
        <div className="flex justify-between items-center">
          <a
            href={game.gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            <Play size={20} />
            Play Now
          </a>
          <span className="text-gray-300 text-sm">By {game.author}</span>
        </div>
      </div>
    </div>
  );
};

// Upload Form Component
const UploadForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameUrl: '',
    youtubeUrl: '',
    thumbnail: null as File | null
  });

  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

 const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
   const target = e.target as HTMLInputElement; // add this line
   const { name, value, files } = target;
   if (files) {
     setFormData(prev => ({ ...prev, [name]: files[0] }));
   } else {
     setFormData(prev => ({ ...prev, [name]: value }));
   }
 };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div>
        <label className="block text-purple-400 mb-2 text-sm font-medium">Game Title</label>
        <input
          type="text"
          name="title"
          placeholder="Drop that fire game title here 🔥"
          className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-purple-400 mb-2 text-sm font-medium">Description</label>
        <textarea
          name="description"
          placeholder="Tell us why your game is bussin fr fr 💯"
          className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-purple-400 mb-2 text-sm font-medium">Game URL</label>
        <input
          type="url"
          name="gameUrl"
          placeholder="Drop that game link here 🎮"
          className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-purple-400 mb-2 text-sm font-medium">YouTube Video URL</label>
        <input
          type="url"
          name="youtubeUrl"
          placeholder="Show off your gameplay 📺"
          className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-purple-400 mb-2 text-sm font-medium">Thumbnail</label>
        <div 
          className={`border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            dragActive ? 'border-purple-500 bg-purple-500/10' : ''
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const file = e.dataTransfer.files[0];
            setFormData(prev => ({ ...prev, thumbnail: file }));
          }}
        >
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            id="thumbnail-upload"
          />
          <label htmlFor="thumbnail-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-purple-500 mb-4" />
            <p className="text-purple-400">Drop your thumbnail here or click to upload</p>
            <p className="text-gray-400 text-sm mt-2">Supported: PNG, JPG, GIF (max 5MB)</p>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-400 hover:text-white transition-colors duration-300"
        >
          Nah, I'm Good
        </button>
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Drop This Heat 🔥
        </button>
      </div>
    </form>
  );
};

const GamePlatform = () => {
  const [games] = useState<Game[]>([
    {
      id: 1,
      title: "Pixel Legends",
      description: "fr fr this game bussin no cap 🔥 Join the most epic Web3 adventure that'll have you saying SHEEEESH!",
      gameUrl: "https://example.com/game",
      thumbnailUrl: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=example",
      author: "Verified Creator",
      createdAt: new Date()
    },
    {
      id: 2,
      title: "Crypto Chaos",
      description: "This game hits different 😮‍💨 Start your journey in the metaverse and become the main character!",
      gameUrl: "https://example.com/game2",
      thumbnailUrl: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=example2",
      author: "GameWizard",
      createdAt: new Date()
    },
    {
      id: 3,
      title: "NFT Battles",
      description: "Literally caught in 4K 📸 The most immersive Web3 battle royale experience!",
      gameUrl: "https://example.com/game3",
      thumbnailUrl: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=example3",
      author: "CryptoKing",
      createdAt: new Date()
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-500" size={24} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                GAMETHOTS
              </h1>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              <Upload size={20} />
              Drop Your Game
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-white mb-4">
          Explore the Most 
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            {" "}Bussin{" "}
          </span>
          Web3 Games!
        </h2>
        <p className="text-gray-300 text-xl mb-8">No cap, these games are straight fire 🔥</p>
        
        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search games (they're all certified bangers)..."
            className="w-full p-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12"
          />
          <Search className="absolute left-4 top-4 text-gray-400" />
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
         <div className="min-h-screen py-8 flex items-center justify-center">
           <Card className="p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
             <div className="sticky top-0 bg-gray-900 pb-4 mb-4 border-b border-white/10">
               <div className="flex items-center gap-2">
                 <Upload className="text-purple-500" size={24} />
                 <h2 className="text-2xl font-bold text-white">Drop Your Heat 🔥</h2>
               </div>
             </div>
             <UploadForm onClose={() => setShowUploadModal(false)} />
           </Card>
         </div>
       </div>
      )}
    </div>
  );
};

export default GamePlatform;

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityFlipCard from "@/components/CommunityFlipCard";
import { Community } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample community data
  const communities: Community[] = [
    {
      id: 1,
      name: "Demon Slayer",
      image: "https://www.sheknows.com/wp-content/uploads/2024/03/how-to-watch-demon-slayer-season-4-FI.jpg",
      icon: "🔥",
      members: 12450,
      posts: 3240,
      theme: "green",
      description: "Join the Demon Slayer Corps! Discuss episodes, share fan theories, and connect with other fans of Tanjiro's journey.",
      categories: ["Action", "Fantasy", "Supernatural"],
      features: ["Weekly episode discussions", "Fan art contests", "Manga spoiler threads"],
      joinedDate: "March 2023",
      events: [
        { title: "Season 4 Watch Party", date: "June 15, 2025" },
        { title: "Cosplay Competition", date: "July 22, 2025" }
      ]
    },
    {
      id: 2,
      name: "Attack on Titan",
      image: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/12/eren-vs-colossal-titan-in-trost.jpg",
      icon: "⚔️",
      members: 18320,
      posts: 5120,
      theme: "blue",
      description: "Dedicate your hearts! The ultimate community for discussing all things Attack on Titan, from the anime to the manga's conclusion.",
      categories: ["Dark Fantasy", "Action", "Post-Apocalyptic"],
      features: ["Manga analysis", "Character deep dives", "Ending debates"],
      joinedDate: "January 2022",
      topContributor: "ErenYeager",
      events: [
        { title: "Final Season Retrospective", date: "May 30, 2025" }
      ]
    },
    {
      id: 3,
      name: "My Hero Academia",
      image: "https://d.newsweek.com/en/full/2613601/my-hero-academia-season-8.webp?w=1600&h=900&q=88&f=624ff73786216c987d4c6348140b7e16",
      icon: "👊",
      members: 10280,
      posts: 2870,
      theme: "yellow",
      description: "Go beyond, plus ultra! Join fellow heroes to discuss quirks, character development, and the latest episodes.",
      categories: ["Superheroes", "Action", "School"],
      features: ["Quirk analysis threads", "Power scaling debates", "Episode predictions"],
      joinedDate: "August 2023",
      events: [
        { title: "Hero Tournament Bracket", date: "August 5, 2025" },
        { title: "Quirk Creation Contest", date: "September 12, 2025" }
      ]
    },
    {
      id: 4,
      name: "Jujutsu Kaisen",
      image: "https://occ-0-8407-92.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABdPXLFPbfzuRS2NPsXd5HnKXhKTOhpQ8zbyCrN4IbkdEJ2l6BRGHR7eozAepiuVI-JRetwR3lD5Q26D7yfpdMrwjOBzid9bIKIFK.jpg?r=794",
      icon: "👹",
      members: 9870,
      posts: 2450,
      theme: "purple",
      description: "Dive into the world of curses and sorcery! Discuss Yuji Itadori's journey and the complex power systems of JJK.",
      categories: ["Supernatural", "Horror", "Action"],
      features: ["Cursed technique analysis", "Weekly chapter discussions", "Domain expansion theories"],
      joinedDate: "October 2022"
    }
  ];
  
  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-otaku-dark min-h-screen text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-cyber font-bold mb-4 neon-text">
            Anime Communities
          </h1>
          <p className="text-white/70 max-w-2xl">
            Join fan communities dedicated to your favorite anime series. Discuss episodes, 
            share fanart, theorize about upcoming plots, and connect with fellow fans.
          </p>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-black/30 p-4 rounded-xl">
          <input
            type="text"
            placeholder="Search communities by name or category..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Communities Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCommunities.map(community => (
            <CommunityFlipCard key={community.id} community={community} />
          ))}
        </div>
      </div>
      
      {/* About Communities Section - Updated for Solana integration */}
      <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-cyber font-bold mb-10 neon-text text-center">
            How Communities Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <Card className="bg-black/50 border border-otaku-purple/30 rounded-xl overflow-hidden hover:border-otaku-purple/60 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-cyber font-semibold mb-6 text-otaku-purple">Join & Participate</h3>
                <p className="text-white/80 mb-6">
                  Joining a community gives you access to exclusive discussions, content, and events.
                </p>
                <ul className="space-y-2 list-disc pl-5 text-white/70">
                  <li>Access to private threads and discussions</li>
                  <li>Participate in community polls and events</li>
                  <li>Earn reputation through quality contributions</li>
                  <li>Connect with other fans who share your interests</li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Card 2 - Updated for Solana */}
            <Card className="bg-black/50 border border-otaku-blue/30 rounded-xl overflow-hidden hover:border-otaku-blue/60 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-cyber font-semibold mb-6 text-otaku-blue">Earn & Collect</h3>
                <p className="text-white/80 mb-6">
                  Active community members earn rewards and unlock exclusive digital collectibles.
                </p>
                <ul className="space-y-2 list-disc pl-5 text-white/70">
                  <li>Earn SOL tokens through participation</li>
                  <li>Unlock exclusive community Solana NFTs</li>
                  <li>Gain special badges for your profile</li>
                  <li>Redeem Solana tokens for platform perks</li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Card 3 */}
            <Card className="bg-black/50 border border-otaku-pink/30 rounded-xl overflow-hidden hover:border-otaku-pink/60 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-cyber font-semibold mb-6 text-otaku-pink">Lead & Create</h3>
                <p className="text-white/80 mb-6">
                  Rise through the ranks to become a community leader with special privileges.
                </p>
                <ul className="space-y-2 list-disc pl-5 text-white/70">
                  <li>Create your own events and discussion threads</li>
                  <li>Moderate community content</li>
                  <li>Access early features and content</li>
                  <li>Shape the direction of your community</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* FAQ Collapsible Section - Updated for Solana */}
          <div className="bg-black/40 rounded-xl p-6 border border-otaku-purple/20">
            <h3 className="text-2xl font-cyber font-semibold mb-6 text-center">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <Collapsible className="border border-white/10 rounded-lg overflow-hidden">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left font-medium hover:bg-white/5">
                  <span>How do I create my own community?</span>
                  <span className="text-xl">+</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 bg-black/20 border-t border-white/10">
                  <p className="text-white/70">
                    To create your own community, you need to have at least 0.5 SOL in your wallet and be an active 
                    member for 30 days. Once eligible, you can access the community creation tool from your 
                    profile dashboard and follow the guided setup process.
                  </p>
                </CollapsibleContent>
              </Collapsible>
              
              <Collapsible className="border border-white/10 rounded-lg overflow-hidden">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left font-medium hover:bg-white/5">
                  <span>What are the benefits of being a community leader?</span>
                  <span className="text-xl">+</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 bg-black/20 border-t border-white/10">
                  <p className="text-white/70">
                    Community leaders receive special badges, higher SOL token rewards for contributions, 
                    moderation tools, early access to new platform features, and the ability to create 
                    official community events and announcements.
                  </p>
                </CollapsibleContent>
              </Collapsible>
              
              <Collapsible className="border border-white/10 rounded-lg overflow-hidden">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left font-medium hover:bg-white/5">
                  <span>How are Solana tokens earned and what can I do with them?</span>
                  <span className="text-xl">+</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 bg-black/20 border-t border-white/10">
                  <p className="text-white/70">
                    Solana tokens are earned through active participation - creating quality posts, receiving 
                    upvotes, winning community contests, and regular engagement. Tokens can be used to 
                    unlock exclusive content, purchase digital collectibles, customize your profile, 
                    or even create your own community.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <button className="btn-neon flex items-center">
              <span className="mr-2">Start Your Own Community</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Communities;

import { useParams } from "react-router-dom";

const CommunityPage = () => {
  const { id } = useParams();

  // Mock data for demonstration
  const COMMUNITY = {
    id: 1,
    name: "Demon Slayer",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
    members: 12450,
    posts: 3240,
    description: "Join the Demon Slayer Corps! Discuss episodes, share theories, and connect with other fans of Tanjiro's journey.",
    features: ["Episode discussions", "Fan art contests", "Manga spoiler threads"],
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-64">
        <img
          src={COMMUNITY.banner}
          alt={COMMUNITY.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        <h1 className="absolute bottom-4 left-4 text-4xl font-cyber font-bold text-white">
          {COMMUNITY.name}
        </h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        <p className="text-white/80 mb-6">{COMMUNITY.description}</p>
        <h2 className="text-2xl font-cyber font-bold mb-4">Features</h2>
        <ul className="list-disc pl-5 space-y-2 text-white/70">
          {COMMUNITY.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommunityPage;
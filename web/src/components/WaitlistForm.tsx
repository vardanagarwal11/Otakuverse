import { useState } from "react";
import { Button } from "@/components/ui/button";

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/waitlist", { // Updated URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="Enter your email for waitlist"
        className="px-4 py-2 rounded-lg border border-otaku-purple bg-black/60 text-white font-cyber focus:outline-none focus:ring-2 focus:ring-otaku-purple min-w-[250px]"
      />
      <Button type="submit" className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber min-w-[140px]" disabled={loading}>
        {loading ? "Joining..." : "Join Waitlist"}
      </Button>
      {success && <span className="text-green-400 font-cyber ml-4">Joined!</span>}
      {error && <span className="text-red-400 font-cyber ml-4">{error}</span>}
      <div className="mt-4 text-center text-white">
        Be the first to access our exclusive creator tools, community features, and NFT drops. Sign up now and get priority access when we launch!
      </div>
    </form>
  );
};

export default WaitlistForm;

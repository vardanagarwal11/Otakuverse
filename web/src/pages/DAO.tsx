import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import { createProposal, voteOnProposal, finalizeProposal } from "@/utils/programUtils";

interface Proposal {
  id: number;
  title: string;
  description: string;
  creator: string;
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  createdAt: Date;
  userVoted?: boolean;
  userVote?: boolean;
}

const DAO = () => {
  const navigate = useNavigate();
  const { wallet, publicKey, connected } = useWallet();
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: "Add Naruto NFT Collection",
      description: "Proposal to add a new Naruto-themed NFT collection to the marketplace.",
      creator: "5XnY...wAJb",
      status: "active",
      votesFor: 24,
      votesAgainst: 5,
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    },
    {
      id: 2,
      title: "Community Event: Anime Watch Party",
      description: "Organize a virtual watch party for the latest anime releases with exclusive rewards for participants.",
      creator: "7ZpQ...mNkR",
      status: "passed",
      votesFor: 42,
      votesAgainst: 3,
      createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
    },
    {
      id: 3,
      title: "Implement Staking Rewards",
      description: "Implement a staking reward system for NFT holders to earn OtakuTokens based on the rarity and duration of staking.",
      creator: "3RtF...pQxZ",
      status: "rejected",
      votesFor: 15,
      votesAgainst: 30,
      createdAt: new Date(Date.now() - 86400000 * 14), // 14 days ago
    },
  ]);

  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert("Please connect your wallet to create a proposal");
      return;
    }

    if (!newProposal.title || !newProposal.description) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProposal(newProposal.title, newProposal.description, wallet);
      
      // Add to local state (in a real app, you'd fetch from blockchain)
      const newId = Math.max(...proposals.map(p => p.id)) + 1;
      setProposals([
        {
          id: newId,
          title: newProposal.title,
          description: newProposal.description,
          creator: publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4),
          status: "active",
          votesFor: 0,
          votesAgainst: 0,
          createdAt: new Date(),
        },
        ...proposals,
      ]);
      
      setNewProposal({ title: "", description: "" });
      setShowNewProposalForm(false);
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert(`Failed to create proposal: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet to vote");
      return;
    }

    setIsVoting(true);
    try {
      await voteOnProposal(proposalId, support, wallet);
      
      // Update local state (in a real app, you'd fetch from blockchain)
      setProposals(proposals.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: support ? p.votesFor + 1 : p.votesFor,
            votesAgainst: !support ? p.votesAgainst + 1 : p.votesAgainst,
            userVoted: true,
            userVote: support,
          };
        }
        return p;
      }));
    } catch (error) {
      console.error("Error voting on proposal:", error);
      alert(`Failed to vote: ${error.message || error}`);
    } finally {
      setIsVoting(false);
    }
  };

  const handleFinalize = async (proposalId: number) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet to finalize");
      return;
    }

    try {
      await finalizeProposal(proposalId, wallet);
      
      // Update local state (in a real app, you'd fetch from blockchain)
      setProposals(proposals.map(p => {
        if (p.id === proposalId) {
          const passed = p.votesFor > p.votesAgainst;
          return {
            ...p,
            status: passed ? "passed" : "rejected",
          };
        }
        return p;
      }));
    } catch (error) {
      console.error("Error finalizing proposal:", error);
      alert(`Failed to finalize: ${error.message || error}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500">Active</Badge>;
      case "passed":
        return <Badge className="bg-green-500">Passed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18142b] to-[#2c225a]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">OtakuVerse DAO</h1>
          <Button 
            onClick={() => setShowNewProposalForm(!showNewProposalForm)}
            className="bg-[#6c47ff] hover:bg-[#7c5aff]"
          >
            {showNewProposalForm ? "Cancel" : "Create Proposal"}
          </Button>
        </div>

        {showNewProposalForm && (
          <Card className="mb-8 bg-white/10 backdrop-blur-lg border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Create New Proposal</CardTitle>
              <CardDescription className="text-white/70">
                Submit your proposal to the OtakuVerse community for voting.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateProposal}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Title</label>
                  <Input
                    placeholder="Enter proposal title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    className="bg-white/20 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Description</label>
                  <Textarea
                    placeholder="Describe your proposal in detail"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    className="bg-white/20 border-white/10 text-white min-h-[120px]"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-[#6c47ff] hover:bg-[#7c5aff]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{proposal.title}</CardTitle>
                    <CardDescription className="text-white/70">
                      Proposed by {proposal.creator} on {formatDate(proposal.createdAt)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{proposal.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span className="text-white">{proposal.votesFor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown className="w-4 h-4 text-red-400" />
                      <span className="text-white">{proposal.votesAgainst}</span>
                    </div>
                  </div>
                  
                  {proposal.userVoted && (
                    <div className="flex items-center space-x-1">
                      {proposal.userVote ? (
                        <><ThumbsUp className="w-4 h-4 text-green-400" /><span className="text-white/70 text-sm">You voted For</span></>
                      ) : (
                        <><ThumbsDown className="w-4 h-4 text-red-400" /><span className="text-white/70 text-sm">You voted Against</span></>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              
              {proposal.status === "active" && (
                <CardFooter className="flex flex-col space-y-4">
                  <div className="flex space-x-4 w-full">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                      onClick={() => handleVote(proposal.id, true)}
                      disabled={isVoting || proposal.userVoted}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" /> Vote For
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
                      onClick={() => handleVote(proposal.id, false)}
                      disabled={isVoting || proposal.userVoted}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" /> Vote Against
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#6c47ff] hover:bg-[#7c5aff]" 
                    onClick={() => handleFinalize(proposal.id)}
                  >
                    Finalize Proposal
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DAO;
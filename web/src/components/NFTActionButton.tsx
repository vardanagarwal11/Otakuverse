import { useState } from "react";
import useWallet from "@/hooks/useWallet";
import { stakeNft, purchaseNft, unstakeNft } from "@/utils/programUtils";

interface NFTActionButtonProps {
  nft: {
    id: string;
    type: string;
    isStaked?: boolean;
  };
}

function NFTActionButton({ nft }: NFTActionButtonProps) {
  const { wallet, publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet!");
      return;
    }
    setLoading(true);
    try {
      if (nft.type === "paid") {
        await purchaseNft(nft.id, wallet);
        alert("NFT purchased successfully!");
      } else if (nft.isStaked) {
        await unstakeNft(nft.id, wallet);
        alert("NFT unstaked successfully!");
      } else {
        await stakeNft(nft.id, wallet);
        alert("NFT staked successfully!");
      }
    } catch (e) {
      console.error("Transaction error:", e);
      alert("Blockchain action failed: " + (e.message || e));
    }
    setLoading(false);
  };

  return (
    <button
      className="bg-otaku-blue/80 hover:bg-otaku-blue-sky text-white text-sm py-2 px-3 rounded font-cyber"
      onClick={handleAction}
      disabled={!connected || loading}
    >
      {loading
        ? "Processing..."
        : nft.type === "paid"
        ? "Purchase"
        : nft.isStaked
        ? "Unstake"
        : "Stake"}
    </button>
  );
}

export default NFTActionButton;

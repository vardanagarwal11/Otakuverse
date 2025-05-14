import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletIcon, ClipboardIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nft } = location.state || {};
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");

  // Simulate wallet address (replace with actual wallet integration)
  const walletAddress = nft?.walletAddress || "5XnY...wAJb";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18142b] to-[#2c225a] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="flex flex-col items-center mb-6">
            <span className="px-4 py-2 bg-[#ede7fe] rounded-full text-[#6c47ff] font-semibold text-sm flex items-center gap-2">
              <span>{walletAddress}</span>
              <ClipboardIcon className="w-4 h-4 cursor-pointer" onClick={() => navigator.clipboard.writeText(walletAddress)} />
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Send Payment</h2>
          <label className="block text-white/80 mb-2 font-semibold">Amount (SOL)</label>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#6c47ff] font-bold">&#36;</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="flex-1 p-2 rounded bg-white/20 text-white outline-none border border-white/10 focus:border-[#6c47ff]"
              placeholder="0.00"
            />
          </div>
          <label className="block text-white/80 mb-2 font-semibold">Memo (Optional)</label>
          <input
            type="text"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            className="w-full p-2 rounded bg-white/20 text-white outline-none border border-white/10 focus:border-[#6c47ff] mb-4"
            placeholder="Add a note"
          />
          <div className="bg-gradient-to-r from-[#6c47ff] to-[#a084fa] rounded-xl p-4 flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-white/80">Total Amount</div>
              <div className="text-lg font-bold text-white">{amount.toFixed(2)} SOL</div>
            </div>
            <WalletIcon className="w-7 h-7 text-white/80" />
          </div>
          <Button className="w-full bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-lg py-2 rounded-xl font-semibold disabled:opacity-60" disabled={amount <= 0}>
            Send Payment
          </Button>
          <div className="text-xs text-center text-white/60 mt-4">
            Secure transaction powered by Solana blockchain technology
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SignInButton } from "@clerk/clerk-react";

const Auth = () => (
  <div className="min-h-screen bg-otaku-dark text-white flex flex-col items-center justify-center">
    <h2 className="text-3xl font-cyber font-bold neon-text mb-8 text-center">
      Welcome to <span className="text-otaku-blue">Otakuverse</span>
    </h2>
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      <SignInButton mode="modal" />
      <WalletMultiButton className="bg-otaku-purple hover:bg-otaku-purple-vivid text-white font-cyber w-full" />
    </div>
  </div>
);

export default Auth;
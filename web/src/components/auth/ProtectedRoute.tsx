import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useWallet } from '@solana/wallet-adapter-react';
import LoadingSpinner from '../LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWallet?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireWallet = false 
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { connected } = useWallet();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireWallet && !connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-cyber text-white">Wallet Required</h2>
        <p className="text-gray-400">Please connect your wallet to access this page.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-otaku-purple text-white rounded-md hover:bg-otaku-purple-vivid transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
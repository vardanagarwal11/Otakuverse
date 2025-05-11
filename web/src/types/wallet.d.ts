
// Type definitions for wallet interactions

interface PhantomProvider {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
}

interface BackpackProvider {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      phantom?: {
        solana: PhantomProvider;
      };
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
    };
    backpack?: BackpackProvider;
  }
}

export {};

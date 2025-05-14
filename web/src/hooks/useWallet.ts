import { useState } from "react";

// Simulated wallet hook (replace with real wallet logic as needed)
export default function useWallet() {
  // Replace this with actual wallet connection logic
  const [connected, setConnected] = useState(false);
  // Simulate wallet address
  const address = connected ? "5XnY...wAJb" : null;

  // Simulate connect/disconnect
  const connect = () => setConnected(true);
  const disconnect = () => setConnected(false);

  return { connected, address, connect, disconnect };
}

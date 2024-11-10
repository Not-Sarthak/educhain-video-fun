"use client";

import { useWallet } from '../providers/wallet-context';

export const useProtectedAction = () => {
  const { isConnected, connectWallet } = useWallet();

  const withWallet = async (action: () => Promise<void>) => {
    if (!isConnected) {
      await connectWallet();
    }
    await action();
  };

  return { withWallet };
}; 
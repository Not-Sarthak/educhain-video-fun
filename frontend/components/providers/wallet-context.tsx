"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => Promise<void>;
  provider: ethers.providers.Web3Provider | null;
  chainId: string | null;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  account: null,
  connectWallet: async () => {},
  provider: null,
  chainId: null,
  error: null,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setError(null);

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [],
      });

      console.log('Connected accounts:', accounts);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get the provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get the network
      const network = await provider.getNetwork();
      console.log('Connected to network:', network);

      // Get the signer
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log('Connected address:', address);

      // Update state
      setIsConnected(true);
      setAccount(address);
      setProvider(provider);
      setChainId(network.chainId.toString());

      // Add event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setIsConnected(false);
      setAccount(null);
      setProvider(null);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    console.log('Accounts changed:', accounts);
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
  };

  const handleChainChanged = (newChainId: string) => {
    console.log('Chain changed:', newChainId);
    setChainId(newChainId);
    window.location.reload();
  };

  // Cleanup event listeners
  useEffect(() => {
    if (window.ethereum) {
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      account, 
      connectWallet, 
      provider,
      chainId,
      error
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
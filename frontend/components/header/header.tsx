"use client";

import React from "react";
import { Cat } from "lucide-react";
import { useWallet } from "../providers/wallet-context";
import LoginButton from "../buttons/login-button";

export function Header() {
  const { isConnected, account, connectWallet } = useWallet();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <nav className="flex space-x-8">
            <a href="/" className="text-primary font-medium">
              Tutors
            </a>
            <a href="/profile" className="text-secondary">
              Your profile
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <span className="text-sm text-gray-600">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <LoginButton />
                <button
                  onClick={() => connectWallet()}
                  className="bg-primary text-white px-4 py-2 rounded-smooth hover:bg-primary/90 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            )}
            <Cat className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}

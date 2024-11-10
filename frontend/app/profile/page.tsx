"use client";

import React, { useState, useEffect } from 'react';
import { User, Book, Clock, Star, Wallet, X } from 'lucide-react';
import { useWallet } from '../../components/providers/wallet-context';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Session {
  id: number;
  date: string;
  tutorName: string;
  duration: number;
  status: string;
  amount: string;
}

export default function ProfilePage() {
  const { account, provider } = useWallet();
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [earnings, setEarnings] = useState('0');
  const [isTutor, setIsTutor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (account) {
      loadProfileData();
    }
  }, [account]);

  const loadProfileData = async () => {
    setSessions([
      {
        id: 1,
        date: '2024-02-20',
        tutorName: 'John Doe',
        duration: 2,
        status: 'Completed',
        amount: '0.05'
      },
      // Add more mock sessions if needed
    ]);
  };

  const handleBecomeTutor = async () => {
    if (!provider || !account) return;

    try {
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0xef7E2F8F5c7c8ae0Bfd1A7D55628616175BC25FB",
        value: ethers.utils.parseEther("0.01") 
      });
      await tx.wait();

      setIsTutor(true);
      setIsModalOpen(false);
      toast.success("You are now a tutor!");
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
      console.error("Error becoming a tutor:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-smooth p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dark">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
            </h1>
            <p className="text-secondary mt-1">
              {isTutor ? 'Tutor' : 'Student'} · Joined 2024
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-auto px-4 py-2 bg-primary text-white rounded-smooth hover:bg-primary/90 transition-colors"
          >
            {isTutor ? 'Edit Profile' : 'Become a Tutor'}
          </button>
        </div>

        {/* Modal for Tutor Registration */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-semibold text-center mb-4">Become a Tutor</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (EDU)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-smooth border-gray-200 p-2"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full rounded-smooth border-gray-200 p-2 h-24 resize-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                  </div>
                  <motion.button
                    onClick={handleBecomeTutor}
                    className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-primary/90 transition"
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit and Pay 0.01 $EDU
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-8">
        <div className="p-4 bg-gray-50 rounded-smooth">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Book className="w-4 h-4" />
            <span>Total Sessions</span>
          </div>
          <p className="text-2xl font-semibold text-dark">12</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-smooth">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Clock className="w-4 h-4" />
            <span>Hours Learned</span>
          </div>
          <p className="text-2xl font-semibold text-dark">24</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-smooth">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Star className="w-4 h-4" />
            <span>Average Rating</span>
          </div>
          <p className="text-2xl font-semibold text-dark">4.8</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-smooth">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Wallet className="w-4 h-4" />
            <span>{isTutor ? 'Earnings' : 'Spent'}</span>
          </div>
          <p className="text-2xl font-semibold text-dark">{earnings} EDU</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-smooth overflow-hidden mt-8">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'sessions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              Sessions
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'earnings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {isTutor ? 'Earnings' : 'Payments'}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-smooth">
                  <div>
                    <h3 className="font-medium text-dark">{session.tutorName}</h3>
                    <p className="text-sm text-secondary">
                      {session.date} · {session.duration} hours
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-dark">{session.amount} EDU</p>
                    <span className={`text-sm ${
                      session.status === 'Completed' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-smooth">
                <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                {/* Add transaction history here */}
              </div>
              
              {isTutor && (
                <div className="bg-gray-50 p-6 rounded-smooth">
                  <h3 className="text-lg font-semibold mb-4">Payout Settings</h3>
                  {/* Add payout settings here */}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-smooth">
                <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-smooth border-gray-200 p-2"
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full rounded-smooth border-gray-200 p-2 h-24 resize-none"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-smooth hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

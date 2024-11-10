"use client";

import React, { useState, useEffect } from 'react';
import { User, Book, Clock, Star, Wallet } from 'lucide-react';
import { useWallet } from '../../components/providers/wallet-context';

interface Session {
  id: number;
  date: string;
  tutorName: string;
  duration: number;
  status: string;
  amount: string;
}

export default function ProfilePage() {
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [earnings, setEarnings] = useState('0');
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    if (account) {
      loadProfileData();
    }
  }, [account]);

  const loadProfileData = async () => {
    // Load user data from contract
    // This is a placeholder for now
    setSessions([
      {
        id: 1,
        date: '2024-02-20',
        tutorName: 'John Doe',
        duration: 2,
        status: 'Completed',
        amount: '0.05'
      },
      // Add more mock sessions
    ]);
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
          <button className="ml-auto px-4 py-2 bg-primary text-white rounded-smooth hover:bg-primary/90 transition-colors">
            {isTutor ? 'Edit Profile' : 'Become a Tutor'}
          </button>
        </div>

        {/* Stats */}
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
            <p className="text-2xl font-semibold text-dark">{earnings} ETH</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-smooth overflow-hidden">
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

        {/* Tab Content */}
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
                    <p className="font-medium text-dark">{session.amount} ETH</p>
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

              {isTutor && (
                <div className="bg-gray-50 p-6 rounded-smooth">
                  <h3 className="text-lg font-semibold mb-4">Tutor Settings</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        className="w-full rounded-smooth border-gray-200 p-2"
                        placeholder="0.05"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-smooth hover:bg-primary/90 transition-colors"
                    >
                      Update Settings
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../providers/wallet-context';
import { log } from 'console';

interface BookingModalProps {
  tutor: {
    address: string;
    name: string;
    ratePerHour: string;
  };
  onClose: () => void;
}

export function BookingModal({ tutor, onClose }: BookingModalProps) {
  const [duration, setDuration] = useState(1); // hours
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useWallet();

  const totalAmount = parseFloat(ethers.utils.formatEther(tutor.ratePerHour)) * duration;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Hey")
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-smooth p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Book a Session with {tutor.name}</h2>
        
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hours)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-smooth border-gray-200 p-2"
            >
              {[1, 2, 3, 4].map(hours => (
                <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-smooth">
            <div className="flex justify-between mb-2">
              <span>Rate per hour</span>
              <span>{ethers.utils.formatEther(tutor.ratePerHour)} ETH</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>{totalAmount} ETH</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-smooth hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-smooth hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
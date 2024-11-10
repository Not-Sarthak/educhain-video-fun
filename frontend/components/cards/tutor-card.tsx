import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';
import { useProtectedAction } from '../hooks/use-protected-action';
import { useWallet } from '../providers/wallet-context';

interface TutorCardProps {
  name: string;
  role: string;
  experience: string;
  price: number;
  imageUrl: string;
  rating?: number;
}

export function TutorCard({ name, role, experience, price, imageUrl, rating }: TutorCardProps) {
  const { withWallet } = useProtectedAction();
  const { account } = useWallet();

  const handleBookMeeting = async () => {
    await withWallet(async () => {
      // Your booking logic here
      console.log('Booking meeting with wallet:', account);
    });
  };

  return (
    <div className="bg-white rounded-smooth p-4 space-y-4 shadow-sm hover:shadow-md transition-all group relative">
      <div className="aspect-video w-full bg-gray-100 rounded-smooth overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={`${name}'s workspace`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={handleBookMeeting}
            className="bg-primary text-white px-6 py-3 rounded-smooth flex items-center gap-2 hover:bg-primary/90 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform"
          >
            <Calendar className="w-5 h-5" />
            Book a meeting
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
            alt={name}
            className="w-8 h-8 rounded-full bg-orange-50"
          />
          <div>
            <h3 className="font-medium text-dark tracking-tight">{name}</h3>
            <p className="text-sm text-secondary">
              {role} · {experience}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-dark">
          <span className="text-lg font-semibold">${price}</span>
          <span className="text-sm text-secondary">per hour</span>
        </div>
      </div>
    </div>
  );
}
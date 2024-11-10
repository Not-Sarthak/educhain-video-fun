import React, { useState } from 'react';
import { DollarSign, Calendar, X } from 'lucide-react';
import { useProtectedAction } from '../hooks/use-protected-action';
import { useWallet } from '../providers/wallet-context';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../utils/contract';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

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
  const { account, provider } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleBookMeeting = () => {
    setIsModalOpen(true);
  };

  const handleBuyTime = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot before proceeding.");
      return;
    }

    await withWallet(async () => {
      if (!provider) return;

      const signer = provider.getSigner();
      const recipientAddress = "0xB54b4CEA3AF35fEbA9650c03E5d2287c840383fD";

      try {
        const tx = await signer.sendTransaction({
          to: recipientAddress,
          value: ethers.utils.parseEther("0.001"),
        });
        await tx.wait();
        toast.success(`Payment successful for slot ${selectedSlot}`);
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Error processing payment. Please try again.");
        console.error('Error processing payment:', error);
      }
    });
  };

  return (
    <div className="bg-white rounded-smooth p-4 space-y-4 shadow-sm hover:shadow-md transition-all group relative">
      <div className="aspect-video w-full bg-gray-100 rounded-smooth overflow-hidden relative">
        <Image 
          src={imageUrl} 
          alt={`${name}'s workspace`}
          className="w-full h-full object-cover"
          width={100}
          height={20}
        />
        <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={handleBookMeeting}
            className="bg-primary text-white px-6 py-3 rounded-smooth flex items-center gap-2 hover:bg-primary/90 transform translate-y-4 group-hover:translate-y-0 transition-transform"
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

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-md shadow-lg w-96 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-center mb-4">Choose a Time Slot</h2>
              <div className="space-y-2 mb-6">
                {["10:00 - 11:00 AM", "2:00 - 3:00 PM", "5:00 - 6:00 PM"].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-2 rounded-md transition ${
                      selectedSlot === slot ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <motion.button
                onClick={handleBuyTime}
                className="bg-primary text-white w-full py-2 rounded-md font-semibold hover:bg-primary/90 transition"
                whileTap={{ scale: 0.95 }}
              >
                Buy Time (0.001 $EDU)
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

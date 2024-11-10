import React from 'react';

interface TrendingTutorProps {
  name: string;
  role: string;
  experience: string;
  rating: number;
}

export function TrendingTutor({ name, role, experience, rating }: TrendingTutorProps) {
  return (
    <div className="p-4 bg-white rounded-smooth hover:bg-gray-100 transition-colors">
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
    </div>
  );
} 
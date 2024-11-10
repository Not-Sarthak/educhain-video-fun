import React, { useState, useEffect } from 'react';
import { RatingModal } from '../modals/rating';

interface Session {
  id: number;
  tutor: {
    name: string;
    address: string;
  };
  date: string;
  duration: number;
  status: string;
  rating?: number;
}

export function CompletedSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    loadCompletedSessions();
  }, []);

  const loadCompletedSessions = async () => {
    // Load completed sessions from contract
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Completed Sessions</h2>
      
      <div className="space-y-3">
        {sessions.map(session => (
          <div 
            key={session.id}
            className="bg-white p-4 rounded-smooth flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{session.tutor.name}</h3>
              <p className="text-sm text-gray-500">
                {session.date} · {session.duration} hours
              </p>
            </div>
            
            {!session.rating && (
              <button
                onClick={() => setSelectedSession(session)}
                className="px-4 py-2 bg-primary text-white rounded-smooth hover:bg-primary/90 transition-colors"
              >
                Rate Session
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedSession && (
        <RatingModal
          sessionId={selectedSession.id}
          tutorName={selectedSession.tutor.name}
          onClose={() => setSelectedSession(null)}
          onRatingSubmit={loadCompletedSessions}
        />
      )}
    </div>
  );
} 
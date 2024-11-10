import React from 'react';

interface TopicTagProps {
  topic: string;
  role: string;
  experience: string;
}

export function TopicTag({ topic, role, experience }: TopicTagProps) {
  return (
    <div className="p-4 bg-white rounded-smooth hover:bg-gray-100 transition-colors">
      <h3 className="font-medium text-dark tracking-tight">{topic}</h3>
      <p className="text-sm text-secondary">
        {role} · {experience}
      </p>
    </div>
  );
}
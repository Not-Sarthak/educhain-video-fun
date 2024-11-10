"use client";

import { ChevronRight } from 'lucide-react';
import { TutorCard } from '../components/cards/tutor-card';
import { TrendingTutor } from '../components/cards/trending-tutor';
import { TopicTag } from '../components/buttons/topic-tag';

export default function App() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark tracking-tight">Software Developers</h2>
              <button className="text-secondary flex items-center gap-1 hover:text-primary transition-colors">
                See all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <TutorCard
                  key={i}
                  name="Jesse Pollak"
                  role="SDE - 1"
                  experience="10 years exp"
                  price={24}
                  imageUrl="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800"
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark tracking-tight">Designers</h2>
              <button className="text-secondary flex items-center gap-1 hover:text-primary transition-colors">
                See all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <TutorCard
                  key={i}
                  name="Sarthak Shah"
                  role="SDE - 1"
                  experience="10 years exp"
                  price={24}
                  imageUrl="https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80&w=800"
                />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-dark tracking-tight mb-4">Trending tutors</h2>
            <div className="space-y-3">
                <TrendingTutor
                  key={1}
                  name="Ankit Raj"
                  role="SDE - 1"
                  experience="3 years exp"
                  rating={5}
                />
                <TrendingTutor
                  key={2}
                  name="Sarthak Shah"
                  role="SDE - 3"
                  experience="10 years exp"
                  rating={5}
                />
                <TrendingTutor
                  key={3}
                  name="Siddharth Sharma"
                  role="SDE - 1"
                  experience="4 years exp"
                  rating={5}
                />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark tracking-tight mb-4">Hot topics right now</h2>
            <div className="space-y-3">
              <TopicTag topic="#SoftwareDevelopment" role="SDE - 1" experience="10 years exp" />
              <TopicTag topic="#DiversityHiring" role="SDE - 1" experience="10 years exp" />
              <TopicTag topic="#WebDevelopment" role="SDE - 1" experience="10 years exp" />
            </div>
          </section>

          <button className="w-full py-3 px-4 bg-primary text-white font-medium rounded-smooth hover:bg-primary/90 transition-colors">
            Start your own tutorship
          </button>
        </div>
      </div>
    </main>
  );
} 
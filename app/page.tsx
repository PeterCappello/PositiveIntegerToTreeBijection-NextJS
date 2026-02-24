'use client';

import { useState } from 'react';
import Viewer from '@/components/Viewer';
import GameContainer from '@/components/GameContainer';

type Tab = 'viewer' | 'game';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('viewer');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Positive Integer to Tree Bijection
          </h1>
          <p className="text-lg text-gray-600">
            Explore the mathematical mapping between positive integers and rooted trees
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-6 py-3 font-semibold transition-colors border-b-4 ${
              activeTab === 'viewer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Viewer (Explorer)
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-6 py-3 font-semibold transition-colors border-b-4 ${
              activeTab === 'game'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Game (PrimeTime)
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeTab === 'viewer' && <Viewer />}
          {activeTab === 'game' && <GameContainer />}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Based on the mathematical bijection by Peter Cappello (1988) and independently
            rediscovered by Göbel (1980) and Abe (1994)
          </p>
        </div>
      </div>
    </main>
  );
}

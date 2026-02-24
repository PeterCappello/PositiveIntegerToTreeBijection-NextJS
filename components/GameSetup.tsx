'use client';

import React, { useState } from 'react';

interface GameSetupProps {
  onStartGame: (level: number, rounds: number, viewMode: string) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [level, setLevel] = useState(3);
  const [rounds, setRounds] = useState(10);
  const [viewMode, setViewMode] = useState('conventional');

  const handleStart = () => {
    onStartGame(level, rounds, viewMode);
  };

  return (
    <div className="p-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          PrimeTime Game Setup
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Configure your game settings and start playing!
        </p>

        {/* Difficulty Level */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Difficulty Level
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-2xl font-bold text-blue-600 w-12 text-center">
              {level}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Level {level}: Range 1-{Math.pow(2, level)}
          </p>
        </div>

        {/* Number of Rounds */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Rounds
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* View Mode */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tree View Mode
          </label>
          <div className="space-y-2">
            {[
              { value: 'conventional', label: 'Conventional' },
              { value: 'circular', label: 'Circular' },
              { value: 'planetary', label: 'Planetary' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="viewMode"
                  value={option.value}
                  checked={viewMode === option.value}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          Start Game
        </button>

        {/* Game Instructions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• View the tree visualization</li>
            <li>• Guess the positive integer</li>
            <li>• Submit your answer</li>
            <li>• Score +1 for correct, -1 for incorrect</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

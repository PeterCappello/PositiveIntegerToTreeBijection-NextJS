'use client';

import React, { useState, useEffect } from 'react';
import { Game, PrimeUtils, Tree } from '@/core';
import GameSetup from './GameSetup';
import GamePlay from './GamePlay';

export default function GameContainer() {
  const [game, setGame] = useState<Game | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize primes on mount
  useEffect(() => {
    try {
      PrimeUtils.initialize(1000);
      Tree.initialize(1000);
      setLoading(false);
    } catch (err) {
      console.error('Initialization error:', err);
      setLoading(false);
    }
  }, []);

  const handleStartGame = (level: number, rounds: number, viewMode: string) => {
    const newGame = new Game(level, rounds);
    setGame(newGame);
    setGameStarted(true);
  };

  const handleGameEnd = () => {
    setGameStarted(false);
    setGame(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  if (!gameStarted || !game) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  return <GamePlay game={game} onGameEnd={handleGameEnd} />;
}

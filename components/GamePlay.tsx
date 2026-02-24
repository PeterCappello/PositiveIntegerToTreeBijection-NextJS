'use client';

import React, { useState, useEffect } from 'react';
import { Game } from '@/core';
import TreeCanvas from './TreeCanvas';

interface GamePlayProps {
  game: Game;
  onGameEnd: () => void;
}

export default function GamePlay({ game, onGameEnd }: GamePlayProps) {
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [viewMode, setViewMode] = useState<'conventional' | 'circular' | 'planetary'>(
    'conventional'
  );
  const [gameState, setGameState] = useState(game.getStats());

  const handleSubmitAnswer = () => {
    if (answer.trim() === '') return;

    const userAnswer = parseInt(answer, 10);
    if (isNaN(userAnswer)) return;

    const correct = game.submitAnswer(userAnswer);
    setIsCorrect(correct);
    setAnswered(true);
  };

  const handleNextRound = () => {
    if (game.isGameOver()) {
      onGameEnd();
    } else {
      game.nextRound();
      setGameState(game.getStats());
      setAnswer('');
      setAnswered(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !answered) {
      handleSubmitAnswer();
    }
  };

  useEffect(() => {
    setGameState(game.getStats());
  }, [game]);

  const currentInteger = game.getCurrentInteger();
  const [min, max] = game.getLevelRange();

  return (
    <div className="p-8">
      {/* Score Header */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{gameState.level}</div>
          <div className="text-xs text-gray-600">Level</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{gameState.currentRound}</div>
          <div className="text-xs text-gray-600">Round</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{gameState.totalRounds}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.max(0, gameState.score)}
          </div>
          <div className="text-xs text-gray-600">Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Controls */}
        <div className="space-y-6">
          {/* View Mode */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">View Mode</h3>
            <div className="space-y-2">
              {(['conventional', 'circular', 'planetary'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Range Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Valid Range</h3>
            <p className="text-sm text-gray-600">
              The answer is between <strong>{min}</strong> and <strong>{max}</strong>
            </p>
          </div>

          {/* Hints */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Tree Info</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Height: {game.getCurrentTree().getHeight()}</div>
              <div>Width: {game.getCurrentTree().getWidth()}</div>
              <div>Nodes: {game.getCurrentTree().getNodeCount()}</div>
            </div>
          </div>
        </div>

        {/* Center - Tree Visualization */}
        <div className="flex flex-col items-center justify-center">
          <TreeCanvas integer={currentInteger} viewMode={viewMode} />
        </div>

        {/* Right - Answer Section */}
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What is this integer?
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={answered}
                placeholder="Enter your answer"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={answered || answer.trim() === ''}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>

          {answered && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-100 border border-green-400 text-green-800'
                  : 'bg-red-100 border border-red-400 text-red-800'
              }`}
            >
              <div className="font-bold text-lg">
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </div>
              <div className="text-sm mt-1">
                The answer was <strong>{currentInteger}</strong>
              </div>
            </div>
          )}

          {answered && (
            <button
              onClick={handleNextRound}
              className={`px-6 py-3 font-bold rounded-lg text-white transition-colors ${
                gameState.isGameOver
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {gameState.isGameOver ? 'View Results' : 'Next Round'}
            </button>
          )}

          {gameState.isGameOver && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-2">
              <h3 className="font-bold text-lg text-purple-900">Game Over!</h3>
              <div className="text-sm text-purple-800">
                Final Score: <strong>{Math.max(0, gameState.score)}</strong>
              </div>
              <button
                onClick={onGameEnd}
                className="w-full mt-3 px-4 py-2 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition-colors"
              >
                Back to Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

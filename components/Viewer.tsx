'use client';

import React, { useState, useEffect } from 'react';
import { Tree, PrimeUtils } from '@/core';
import TreeCanvas from './TreeCanvas';

type ViewMode = 'conventional' | 'circular' | 'planetary';

export default function Viewer() {
  const [integer, setInteger] = useState<number>(12);
  const [viewMode, setViewMode] = useState<ViewMode>('conventional');
  const [tree, setTree] = useState<Tree | null>(null);
  const [error, setError] = useState<string>('');
  const [primeRank, setPrimeRank] = useState<string>('');
  const [primeRankResult, setPrimeRankResult] = useState<string>('');
  const [rankPrime, setRankPrime] = useState<string>('');
  const [rankPrimeResult, setRankPrimeResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Initialize primes on mount
  useEffect(() => {
    try {
      PrimeUtils.initialize(1000);
      Tree.initialize(1000);
    } catch (err) {
      console.error('Initialization error:', err);
    }
  }, []);

  // Update tree when integer changes
  useEffect(() => {
    const updateTree = async () => {
      setLoading(true);
      try {
        if (integer < 1) {
          setError('Integer must be positive');
          setTree(null);
          return;
        }

        const newTree = Tree.fromInteger(integer);
        setTree(newTree);
        setError('');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        setTree(null);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(updateTree, 300);
    return () => clearTimeout(timeoutId);
  }, [integer]);

  const handleIntegerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setInteger(value);
    }
  };

  const handlePrimeRankSubmit = () => {
    try {
      const prime = parseInt(primeRank, 10);
      if (isNaN(prime)) {
        setPrimeRankResult('Please enter a valid number');
        return;
      }

      const rank = PrimeUtils.getRank(prime);
      if (rank === -1) {
        setPrimeRankResult(`${prime} is not a prime number`);
      } else {
        setPrimeRankResult(`Prime ${prime} has rank ${rank}`);
      }
    } catch (err) {
      setPrimeRankResult('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleRankPrimeSubmit = () => {
    try {
      const rank = parseInt(rankPrime, 10);
      if (isNaN(rank) || rank < 1) {
        setRankPrimeResult('Please enter a valid positive rank');
        return;
      }

      const prime = PrimeUtils.getPrime(rank);
      setRankPrimeResult(`Rank ${rank} corresponds to prime ${prime}`);
    } catch (err) {
      setRankPrimeResult('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const downloadImage = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `tree-${integer}.png`;
      link.click();
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left sidebar - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Integer Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Integer
            </label>
            <input
              type="number"
              value={integer}
              onChange={handleIntegerChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View Mode Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              View Mode
            </label>
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

          {/* Download Button */}
          {tree && !error && (
            <button
              onClick={downloadImage}
              className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download Image
            </button>
          )}

          {/* Tree Stats */}
          {tree && !error && (
            <div className="space-y-2 text-sm border-t pt-4">
              <div>
                <strong>Height:</strong> {tree.getHeight()}
              </div>
              <div>
                <strong>Width:</strong> {tree.getWidth()}
              </div>
              <div>
                <strong>Nodes:</strong> {tree.getNodeCount()}
              </div>
            </div>
          )}

          {/* Prime/Rank Lookups */}
          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prime to Rank
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={primeRank}
                  onChange={(e) => setPrimeRank(e.target.value)}
                  placeholder="Enter prime"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handlePrimeRankSubmit}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Look up
                </button>
              </div>
              {primeRankResult && (
                <p className="text-sm text-gray-600 mt-1">{primeRankResult}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rank to Prime
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={rankPrime}
                  onChange={(e) => setRankPrime(e.target.value)}
                  placeholder="Enter rank"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleRankPrimeSubmit}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Look up
                </button>
              </div>
              {rankPrimeResult && (
                <p className="text-sm text-gray-600 mt-1">{rankPrimeResult}</p>
              )}
            </div>
          </div>
        </div>

        {/* Center - Tree Visualization */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="spinner" />
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          {tree && !error && (
            <TreeCanvas integer={integer} viewMode={viewMode} />
          )}
        </div>

        {/* Right - Tree Structure */}
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
          <h3 className="font-semibold text-gray-900 mb-3">Tree Structure</h3>
          {tree && !error ? (
            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono">
              {tree.getStructureLines().join('\n')}
            </pre>
          ) : (
            <p className="text-sm text-gray-600">Waiting for input...</p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';

function nthPrime(n: number): number {
  let count = 0;
  let candidate = 1;
  while (count < n) {
    candidate++;
    let isPrime = true;
    for (let i = 2; i * i <= candidate; i++) {
      if (candidate % i === 0) { isPrime = false; break; }
    }
    if (isPrime) count++;
  }
  return candidate;
}
import { Tree, TreeRenderer, type NodePosition, type Edge } from '@/core';

type ViewMode = 'conventional' | 'circular' | 'planetary';

interface TreeCanvasProps {
  integer: number;
  viewMode: ViewMode;
  width?: number;
  height?: number;
  onError?: (error: string) => void;
}

/**
 * Canvas component for rendering trees using HTML5 Canvas
 */
export default function TreeCanvas({
  integer,
  viewMode,
  width = 800,
  height = 800,
  onError,
}: TreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRefRef = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Generate tree and layout
      const tree = Tree.fromInteger(integer);
      const renderer = new TreeRenderer(tree, {
        width,
        height,
        nodeRadius: 8,
        padding: 24,
      });

      let nodes: NodePosition[] = [];
      let edges: Edge[] = [];

      const render = () => {
        // Get layout based on view mode
        switch (viewMode) {
          case 'conventional':
            ({ nodes, edges } = renderer.generateConventionalLayout());
            break;
          case 'circular':
            ({ nodes, edges } = renderer.generateCircularLayout());
            break;
          case 'planetary':
            ({ nodes, edges } = renderer.generatePlanetaryLayout(timeRef.current));
            break;
        }

        // Clear canvas
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);

        // Draw edges (not shown in planetary view)
        if (viewMode !== 'planetary') {
          context.strokeStyle = '#9ca3af';
          context.lineWidth = 2;
          for (const edge of edges) {
            context.beginPath();
            context.moveTo(edge.x1, edge.y1);
            context.lineTo(edge.x2, edge.y2);
            context.stroke();
          }
        }

        // Draw nodes
        for (const node of nodes) {
          // Draw node circle
          context.fillStyle = '#3b82f6';
          context.beginPath();
          context.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
          context.fill();

          // Draw node border
          context.strokeStyle = '#1e40af';
          context.lineWidth = 2;
          context.stroke();

          // Draw node number to the right of the node
          context.fillStyle = '#1e40af';
          context.font = 'bold 24px Arial';
          context.textAlign = 'left';
          context.textBaseline = 'middle';
          context.fillText(node.value.toString(), node.x + node.radius + 4, node.y);

          // Draw prime label to the left of non-root nodes
          if (node.level > 0) {
            context.textAlign = 'right';
            context.fillText(nthPrime(node.value).toString(), node.x - node.radius - 4, node.y);
          }
        }

        if (viewMode === 'planetary') {
          timeRef.current++;
          animationRefRef.current = requestAnimationFrame(render);
        }
      };

      render();

      return () => {
        if (animationRefRef.current) {
          cancelAnimationFrame(animationRefRef.current);
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      onError?.(message);
      console.error('TreeCanvas error:', error);
      return undefined;
    }
  }, [integer, viewMode, width, height, onError]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300 rounded-lg mx-auto shadow-md"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

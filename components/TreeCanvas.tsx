'use client';

import React, { useEffect, useRef } from 'react';
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

        // Draw edges
        context.strokeStyle = '#9ca3af';
        context.lineWidth = 2;
        for (const edge of edges) {
          context.beginPath();
          context.moveTo(edge.x1, edge.y1);
          context.lineTo(edge.x2, edge.y2);
          context.stroke();
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

          // Draw node number
          context.fillStyle = '#ffffff';
          context.font = 'bold 12px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(node.value.toString(), node.x, node.y);
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

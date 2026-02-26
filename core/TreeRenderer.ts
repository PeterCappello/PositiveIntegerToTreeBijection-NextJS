import { Tree } from './Tree';

/**
 * Position of a node in 2D space
 */
export interface NodePosition {
  id: string;
  x: number;
  y: number;
  value: number;
  radius: number;
  level: number;
}

/**
 * Edge connecting two nodes
 */
export interface Edge {
  parentId: string;
  childId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Layout parameters
 */
export interface LayoutParams {
  width: number;
  height: number;
  nodeRadius: number;
  padding: number;
}

/**
 * TreeRenderer handles all tree visualization layouts
 */
export class TreeRenderer {
  private tree: Tree;
  private params: LayoutParams;
  private nodeMap: Map<string, NodePosition> = new Map();
  private idCounter: number = 0;

  constructor(tree: Tree, params: LayoutParams) {
    this.tree = tree;
    this.params = params;
  }

  /**
   * Generate conventional hierarchical tree layout
   * Root at top, children below, sorted left to right
   */
  generateConventionalLayout(): { nodes: NodePosition[]; edges: Edge[] } {
    this.nodeMap.clear();
    this.idCounter = 0;

    const width = this.params.width;
    const height = this.params.height;
    const nodeRadius = this.params.nodeRadius;
    const padding = this.params.padding;

    const nodes: NodePosition[] = [];
    const edges: Edge[] = [];

    // Calculate tree dimensions
    const treeHeight = this.tree.getHeight();
    const treeWidth = this.tree.getWidth();

    // Vertical spacing
    const verticalSpacing = (height - 2 * padding) / (treeHeight || 1);

    // Recursively layout nodes
    const processNode = (
      node: Tree,
      x: number,
      y: number,
      subtreeWidth: number,
      depth: number
    ): string => {
      const id = `node-${this.idCounter++}`;

      const nodePos: NodePosition = {
        id,
        x,
        y,
        value: node.value,
        radius: nodeRadius,
        level: depth,
      };

      nodes.push(nodePos);
      this.nodeMap.set(id, nodePos);

      if (node.subtrees.length > 0) {
        // Calculate positions for children
        const childSpacing = subtreeWidth / node.subtrees.length;
        let childX = x - subtreeWidth / 2 + childSpacing / 2;

        for (const subtree of node.subtrees) {
          const childWidth = subtree.getWidth();
          const childScreenWidth =
            (childWidth / (treeWidth || 1)) * (width - 2 * padding);
          const childY = y + verticalSpacing;

          const childId = processNode(
            subtree,
            childX,
            childY,
            childScreenWidth,
            depth + 1
          );

          // Add edge
          const childNode = this.nodeMap.get(childId)!;
          edges.push({
            parentId: id,
            childId,
            x1: x,
            y1: y + nodeRadius,
            x2: childNode.x,
            y2: childNode.y - nodeRadius,
          });

          childX += childSpacing;
        }
      }

      return id;
    };

    const screenWidth = width - 2 * padding;
    processNode(this.tree, width / 2, padding, screenWidth, 0);

    return { nodes, edges };
  }

  /**
   * Generate circular tree layout
   * Nodes arranged in sectors around their parent
   */
  generateCircularLayout(): { nodes: NodePosition[]; edges: Edge[] } {
    this.nodeMap.clear();
    this.idCounter = 0;

    const width = this.params.width;
    const height = this.params.height;
    const nodeRadius = this.params.nodeRadius;
    const padding = this.params.padding;

    const nodes: NodePosition[] = [];
    const edges: Edge[] = [];

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - padding - nodeRadius;

    const processNode = (
      node: Tree,
      x: number,
      y: number,
      radius: number,
      parentId: string | null
    ): string => {
      const id = `node-${this.idCounter++}`;

      const nodePos: NodePosition = {
        id,
        x,
        y,
        value: node.value,
        radius: nodeRadius,
        level: 0,
      };

      nodes.push(nodePos);
      this.nodeMap.set(id, nodePos);

      if (parentId) {
        const parentNode = this.nodeMap.get(parentId)!;
        edges.push({
          parentId,
          childId: id,
          x1: parentNode.x,
          y1: parentNode.y,
          x2: x,
          y2: y,
        });
      }

      if (node.subtrees.length > 0) {
        const childRadius = radius * 0.6; // Smaller radius for children
        const angleStep = (2 * Math.PI) / node.subtrees.length;

        for (let i = 0; i < node.subtrees.length; i++) {
          const angle = i * angleStep;
          const childX = x + childRadius * Math.cos(angle);
          const childY = y + childRadius * Math.sin(angle);

          processNode(node.subtrees[i], childX, childY, childRadius, id);
        }
      }

      return id;
    };

    processNode(this.tree, centerX, centerY, maxRadius, null);

    return { nodes, edges };
  }

  /**
   * Generate planetary layout with orbital mechanics
   * Each node revolves around its immediate parent.
   * Orbit radius shrinks with depth; angular speed follows Kepler's third law.
   */
  generatePlanetaryLayout(timeStep: number = 0): {
    nodes: NodePosition[];
    edges: Edge[];
  } {
    this.nodeMap.clear();
    this.idCounter = 0;

    const width = this.params.width;
    const height = this.params.height;
    const nodeRadius = this.params.nodeRadius;

    const nodes: NodePosition[] = [];
    const edges: Edge[] = [];

    const centerX = width / 2;
    const centerY = height / 2;

    // Kepler constant: depth-1 nodes at orbitRadius=120 get angularSpeed=0.01 rad/frame
    const keplerC = 0.01 * Math.pow(120, 1.5);

    const processNode = (
      node: Tree,
      parentX: number,
      parentY: number,
      depth: number,
      parentId: string | null,
      siblingIndex: number,
      siblingCount: number
    ): string => {
      const id = `node-${this.idCounter++}`;

      let x = parentX;
      let y = parentY;

      if (depth > 0) {
        // Orbit radius decreases with depth so children stay near their parent
        const orbitRadius = 120 / depth;
        // Kepler's third law: inner orbits are faster
        const angularSpeed = keplerC / Math.pow(orbitRadius, 1.5);
        // Spread siblings evenly around the orbit, each with its own phase
        const baseAngle = (siblingIndex * 2 * Math.PI) / siblingCount;
        const angle = baseAngle + timeStep * angularSpeed;

        x = parentX + orbitRadius * Math.cos(angle);
        y = parentY + orbitRadius * Math.sin(angle);
      }

      const nodePos: NodePosition = {
        id,
        x,
        y,
        value: node.value,
        radius: Math.max(nodeRadius, Math.log(node.value + 1) * 2),
        level: depth,
      };

      nodes.push(nodePos);
      this.nodeMap.set(id, nodePos);

      if (parentId) {
        const parentNode = this.nodeMap.get(parentId)!;
        edges.push({
          parentId,
          childId: id,
          x1: parentNode.x,
          y1: parentNode.y,
          x2: x,
          y2: y,
        });
      }

      for (let i = 0; i < node.subtrees.length; i++) {
        // Pass the node's computed (x, y) so children orbit this node's current position
        processNode(node.subtrees[i], x, y, depth + 1, id, i, node.subtrees.length);
      }

      return id;
    };

    processNode(this.tree, centerX, centerY, 0, null, 0, 1);

    return { nodes, edges };
  }

  /**
   * Get node by ID
   */
  getNode(id: string): NodePosition | undefined {
    return this.nodeMap.get(id);
  }

  /**
   * Update tree for new layout generation
   */
  setTree(tree: Tree): void {
    this.tree = tree;
    this.nodeMap.clear();
    this.idCounter = 0;
  }
}

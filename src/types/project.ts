export type RiskLevel =
  | "low"
  | "medium"
  | "high";

// ----------------------------
// Raw task from Gemini
// ----------------------------

export interface ProjectNode {

  id: string;

  title: string;

  description: string;

  estimatedHours: number;

  riskLevel: RiskLevel;

  /**
   * Can this task
   * reasonably be moved
   * to Version 2?
   */
  canBeDeferred: boolean;

  dependencies: string[];
}

// ----------------------------
// Raw graph
// ----------------------------

export interface ProjectGraph {

  goal: string;

  nodes: ProjectNode[];
}

// ----------------------------
// After CPM
// ----------------------------

export interface AnalyzedProjectNode
  extends ProjectNode {

  earlyStart: number;

  earlyFinish: number;

  lateStart: number;

  lateFinish: number;

  slack: number;

  isCritical: boolean;
}

// ----------------------------
// Final analyzed graph
// ----------------------------

export interface AnalyzedProjectGraph {

  goal: string;

  nodes:
    AnalyzedProjectNode[];

  totalEstimatedHours: number;

  criticalPathHours: number;

  criticalPaths: string[][];

  bottleneckNodes:
    AnalyzedProjectNode[];

  isFeasible: boolean;
}

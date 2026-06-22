export type RiskLevel = "low" | "medium" | "high";

export interface ProjectNode {
  id: string;
  title: string;
  description: string;

  estimatedHours: number;

  riskLevel: RiskLevel;

  dependencies: string[];
}

export interface ProjectGraph {
  goal: string;

  totalEstimatedHours: number;

  nodes: ProjectNode[];
}
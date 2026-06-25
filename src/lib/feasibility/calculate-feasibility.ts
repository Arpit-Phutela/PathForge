import {
  analyzeGraph,
} from "@/lib/graph/cpm";

import {
  calculateCapacity,
} from "./calculate-capacity";

import type {
  ProjectGraph,
} from "@/types/project";

import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export interface FeasibilityReport {

  requiredHours: number;

  availableHours: number;

  deficitHours: number;

  isFeasible: boolean;
}

export function calculateFeasibility(
  graph: ProjectGraph,
  constraints: ProjectConstraints
): FeasibilityReport {

  const analyzed =
    analyzeGraph(
      graph
    );

  const capacity =
    calculateCapacity(
      constraints
    );

  const deficit =
    analyzed.totalEstimatedHours -
    capacity.availableHours;

  return {

    requiredHours:
      analyzed.totalEstimatedHours,

    availableHours:
      capacity.availableHours,

    deficitHours:
      Math.max(
        deficit,
        0
      ),

    isFeasible:
      deficit <= 0,
  };
}
import {
  analyzeGraph,
} from "@/lib/graph/cpm";

import {
  calculateRiskScores,
} from "@/lib/risk/risk-score";

import {
  generateMutations,
} from "@/lib/risk/generate-mutations";

import {
  evaluateMutations,
} from "@/lib/risk/evaluate-mutations";

import {
  selectBestMutation,
} from "@/lib/risk/select-best-mutation";

import type {
  ProjectGraph,
  AnalyzedProjectGraph,
} from "@/types/project";

export interface OptimizationResult {

  originalGraph:
    AnalyzedProjectGraph;

  optimizedGraph:
    AnalyzedProjectGraph;

  originalDuration:
    number;

  optimizedDuration:
    number;

  timeSaved:
    number;

  selectedStrategy:
    string;

  reasoning:
    string[];
}

export function optimizeGraph(
  graph: ProjectGraph
): OptimizationResult {

  const originalGraph =
    analyzeGraph(
      graph
    );

  const risks =
    calculateRiskScores(
      originalGraph
    );

  const mutations =
    generateMutations(
      graph,
      risks
    );

  const evaluations =
    evaluateMutations(
      graph,
      mutations
    );

  const decision =
    selectBestMutation(
      evaluations
    );

 if (!decision) {

  return {

    originalGraph,

    optimizedGraph:
      originalGraph,

    originalDuration:
      originalGraph
        .criticalPathHours,

    optimizedDuration:
      originalGraph
        .criticalPathHours,

    timeSaved: 0,

    selectedStrategy:
      "No worthwhile optimization found",

    reasoning: [
      "Generated mutations failed to improve project duration or reduce critical risk.",
    ],
  };
}

  const optimizedGraph =
    analyzeGraph(
      decision
        .chosenMutation
        .graph
    );

  return {

    originalGraph,

    optimizedGraph,

    originalDuration:
      originalGraph
        .criticalPathHours,

    optimizedDuration:
      optimizedGraph
        .criticalPathHours,

    timeSaved:
      originalGraph
        .criticalPathHours -
      optimizedGraph
        .criticalPathHours,

    selectedStrategy:
      decision
        .chosenMutation
        .title,

    reasoning:
      decision
        .reasoning,
  };
}
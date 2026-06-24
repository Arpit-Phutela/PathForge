import { analyzeGraph } from "./cpm";

import type {
  ProjectGraph,
  AnalyzedProjectGraph,
} from "@/types/project";

export interface WhatIfResult {
  originalGraph: AnalyzedProjectGraph;

  modifiedGraph: AnalyzedProjectGraph;

  durationDifference: number;
}

export function runWhatIfAnalysis(
  graph: ProjectGraph,
  nodeId: string,
  newDuration: number
): WhatIfResult {

  const clonedGraph: ProjectGraph =
    structuredClone(graph);

  const targetNode =
    clonedGraph.nodes.find(
      node => node.id === nodeId
    );

  if (!targetNode) {
    throw new Error(
      `Node '${nodeId}' not found.`
    );
  }

  targetNode.estimatedHours =
    newDuration;

  const originalGraph =
    analyzeGraph(graph);

  const modifiedGraph =
    analyzeGraph(clonedGraph);

  return {
    originalGraph,

    modifiedGraph,

    durationDifference:
      originalGraph.criticalPathHours -
      modifiedGraph.criticalPathHours,
  };
}
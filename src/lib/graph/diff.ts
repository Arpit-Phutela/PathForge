import type {
  AnalyzedProjectGraph,
} from "@/types/project";

export interface GraphDiff {
  addedCriticalTasks: string[];

  removedCriticalTasks: string[];

  durationDifference: number;
}

export function compareGraphs(
  originalGraph: AnalyzedProjectGraph,
  modifiedGraph: AnalyzedProjectGraph
): GraphDiff {

  const originalCritical =
    new Set(
      originalGraph.bottleneckNodes.map(
        node => node.id
      )
    );

  const modifiedCritical =
    new Set(
      modifiedGraph.bottleneckNodes.map(
        node => node.id
      )
    );

  const addedCriticalTasks =
    [...modifiedCritical].filter(
      id =>
        !originalCritical.has(id)
    );

  const removedCriticalTasks =
    [...originalCritical].filter(
      id =>
        !modifiedCritical.has(id)
    );

  return {
    addedCriticalTasks,

    removedCriticalTasks,

    durationDifference:
      originalGraph.criticalPathHours -
      modifiedGraph.criticalPathHours,
  };
}

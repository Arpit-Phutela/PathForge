import { analyzeGraph } from "@/lib/graph/cpm";

import type {
  ProjectGraph,
  AnalyzedProjectGraph,
} from "@/types/project";

import type {
  TaskProgress,
} from "./progress";

export function calculateRemainingProject(
  graph: ProjectGraph,
  progress: TaskProgress[]
): AnalyzedProjectGraph {

  const completedIds =
    new Set(
      progress
        .filter(
          task => task.completed
        )
        .map(
          task => task.nodeId
        )
    );

  const remainingNodes =
    graph.nodes
      .filter(
        node =>
          !completedIds.has(
            node.id
          )
      )
      .map(node => ({
        ...node,

        dependencies:
          node.dependencies.filter(
            dependency =>
              !completedIds.has(
                dependency
              )
          ),
      }));

  const remainingGraph: ProjectGraph = {
    goal: graph.goal,

    nodes: remainingNodes,
  };

  return analyzeGraph(
    remainingGraph
  );
}

import type {
  AnalyzedProjectGraph,
} from "@/types/project";

import type {
  TaskProgress,
} from "@/lib/progress/progress";

export function findActionableTasks(
  graph: AnalyzedProjectGraph,
  progress: TaskProgress[]
): string[] {

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

  return graph.nodes
    .filter(node => {

      // Skip already completed tasks
      if (
        completedIds.has(
          node.id
        )
      ) {
        return false;
      }

      // Every dependency must be completed
      return node.dependencies.every(
        dependency =>
          completedIds.has(
            dependency
          )
      );
    })
    .map(
      node => node.id
    );
}
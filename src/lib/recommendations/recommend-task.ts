import type {
  AnalyzedProjectGraph,
  AnalyzedProjectNode,
} from "@/types/project";

import type {
  TaskProgress,
} from "@/lib/progress/progress";

import { findActionableTasks }
  from "./actionable-tasks";

export interface TaskRecommendation {
  taskId: string;

  score: number;

  reasons: string[];
}

export function recommendTask(
  graph: AnalyzedProjectGraph,
  progress: TaskProgress[]
): TaskRecommendation | null {

  const actionableTasks =
    findActionableTasks(
      graph,
      progress
    );

  if (
    actionableTasks.length === 0
  ) {
    return null;
  }

  const childrenMap =
    new Map<string, string[]>();

  for (const node of graph.nodes) {
    childrenMap.set(
      node.id,
      []
    );
  }

  for (const node of graph.nodes) {
    for (const dependency of node.dependencies) {
      childrenMap
        .get(dependency)
        ?.push(node.id);
    }
  }

  const criticalNodeIds =
    new Set(
      graph.bottleneckNodes.map(
        node => node.id
      )
    );

  let bestTask:
    AnalyzedProjectNode | null =
      null;

  let bestScore = -1;

  let bestReasons: string[] =
    [];

  for (const node of graph.nodes) {

    if (
      !actionableTasks.includes(
        node.id
      )
    ) {
      continue;
    }

    let score = 0;

    const reasons: string[] =
      [];

    // ---------------------
    // Critical Path Score
    // ---------------------

    if (
      criticalNodeIds.has(
        node.id
      )
    ) {
      score += 100;

      reasons.push(
        "Critical path task."
      );
    }

    // ---------------------
    // Risk Score
    // ---------------------

    if (
      node.riskLevel === "high"
    ) {
      score += 50;

      reasons.push(
        "High risk task."
      );
    } else if (
      node.riskLevel ===
      "medium"
    ) {
      score += 25;

      reasons.push(
        "Medium risk task."
      );
    } else {
      score += 10;

      reasons.push(
        "Low risk task."
      );
    }

    // ---------------------
    // Duration Score
    // ---------------------

    if (
      node.estimatedHours > 20
    ) {
      score += 20;

      reasons.push(
        "Long duration task."
      );
    } else if (
      node.estimatedHours > 10
    ) {
      score += 10;

      reasons.push(
        "Moderate duration task."
      );
    }

    // ---------------------
    // Unlock Score
    // ---------------------

    const unlockedTasks =
      childrenMap.get(
        node.id
      )?.length ?? 0;

    if (
      unlockedTasks > 0
    ) {
      score +=
        unlockedTasks * 10;

      reasons.push(
        `Unlocks ${unlockedTasks} downstream task(s).`
      );
    }

    if (score > bestScore) {
      bestScore = score;

      bestTask = node;

      bestReasons =
        reasons;
    }
  }

  if (!bestTask) {
    return null;
  }

  return {
    taskId: bestTask.id,

    score: bestScore,

    reasons: bestReasons,
  };
}
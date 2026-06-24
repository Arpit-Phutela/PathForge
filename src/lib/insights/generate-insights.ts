import type {
  AnalyzedProjectGraph,
  AnalyzedProjectNode,
} from "@/types/project";

export interface ProjectInsights {
  projectSummary: string;

  criticalTaskCount: number;

  highestRiskTask: string | null;

  deadlineRisk:
    | "low"
    | "medium"
    | "high";

  recommendedNextTasks: string[];
}

export function generateInsights(
  graph: AnalyzedProjectGraph
): ProjectInsights {

  const criticalTaskCount =
    graph.bottleneckNodes.length;

  const riskScores = graph.nodes.map(
    (
      node: AnalyzedProjectNode
    ) => {

      let score = 0;

      // Critical task weight
      if (node.isCritical) {
        score += 3;
      }

      // Gemini risk weight
      switch (node.riskLevel) {
        case "high":
          score += 3;
          break;

        case "medium":
          score += 2;
          break;

        case "low":
          score += 1;
          break;
      }

      // Long duration weight
      if (
        node.estimatedHours > 40
      ) {
        score += 2;
      } else if (
        node.estimatedHours > 20
      ) {
        score += 1;
      }

      return {
        node,
        score,
      };
    }
  );

  riskScores.sort(
    (
      a,
      b
    ) =>
      b.score - a.score
  );

  const highestRiskTask =
    riskScores.length > 0
      ? riskScores[0].node.title
      : null;

  const highRiskCriticalTasks =
    graph.nodes.filter(
      (
        node: AnalyzedProjectNode
      ) =>
        node.isCritical &&
        node.riskLevel === "high"
    ).length;

  let deadlineRisk:
    | "low"
    | "medium"
    | "high" = "low";

  if (
    highRiskCriticalTasks >= 3
  ) {
    deadlineRisk = "high";
  } else if (
    highRiskCriticalTasks >= 1
  ) {
    deadlineRisk = "medium";
  }

  const recommendedNextTasks =
    graph.nodes
      .filter(
        (
          node: AnalyzedProjectNode
        ) =>
          node.dependencies.length === 0
      )
      .sort(
        (
          a,
          b
        ) => {

          const aCritical =
            a.isCritical ? 1 : 0;

          const bCritical =
            b.isCritical ? 1 : 0;

          return (
            bCritical -
            aCritical
          );
        }
      )
      .slice(0, 3)
      .map(
        (
          node: AnalyzedProjectNode
        ) => node.title
      );

  return {
    projectSummary:
      `Project contains ${graph.nodes.length} tasks with ${criticalTaskCount} critical tasks.`,

    criticalTaskCount,

    highestRiskTask,

    deadlineRisk,

    recommendedNextTasks,
  };
}
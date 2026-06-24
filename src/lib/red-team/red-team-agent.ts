import type {
  AnalyzedProjectGraph,
} from "@/types/project";

export type IssueSeverity =
  | "low"
  | "medium"
  | "high";

export interface PlanIssue {
  severity: IssueSeverity;

  title: string;

  description: string;
}

export interface RedTeamReport {
  issues: PlanIssue[];
}

export function runRedTeamReview(
  graph: AnalyzedProjectGraph
): RedTeamReport {

  const issues: PlanIssue[] = [];

  // ---------------------
  // Critical Path Risk
  // ---------------------

  for (const node of graph.bottleneckNodes) {

    if (node.riskLevel === "high") {
      issues.push({
        severity: "high",

        title:
          "High-risk critical path task",

        description:
          `${node.title} is both high-risk and on the critical path.`,
      });
    }
  }

  // ---------------------
  // Large Tasks
  // ---------------------

  for (const node of graph.nodes) {

    if (node.estimatedHours > 40) {
      issues.push({
        severity: "medium",

        title:
          "Very large task detected",

        description:
          `${node.title} exceeds 40 hours and may require decomposition.`,
      });
    }
  }

  // ---------------------
  // Deployment Buffer
  // ---------------------

  const deployTask =
    graph.nodes.find(
      node =>
        node.title
          .toLowerCase()
          .includes("deploy")
    );

  if (
    deployTask &&
    deployTask.slack === 0
  ) {
    issues.push({
      severity: "medium",

      title:
        "No deployment buffer",

      description:
        "Deployment lies directly on the critical path.",
    });
  }

  return {
    issues,
  };
}
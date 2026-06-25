import type {
  AnalyzedProjectGraph,
} from "@/types/project";

export interface NodeRisk {
  nodeId: string;

  title: string;

  score: number;

  reasons: string[];
}

function countDescendants(
  nodeId: string,
  childrenMap: Map<string, string[]>
): number {

  const visited =
    new Set<string>();

  function dfs(
    currentId: string
  ) {

    const children =
      childrenMap.get(
        currentId
      ) ?? [];

    for (const childId of children) {

      if (
        visited.has(childId)
      ) {
        continue;
      }

      visited.add(
        childId
      );

      dfs(childId);
    }
  }

  dfs(nodeId);

  return visited.size;
}

export function calculateRiskScores(
  graph: AnalyzedProjectGraph
): NodeRisk[] {

  const childrenMap =
    new Map<string, string[]>();

  for (const node of graph.nodes) {
    childrenMap.set(
      node.id,
      []
    );
  }

  for (const node of graph.nodes) {
    for (
      const dependency
      of node.dependencies
    ) {
      childrenMap
        .get(dependency)
        ?.push(node.id);
    }
  }

  const results: NodeRisk[] =
    [];

  for (const node of graph.nodes) {

    let score = 0;

    const reasons: string[] =
      [];

    // ------------------
    // Critical Path
    // ------------------

    if (node.isCritical) {

      score += 40;

      reasons.push(
        "Critical path task."
      );
    }

    // ------------------
    // Duration Risk
    // ------------------

    if (
      node.estimatedHours > 40
    ) {

      score += 30;

      reasons.push(
        "Duration exceeds 40 hours."
      );

    } else if (
      node.estimatedHours > 20
    ) {

      score += 20;

      reasons.push(
        "Duration exceeds 20 hours."
      );

    } else if (
      node.estimatedHours > 10
    ) {

      score += 10;

      reasons.push(
        "Moderate duration task."
      );
    }

    // ------------------
    // Fan-In Risk
    // ------------------

    const fanIn =
      node.dependencies.length;

    if (fanIn >= 4) {

      score += 20;

      reasons.push(
        `High coordination complexity (${fanIn} dependencies).`
      );

    } else if (
      fanIn >= 2
    ) {

      score += 10;

      reasons.push(
        `Depends on ${fanIn} tasks.`
      );
    }

    // ------------------
    // Fan-Out Risk
    // ------------------

    const fanOut =
      childrenMap.get(
        node.id
      )?.length ?? 0;

    if (fanOut >= 4) {

      score += 20;

      reasons.push(
        `Blocks ${fanOut} downstream tasks.`
      );

    } else if (
      fanOut >= 2
    ) {

      score += 10;

      reasons.push(
        `Influences ${fanOut} downstream tasks.`
      );
    }

    // ------------------
    // Descendant Impact
    // ------------------

    const descendants =
      countDescendants(
        node.id,
        childrenMap
      );

    if (
      descendants >= 4
    ) {

      score += 20;

      reasons.push(
        `Impacts ${descendants} total downstream tasks.`
      );

    } else if (
      descendants >= 2
    ) {

      score += 10;

      reasons.push(
        `Impacts ${descendants} downstream tasks.`
      );
    }

    // ------------------
    // Gemini Risk
    // ------------------

    if (
      node.riskLevel ===
      "high"
    ) {

      score += 10;

      reasons.push(
        "Gemini marked as high risk."
      );

    } else if (
      node.riskLevel ===
      "medium"
    ) {

      score += 5;

      reasons.push(
        "Gemini marked as medium risk."
      );
    }

    results.push({
      nodeId: node.id,

      title: node.title,

      score,

      reasons,
    });
  }

  return results.sort(
    (a, b) =>
      b.score - a.score
  );
}
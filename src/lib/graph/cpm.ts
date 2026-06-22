import type {
  ProjectGraph,
  ProjectNode,
  AnalyzedProjectGraph,
  AnalyzedProjectNode,
} from "@/types/project";

export function analyzeGraph(
  graph: ProjectGraph
): AnalyzedProjectGraph {

  const nodeMap = new Map<
    string,
    ProjectNode
  >();

  const childrenMap = new Map<
    string,
    string[]
  >();

  const parentMap = new Map<
    string,
    string[]
  >();

  for (const node of graph.nodes) {
    nodeMap.set(node.id, node);

    childrenMap.set(node.id, []);

    parentMap.set(node.id, []);
  }

  for (const node of graph.nodes) {
    for (const dependency of node.dependencies) {
      childrenMap
        .get(dependency)
        ?.push(node.id);

      parentMap
        .get(node.id)
        ?.push(dependency);
    }
  }

  // -------------------------
  // In-Degree Calculation
  // -------------------------

  const inDegree = new Map<
    string,
    number
  >();

  for (const node of graph.nodes) {
    inDegree.set(
      node.id,
      node.dependencies.length
    );
  }

  // -------------------------
  // Queue Initialization
  // -------------------------

  const queue: string[] = [];

  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  // -------------------------
  // Kahn's Algorithm
  // -------------------------

  const topologicalOrder: string[] = [];

  while (queue.length > 0) {
    const currentNodeId =
      queue.shift()!;

    topologicalOrder.push(
      currentNodeId
    );

    const children =
      childrenMap.get(
        currentNodeId
      ) ?? [];

    for (const childId of children) {
      const currentDegree =
        inDegree.get(childId)!;

      inDegree.set(
        childId,
        currentDegree - 1
      );

      if (
        inDegree.get(childId) === 0
      ) {
        queue.push(childId);
      }
    }
  }

  // -------------------------
  // Safety Check
  // -------------------------

  if (
    topologicalOrder.length !==
    graph.nodes.length
  ) {
    throw new Error(
      "Topological sort failed. Graph may contain a cycle."
    );
  }

  // -------------------------
// Forward Pass
// -------------------------

const earlyStart = new Map<
  string,
  number
>();

const earlyFinish = new Map<
  string,
  number
>();

for (const nodeId of topologicalOrder) {

  const node =
    nodeMap.get(nodeId)!;

  const parents =
    parentMap.get(nodeId) ?? [];

  let es = 0;

  if (parents.length > 0) {
    es = Math.max(
      ...parents.map(
        parentId =>
          earlyFinish.get(parentId)!
      )
    );
  }

  const ef =
    es + node.estimatedHours;

  earlyStart.set(
    nodeId,
    es
  );

  earlyFinish.set(
    nodeId,
    ef
  );
}

// -------------------------
// Project Duration
// -------------------------

const projectDuration =
  Math.max(
    ...Array.from(
      earlyFinish.values()
    )
  );
// -------------------------
// Backward Pass
// -------------------------

const lateStart = new Map<
  string,
  number
>();

const lateFinish = new Map<
  string,
  number
>();

const reversedOrder =
  [...topologicalOrder].reverse();

for (const nodeId of reversedOrder) {

  const node =
    nodeMap.get(nodeId)!;

  const children =
    childrenMap.get(nodeId) ?? [];

  let lf = projectDuration;

  if (children.length > 0) {
    lf = Math.min(
      ...children.map(
        childId =>
          lateStart.get(childId)!
      )
    );
  }

  const ls =
    lf - node.estimatedHours;

  lateFinish.set(
    nodeId,
    lf
  );

  lateStart.set(
    nodeId,
    ls
  );
}

// -------------------------
// Slack Calculation
// -------------------------

const analyzedNodes:
  AnalyzedProjectGraph["nodes"] = [];

const bottleneckNodes:
  AnalyzedProjectGraph["bottleneckNodes"] = [];

for (const nodeId of topologicalOrder) {

  const node =
    nodeMap.get(nodeId)!;

  const es =
    earlyStart.get(nodeId)!;

  const ef =
    earlyFinish.get(nodeId)!;

  const ls =
    lateStart.get(nodeId)!;

  const lf =
    lateFinish.get(nodeId)!;

  const slack =
    ls - es;

  const isCritical =
    slack === 0;

const analyzedNode:
  AnalyzedProjectNode = {
    ...node,

    earlyStart: es,
    earlyFinish: ef,

    lateStart: ls,
    lateFinish: lf,

    slack,

    isCritical,
  };

  analyzedNodes.push(
    analyzedNode
  );

  if (isCritical) {
    bottleneckNodes.push(
      analyzedNode
    );
  }
}

return {
  goal: graph.goal,

  nodes: analyzedNodes,
totalEstimatedHours:
  graph.nodes.reduce(
    (sum, node) =>
      sum + node.estimatedHours,
    0
  ),

  criticalPathHours:
    projectDuration,

  bottleneckNodes,

  isFeasible: true,
};
}
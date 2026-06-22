import type { ProjectGraph } from "@/types/project";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateGraph(
  graph: ProjectGraph
): ValidationResult {
  const errors: string[] = [];

  // Empty graph
  if (graph.nodes.length === 0) {
    errors.push("Graph contains no nodes.");
  }

  const nodeIds = new Set<string>();

  // Duplicate IDs
  for (const node of graph.nodes) {
    if (nodeIds.has(node.id)) {
      errors.push(
        `Duplicate node id found: ${node.id}`
      );
    }

    nodeIds.add(node.id);
  }

  // Missing dependencies + self loops
  for (const node of graph.nodes) {
    for (const dependency of node.dependencies) {
      if (!nodeIds.has(dependency)) {
        errors.push(
          `Node '${node.id}' depends on missing node '${dependency}'`
        );
      }

      if (dependency === node.id) {
        errors.push(
          `Self dependency detected on '${node.id}'`
        );
      }
    }
  }

  // Cycle detection
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const graphMap = new Map<string, string[]>();

  for (const node of graph.nodes) {
    graphMap.set(node.id, node.dependencies);
  }

  function hasCycle(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const dependencies =
      graphMap.get(nodeId) ?? [];

    for (const dependency of dependencies) {
      if (hasCycle(dependency)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);

    return false;
  }

  for (const node of graph.nodes) {
    if (hasCycle(node.id)) {
      errors.push(
        "Cycle detected in dependency graph."
      );

      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
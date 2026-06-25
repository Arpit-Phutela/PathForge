import type {
  ProjectGraph,
} from "@/types/project";

export function validateGraph(
  graph: ProjectGraph
): void {

  const nodeIds =
    new Set(
      graph.nodes.map(
        node => node.id
      )
    );

  for (const node of graph.nodes) {

    for (
      const dependency
      of node.dependencies
    ) {

      if (
        !nodeIds.has(
          dependency
        )
      ) {
        throw new Error(
          `Invalid dependency '${dependency}' in node '${node.id}'.`
        );
      }
    }
  }
}
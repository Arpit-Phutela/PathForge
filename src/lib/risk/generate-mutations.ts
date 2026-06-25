import type {
  ProjectGraph,
} from "@/types/project";

import type {
  NodeRisk,
} from "./risk-score";

export interface MutationCandidate {

  title: string;

  description: string;

  graph: ProjectGraph;
}

export function generateMutations(
  graph: ProjectGraph,
  risks: NodeRisk[]
): MutationCandidate[] {

  const mutations:
    MutationCandidate[] = [];

  const highestRisk =
    risks[0];

  if (!highestRisk) {
    return mutations;
  }

  const targetNode =
    graph.nodes.find(
      node =>
        node.id ===
        highestRisk.nodeId
    );

  if (!targetNode) {
    return mutations;
  }

  // ==================================
  // Mutation A
  // Split Large Task
  // ==================================

  if (
    targetNode.estimatedHours >= 20
  ) {

    const graphCopy =
      structuredClone(
        graph
      );

    const index =
      graphCopy.nodes.findIndex(
        node =>
          node.id ===
          targetNode.id
      );

    graphCopy.nodes.splice(
      index,
      1,

      {
        ...targetNode,

        id:
          `${targetNode.id}-part-1`,

        title:
          `${targetNode.title} Part 1`,

        estimatedHours:
          Math.ceil(
            targetNode
              .estimatedHours / 2
          ),
      },

      {
        ...targetNode,

        id:
          `${targetNode.id}-part-2`,

        title:
          `${targetNode.title} Part 2`,

        estimatedHours:
          Math.floor(
            targetNode
              .estimatedHours / 2
          ),

        dependencies: [
          `${targetNode.id}-part-1`,
        ],
      }
    );

    for (
      const node
      of graphCopy.nodes
    ) {

      node.dependencies =
        node.dependencies.map(
          dependency =>
            dependency ===
            targetNode.id
              ? `${targetNode.id}-part-2`
              : dependency
        );
    }

    mutations.push({

      title:
        "Split Large Task",

      description:
        `Split '${targetNode.title}' into sequential milestones.`,

      graph:
        graphCopy,
    });
  }

  // ==================================
  // Mutation B
  // Validation Stage
  // ==================================

  {
    const graphCopy =
      structuredClone(
        graph
      );

    const validationId =
      `${targetNode.id}-validation`;

    graphCopy.nodes.push({

      id:
        validationId,

      title:
        `${targetNode.title} Validation`,

      description:
        "Intermediate validation stage.",

      estimatedHours: 3,

      riskLevel: "low",

      dependencies: [
        targetNode.id,
      ],
    });

    for (
      const node
      of graphCopy.nodes
    ) {

      if (
        node.id ===
        validationId
      ) {
        continue;
      }

      node.dependencies =
        node.dependencies.map(
          dependency =>
            dependency ===
            targetNode.id
              ? validationId
              : dependency
        );
    }

    mutations.push({

      title:
        "Insert Validation Stage",

      description:
        `Add validation after '${targetNode.title}'.`,

      graph:
        graphCopy,
    });
  }

  // ==================================
  // Mutation C
  // Deployment Buffer
  // ==================================

  {
    const graphCopy =
      structuredClone(
        graph
      );

    const deployNode =
      graphCopy.nodes.find(
        node =>
          node.title
            .toLowerCase()
            .includes(
              "deploy"
            )
      );

    if (deployNode) {

      const oldDeps =
        [
          ...deployNode
            .dependencies,
        ];

      deployNode.dependencies =
        [
          "deployment-buffer",
        ];

      graphCopy.nodes.push({

        id:
          "deployment-buffer",

        title:
          "Deployment Buffer",

        description:
          "Stabilization phase before deployment.",

        estimatedHours: 5,

        riskLevel: "low",

        dependencies:
          oldDeps,
      });

      mutations.push({

        title:
          "Add Deployment Buffer",

        description:
          "Insert stabilization phase before deployment.",

        graph:
          graphCopy,
      });
    }
  }

  return mutations;
}
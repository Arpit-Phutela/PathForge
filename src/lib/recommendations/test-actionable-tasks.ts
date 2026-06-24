import {
  recommendTask,
} from "./recommend-task";

import {
  analyzeGraph,
} from "@/lib/graph/cpm";

import type {
  ProjectGraph,
} from "@/types/project";

const graph: ProjectGraph = {
  goal: "Portfolio",

  nodes: [
    {
      id: "research",
      title: "Research",
      description: "",
      estimatedHours: 5,
      riskLevel: "low",
      dependencies: [],
    },

    {
      id: "design",
      title: "Design",
      description: "",
      estimatedHours: 10,
      riskLevel: "medium",
      dependencies: [
        "research",
      ],
    },

    {
      id: "frontend",
      title: "Frontend",
      description: "",
      estimatedHours: 30,
      riskLevel: "high",
      dependencies: [
        "design",
      ],
    },
  ],
};

const analyzedGraph =
  analyzeGraph(graph);

console.log(
  recommendTask(
    analyzedGraph,
    [
      {
        nodeId: "research",
        completed: true,
      },

      {
        nodeId: "design",
        completed: false,
      },

      {
        nodeId: "frontend",
        completed: false,
      },
    ]
  )
);
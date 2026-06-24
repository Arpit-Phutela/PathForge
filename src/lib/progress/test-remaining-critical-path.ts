import { calculateRemainingProject } from "./remaining-critical-path";

import type {
  ProjectGraph,
} from "@/types/project";

const graph: ProjectGraph = {
  goal: "Portfolio Website",

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
      dependencies: ["research"],
    },

    {
      id: "frontend",
      title: "Frontend",
      description: "",
      estimatedHours: 30,
      riskLevel: "high",
      dependencies: ["design"],
    },

    {
      id: "testing",
      title: "Testing",
      description: "",
      estimatedHours: 10,
      riskLevel: "medium",
      dependencies: ["frontend"],
    },

    {
      id: "deploy",
      title: "Deploy",
      description: "",
      estimatedHours: 3,
      riskLevel: "low",
      dependencies: ["testing"],
    },
  ],
};

const result =
  calculateRemainingProject(
    graph,
    [
      {
        nodeId: "research",
        completed: true,
      },
      {
        nodeId: "design",
        completed: true,
      },
    ]
  );

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
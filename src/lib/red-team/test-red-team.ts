import {
  analyzeGraph,
} from "@/lib/graph/cpm";

import {
  runRedTeamReview,
} from "./red-team-agent";

import type {
  ProjectGraph,
} from "@/types/project";

const graph: ProjectGraph = {
  goal: "Build SaaS",

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
      id: "backend",
      title: "Backend API",

      description: "",

      estimatedHours: 50,

      riskLevel: "high",

      dependencies: [
        "research",
      ],
    },

    {
      id: "deploy",
      title: "Deploy",

      description: "",

      estimatedHours: 3,

      riskLevel: "low",

      dependencies: [
        "backend",
      ],
    },
  ],
};

const analyzedGraph =
  analyzeGraph(graph);

console.log(
  JSON.stringify(
    runRedTeamReview(
      analyzedGraph
    ),
    null,
    2
  )
);
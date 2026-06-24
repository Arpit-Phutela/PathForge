import { analyzeGraph } from "@/lib/graph/cpm";
import { analyzeTimelineRisk } from "./timeline-risk";

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
      estimatedHours: 10,
      riskLevel: "low",
      dependencies: [],
    },

    {
      id: "frontend",
      title: "Frontend",
      description: "",
      estimatedHours: 30,
      riskLevel: "high",
      dependencies: ["research"],
    },
  ],
};

const analyzedGraph =
  analyzeGraph(graph);

const result =
  analyzeTimelineRisk(
    analyzedGraph,
    5,
    4
  );

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
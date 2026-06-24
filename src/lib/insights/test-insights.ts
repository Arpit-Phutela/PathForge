import { analyzeGraph } from "@/lib/graph/cpm";
import { generateInsights } from "@/lib/insights/generate-insights";
import type {
  ProjectGraph,
} from "@/types/project";
const graph: ProjectGraph = {
  goal: "Build Portfolio Website",

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
      estimatedHours: 15,
      riskLevel: "medium",
      dependencies: ["research"],
    },

    {
      id: "frontend",
      title: "Frontend Development",
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
      title: "Deployment",
      description: "",
      estimatedHours: 3,
      riskLevel: "low",
      dependencies: ["testing"],
    },
  ],
};

const analyzedGraph =
  analyzeGraph(graph);

const insights =
  generateInsights(
    analyzedGraph
  );

console.log(
  JSON.stringify(
    insights,
    null,
    2
  )
);
import { analyzeGraph } from "./cpm";

const graph = {
  goal: "Portfolio Website",

  nodes: [
    {
      id: "setup",
      title: "Setup",
      description: "",
      estimatedHours: 2,
      riskLevel: "low" as const,
      dependencies: [],
    },

    {
      id: "auth",
      title: "Auth",
      description: "",
      estimatedHours: 5,
      riskLevel: "medium" as const,
      dependencies: ["setup"],
    },

    {
      id: "ui",
      title: "UI",
      description: "",
      estimatedHours: 3,
      riskLevel: "low" as const,
      dependencies: ["setup"],
    },

    {
      id: "deploy",
      title: "Deploy",
      description: "",
      estimatedHours: 1,
      riskLevel: "low" as const,
      dependencies: ["auth", "ui"],
    },
  ],
};

const result =
  analyzeGraph(graph);

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
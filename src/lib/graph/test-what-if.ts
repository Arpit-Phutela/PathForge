import { runWhatIfAnalysis } from "./what-if";

import type { ProjectGraph } from "@/types/project";

const graph: ProjectGraph = {
  goal: "Portfolio Website",

  nodes: [
    {
      id: "setup",
      title: "Setup",
      description: "",
      estimatedHours: 2,
      riskLevel: "low",
      dependencies: [],
    },

    {
      id: "auth",
      title: "Auth",
      description: "",
      estimatedHours: 5,
      riskLevel: "medium",
      dependencies: ["setup"],
    },

    {
      id: "ui",
      title: "UI",
      description: "",
      estimatedHours: 3,
      riskLevel: "low",
      dependencies: ["setup"],
    },

    {
      id: "deploy",
      title: "Deploy",
      description: "",
      estimatedHours: 1,
      riskLevel: "low",
      dependencies: ["auth", "ui"],
    },
  ],
};

const result =
  runWhatIfAnalysis(
    graph,
    "auth",
    3
  );

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);
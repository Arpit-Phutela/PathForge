import {
  calculateProgress,
} from "./progress";

const result =
  calculateProgress(
    5,
    [
      {
        nodeId: "research",
        completed: true,
      },
      {
        nodeId: "design",
        completed: true,
      },
      {
        nodeId: "frontend",
        completed: false,
      },
      {
        nodeId: "testing",
        completed: false,
      },
      {
        nodeId: "deploy",
        completed: false,
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
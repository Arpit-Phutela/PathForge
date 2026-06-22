export const plannerSchema = {
  type: "object",
  properties: {
    goal: {
      type: "string",
    },

    totalEstimatedHours: {
      type: "number",
    },

    nodes: {
      type: "array",

      items: {
        type: "object",

        properties: {
          id: {
            type: "string",
          },

          title: {
            type: "string",
          },

          description: {
            type: "string",
          },

          estimatedHours: {
            type: "number",
          },

          riskLevel: {
            type: "string",
            enum: ["low", "medium", "high"],
          },

          dependencies: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },

        required: [
          "id",
          "title",
          "description",
          "estimatedHours",
          "riskLevel",
          "dependencies",
        ],
      },
    },
  },

  required: [
    "goal",
    "totalEstimatedHours",
    "nodes",
  ],
} as const;
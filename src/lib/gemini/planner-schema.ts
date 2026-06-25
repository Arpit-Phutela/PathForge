export const plannerSchema = {

  type: "object",

  properties: {

    goal: {

      type: "string",
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

            enum: [
              "low",
              "medium",
              "high",
            ],
          },

          canBeDeferred: {

            type: "boolean",
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

          "canBeDeferred",

          "dependencies",
        ],
      },
    },
  },

  required: [

    "goal",

    "nodes",
  ],
} as const;

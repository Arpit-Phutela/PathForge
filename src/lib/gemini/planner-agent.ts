import { GoogleGenAI } from "@google/genai";

import { plannerSchema } from "./planner-schema";

import type {
  ProjectGraph,
} from "@/types/project";

const ai = new GoogleGenAI({
  apiKey:
    process.env.GOOGLE_API_KEY!,
});

export async function generateProjectGraph(
  userGoal: string
): Promise<ProjectGraph> {

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: `
Create a project execution plan.

Goal:
${userGoal}

Requirements:

- Return a valid DAG.

- Every node must have a unique id.

- Dependencies must reference valid node ids.

- Use realistic task durations.

- Assign a riskLevel.

- Add canBeDeferred.

Set canBeDeferred=true ONLY if the task can reasonably be postponed to a later version without preventing a working first release.

Examples:

Dark Mode → true

Animations → true

Blog → true

Analytics → true

Authentication → false

Core Backend → false

Deployment → false

Portfolio Section → false

Do NOT calculate project duration.

Do NOT calculate critical path.

Only generate the graph.
`,
      config: {
        responseMimeType:
          "application/json",

        responseSchema:
          plannerSchema,
      },
    });

  const text =
    response.text;

  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return JSON.parse(
    text
  ) as ProjectGraph;
}

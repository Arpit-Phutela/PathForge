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
- Use realistic task durations.
- Every node must have a unique id.
- Dependencies must reference valid node ids.
- Do NOT calculate total project duration.
- Do NOT calculate critical path.
- Only generate the project graph.
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
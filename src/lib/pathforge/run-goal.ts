import {
  generateProjectGraph,
} from "@/lib/gemini/planner-agent";

import {
  validateGraph,
} from "@/lib/gemini/validate-graph";

import {
  runPathForge,
} from "./run-pathforge";

import {
  getContext,
} from "@/lib/context/context-memory";

import {
  updateContext,
} from "@/lib/context/update-context";

import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export async function runGoal(

  goal: string,

  constraints: ProjectConstraints

) {

  //----------------------------------
  // Load Context
  //----------------------------------

  const context =
    getContext(
      goal
    );

  //----------------------------------
  // Generate Graph
  //----------------------------------

  const graph =
    await generateProjectGraph(
      goal
    );

  //----------------------------------
  // Validate Graph
  //----------------------------------

  validateGraph(
    graph
  );

  //----------------------------------
  // Execute Entire Pipeline
  //----------------------------------

  const result =
    runPathForge(

      graph,

      constraints

    );

  //----------------------------------
  // Update Context
  //----------------------------------

  updateContext(

    goal,

    {

      timestamp:
        new Date().toISOString(),

      completedTasks: [],

      acceptedRecommendation:
        result.decision
          .recommendedAction,

      rejectedRecommendations:
        [],
    }

  );

  //----------------------------------
  // Return
  //----------------------------------

  return {

    context,

    graph,

    analysis:
      result.originalGraphReturn,

    insights:
      result.insights,

    redTeam:
      result.redTeamReport,

    optimization:
      result.optimizationReport,

    feasibility:
      result.feasibility,

    decision:
      result.decision,

    explanation:
      result.explanation,

    confidence:
      result.confidence,
  };
}
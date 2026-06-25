import {
  analyzeGraph,
} from "@/lib/graph/cpm";

import {
  generateInsights,
} from "@/lib/insights/generate-insights";

import {
  runRedTeamReview,
} from "@/lib/red-team/red-team-agent";

import {
  optimizeGraph,
} from "@/lib/red-team/graph-mutation";

import {
  calculateFeasibility,
  type FeasibilityReport,
} from "@/lib/feasibility/calculate-feasibility";

import {
  runDecisionEngine,
} from "./decision-engine";

import {
  generateExplanation,
  type ExplanationReport,
} from "@/lib/explainability/generate-explanation";

import {
  calculateConfidence,
  type ConfidenceReport,
} from "@/lib/confidence/calculate-confidence";

import type {
  ProjectGraph,
} from "@/types/project";

import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export interface PathForgeResult {

  originalGraphReturn:
    ReturnType<
      typeof analyzeGraph
    >;

  insights:
    ReturnType<
      typeof generateInsights
    >;

  redTeamReport:
    ReturnType<
      typeof runRedTeamReview
    >;

  optimizationReport:
    ReturnType<
      typeof optimizeGraph
    >;

  feasibility:
    FeasibilityReport;

  decision:
    ReturnType<
      typeof runDecisionEngine
    >;

  explanation:
    ExplanationReport;

  confidence:
    ConfidenceReport;
}

export function runPathForge(

  graph: ProjectGraph,

  constraints: ProjectConstraints

): PathForgeResult {

  //---------------------------------
  // Analyze Graph
  //---------------------------------

  const analyzedGraph =
    analyzeGraph(
      graph
    );

  //---------------------------------
  // Insights
  //---------------------------------

  const insights =
    generateInsights(
      analyzedGraph
    );

  //---------------------------------
  // Red Team
  //---------------------------------

  const redTeamReport =
    runRedTeamReview(
      analyzedGraph
    );

  //---------------------------------
  // Optimization
  //---------------------------------

  const optimizationReport =
    optimizeGraph(
      graph
    );

  //---------------------------------
  // Feasibility
  //---------------------------------

  const feasibility =
    calculateFeasibility(
      graph,
      constraints
    );

  //---------------------------------
  // Decision
  //---------------------------------

  const decision =
    runDecisionEngine(

      graph,

      constraints,

      feasibility

    );

  //---------------------------------
  // Explanation
  //---------------------------------

  const explanation =
    generateExplanation(

      decision,

      feasibility

    );

  //---------------------------------
  // Confidence
  //---------------------------------

  const confidence =
    calculateConfidence(

      decision,

      feasibility,

      optimizationReport

    );

  //---------------------------------
  // Return
  //---------------------------------

  return {

    originalGraphReturn:
      analyzedGraph,

    insights,

    redTeamReport,

    optimizationReport,

    feasibility,

    decision,

    explanation,

    confidence,
  };
}
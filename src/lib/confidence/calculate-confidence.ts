import type {
  DecisionEngineResult,
} from "@/lib/pathforge/decision-engine";

import type {
  FeasibilityReport,
} from "@/lib/feasibility/calculate-feasibility";

import type {
  OptimizationResult,
} from "@/lib/red-team/graph-mutation";

export interface ConfidenceReport {

  score: number;

  level:
    | "Low"
    | "Medium"
    | "High";

  reasons: string[];
}

export function calculateConfidence(

  decision: DecisionEngineResult,

  feasibility: FeasibilityReport,

  optimization: OptimizationResult

): ConfidenceReport {

  let score = 50;

  const reasons: string[] = [];

  //----------------------------------------
  // Feasibility
  //----------------------------------------

  if (feasibility.isFeasible) {

    score += 30;

    reasons.push(
      "Plan is feasible."
    );

  } else {

    score += 10;

    reasons.push(
      "Recovery strategy required."
    );
  }

  //----------------------------------------
  // Decision
  //----------------------------------------

  if (

    decision.recoveryPlans.length > 0

  ) {

    score += 10;

    reasons.push(
      "Recovery strategies generated."
    );
  }

  if (

    decision.recommendedAction

  ) {

    score += 10;

    const action =
  decision.recommendedAction.replace(/\.+$/, "");

reasons.push(
  `Selected strategy: ${action}.`
);
  }

  //----------------------------------------
  // Optimization
  //----------------------------------------

  if (

    optimization.timeSaved > 0

  ) {

    score += 15;

    reasons.push(
      `Optimization saves ${optimization.timeSaved} hour(s).`
    );

  } else {

    reasons.push(
      "No meaningful optimization available."
    );
  }

  //----------------------------------------
  // Cap
  //----------------------------------------

  if (score > 100) {

    score = 100;
  }

  let level:
    "Low"
    | "Medium"
    | "High";

  if (score >= 90) {

    level = "High";

  } else if (score >= 70) {

    level = "Medium";

  } else {

    level = "Low";
  }

  return {

    score,

    level,

    reasons,
  };
}

import type {
  DecisionEngineResult,
} from "@/lib/pathforge/decision-engine";

import type {
  FeasibilityReport,
} from "@/lib/feasibility/calculate-feasibility";

export interface ExplanationReport {

  title: string;

  summary: string;

  reasons: string[];

  alternatives: string[];
}

export function generateExplanation(
  decision: DecisionEngineResult,
  feasibility: FeasibilityReport
): ExplanationReport {

  const reasons: string[] = [];

  reasons.push(
    `Project requires ${feasibility.requiredHours} hour(s).`
  );

  reasons.push(
    `You only have ${feasibility.availableHours} available hour(s).`
  );

  if (
    feasibility.deficitHours > 0
  ) {

    reasons.push(
      `${feasibility.deficitHours} hour deficit detected.`
    );

  } else {

    reasons.push(
      "Current schedule is feasible."
    );
  }

  const action =

  decision.recommendedAction
    .replace(/\.+$/, "");

reasons.push(

  `Recommended strategy: ${action}.`

);

  const alternatives =
    decision.recoveryPlans
      .filter(
        plan =>
          plan.title !==
          decision.recommendedAction
      )
      .map(
        plan =>
          plan.title
      );

  return {

    title:
      "Why this recommendation?",

    summary:

`${action} was selected because it best matches your current constraints and optimization preference.`,

    reasons,

    alternatives,
  };
}

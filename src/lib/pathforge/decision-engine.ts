import {
  generateRecoveryPlans,
} from "@/lib/feasibility/generate-recovery-plans";

import type {
  FeasibilityReport,
} from "@/lib/feasibility/calculate-feasibility";

import type {
  ProjectGraph,
} from "@/types/project";

import {
  selectRecoveryPlan,
} from "./select-recovery-plan";

import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export interface DecisionEngineResult {

  status:
    | "on-track"
    | "at-risk";

  summary: string;

  recommendedAction: string;

  reasons: string[];

  recoveryPlans:
    ReturnType<
      typeof generateRecoveryPlans
    >;
}

export function runDecisionEngine(

  graph: ProjectGraph,

  constraints: ProjectConstraints,

  feasibility: FeasibilityReport

): DecisionEngineResult {

  //---------------------------------------
  // Project already feasible
  //---------------------------------------

  if (
    feasibility.isFeasible
  ) {

    return {

      status:
        "on-track",

      summary:
        "Your current roadmap is achievable.",

      recommendedAction:
        "Continue with the existing roadmap.",

      reasons: [

        "Available hours are sufficient.",

        "No recovery strategy required.",
      ],

      recoveryPlans: [],
    };
  }

  //---------------------------------------
  // Generate recovery plans
  //---------------------------------------

  const recoveryPlans =
    generateRecoveryPlans(

      graph,

      feasibility,

      constraints

    );

  //---------------------------------------
  // Select best plan
  //---------------------------------------

  const selectedPlan =
    selectRecoveryPlan(

      recoveryPlans,

      constraints.optimizationPreference

    );

  //---------------------------------------
  // Return decision
  //---------------------------------------

  return {

    status:
      "at-risk",

    summary:
      `You are short by ${feasibility.deficitHours} hour(s).`,

    recommendedAction:
      selectedPlan.title,

    reasons: [

      `Project requires ${feasibility.requiredHours} hour(s).`,

      `Available capacity is ${feasibility.availableHours} hour(s).`,

      `${feasibility.deficitHours} hour deficit detected.`,

      `Selected '${selectedPlan.title}' because user preference is '${constraints.optimizationPreference}'.`,
    ],

    recoveryPlans,
  };
}

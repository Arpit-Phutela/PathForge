import type {
  DecisionEngineResult,
} from "./decision-engine";

export interface UserRecommendation {

  title: string;

  message: string;

  priority: "high" | "medium" | "low";

  actionItems: string[];
}

export function generateUserRecommendation(
  decision: DecisionEngineResult
): UserRecommendation {

  if (decision.status === "on-track") {

    return {

      title:
        "You're On Track",

      message:
        "Your current plan is achievable. Stay consistent and keep following your roadmap.",

      priority:
        "low",

      actionItems: [
        "Continue current schedule.",
      ],
    };
  }

  const recommendation =
    decision.recoveryPlans[0];

  const actions: string[] = [];

  if (
    recommendation.newHoursPerDay >
    0
  ) {

    actions.push(
      `Work ${recommendation.newHoursPerDay} hour(s) per day.`
    );
  }

  if (
    recommendation.newDeadlineDays >
    0
  ) {

    actions.push(
      `Deadline becomes ${recommendation.newDeadlineDays} day(s).`
    );
  }

  if (
    recommendation.scopeReduction.taskTitles.length >
    0
  ) {

    actions.push(
      `Postpone: ${recommendation.scopeReduction.taskTitles.join(", ")}`
    );
  }

  return {

    title:
      "Recovery Plan",

    message:
      recommendation.description,

    priority:
      "high",

    actionItems:
      actions,
  };
}
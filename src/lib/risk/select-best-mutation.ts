import type {
  MutationEvaluation,
} from "./evaluate-mutations";

export interface OptimizationDecision {

  chosenMutation:
    MutationEvaluation;

  reasoning: string[];
}

export function selectBestMutation(
  evaluations: MutationEvaluation[]
): OptimizationDecision | null {

  if (
    evaluations.length === 0
  ) {
    return null;
  }

  const validMutations =
    evaluations.filter(
      evaluation =>
        evaluation.durationImprovement > 0
        ||
        evaluation.highestRisk < 80
    );

  if (
    validMutations.length === 0
  ) {
    return null;
  }

  const winner =
    validMutations[0];

  const reasoning: string[] =
    [];

  if (
    winner.durationImprovement > 0
  ) {

    reasoning.push(
      `Improves project duration by ${winner.durationImprovement} hours.`
    );
  }

  if (
    winner.highestRisk < 80
  ) {

    reasoning.push(
      "Reduces highest-risk bottleneck."
    );
  }

  if (
    winner.averageRisk < 65
  ) {

    reasoning.push(
      "Maintains acceptable average project risk."
    );
  }

  return {

    chosenMutation:
      winner,

    reasoning,
  };
}
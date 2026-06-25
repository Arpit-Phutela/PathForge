import {
  analyzeGraph,
} from "@/lib/graph/cpm";

import {
  calculateRiskScores,
} from "./risk-score";

import type {
  ProjectGraph,
} from "@/types/project";

import type {
  MutationCandidate,
} from "./generate-mutations";

export interface MutationEvaluation {

  title: string;

  description: string;

  criticalPathHours: number;

  averageRisk: number;

  highestRisk: number;

  durationImprovement: number;

  tradeoffScore: number;

  graph: ProjectGraph;
}

export function evaluateMutations(
  originalGraph: ProjectGraph,
  mutations: MutationCandidate[]
): MutationEvaluation[] {

  const originalAnalyzed =
    analyzeGraph(
      originalGraph
    );

  const originalRisks =
    calculateRiskScores(
      originalAnalyzed
    );

  const originalDuration =
    originalAnalyzed
      .criticalPathHours;

  const originalHighestRisk =
    Math.max(
      ...originalRisks.map(
        risk => risk.score
      )
    );

  const evaluations:
    MutationEvaluation[] = [];

  for (
    const mutation
    of mutations
  ) {

    const analyzedGraph =
      analyzeGraph(
        mutation.graph
      );

    const risks =
      calculateRiskScores(
        analyzedGraph
      );

    const duration =
      analyzedGraph
        .criticalPathHours;

    const highestRisk =
      Math.max(
        ...risks.map(
          risk => risk.score
        )
      );

    const averageRisk =
      risks.reduce(
        (
          sum,
          risk
        ) =>
          sum +
          risk.score,
        0
      ) / risks.length;

    const durationImprovement =
      originalDuration -
      duration;

    const tradeoffScore =
      (
        durationImprovement * 3
      )
      +
      (
        originalHighestRisk -
        highestRisk
      )
      -
      averageRisk;

    evaluations.push({
      title:
        mutation.title,

      description:
        mutation.description,

      criticalPathHours:
        duration,

      averageRisk,

      highestRisk,

      durationImprovement,

      tradeoffScore,

      graph:
        mutation.graph,
    });
  }

  return evaluations.sort(
    (a, b) =>
      b.tradeoffScore -
      a.tradeoffScore
  );
}
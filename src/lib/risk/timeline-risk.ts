import type {
  AnalyzedProjectGraph,
} from "@/types/project";

export interface TimelineRiskResult {
  isFeasible: boolean;

  requiredHours: number;

  availableHours: number;

  shortfallHours: number;

  utilizationPercentage: number;

  riskLevel:
    | "low"
    | "medium"
    | "high";
}

export function analyzeTimelineRisk(
  graph: AnalyzedProjectGraph,
  deadlineDays: number,
  hoursPerDay: number
): TimelineRiskResult {

  const requiredHours =
    graph.criticalPathHours;

  const availableHours =
    deadlineDays * hoursPerDay;

  const shortfallHours =
    Math.max(
      0,
      requiredHours -
        availableHours
    );

  const utilizationPercentage =
    availableHours === 0
      ? 0
      : Math.round(
          (requiredHours /
            availableHours) *
            100
        );

  const isFeasible =
    requiredHours <=
    availableHours;

  let riskLevel:
    | "low"
    | "medium"
    | "high";

  if (
    utilizationPercentage <=
    80
  ) {
    riskLevel = "low";
  } else if (
    utilizationPercentage <=
    100
  ) {
    riskLevel = "medium";
  } else {
    riskLevel = "high";
  }

  return {
    isFeasible,

    requiredHours,

    availableHours,

    shortfallHours,

    utilizationPercentage,

    riskLevel,
  };
}
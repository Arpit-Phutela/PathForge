export type OptimizationPreference =

  | "balanced"

  | "speed"

  | "scope"

  | "deadline";

export interface ProjectConstraints {

  deadlineDays: number;

  availableHoursPerDay: number;

  optimizationPreference:
    OptimizationPreference;
}
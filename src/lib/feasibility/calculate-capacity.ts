import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export interface CapacityResult {

  availableHours: number;
}

export function calculateCapacity(
  constraints: ProjectConstraints
): CapacityResult {

  return {

    availableHours:
      constraints.deadlineDays *
      constraints.availableHoursPerDay,
  };
}
import {
  calculateFeasibility,
} from "@/lib/feasibility/calculate-feasibility";

import {
  generateRecoveryPlans,
} from "@/lib/feasibility/generate-recovery-plans";

import {
  selectRecoveryPlan,
} from "@/lib/pathforge/select-recovery-plan";

import type {
  ProjectGraph,
} from "@/types/project";

import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export interface ProgressUpdate {

  completedTaskIds: string[];

  currentDay: number;
}

export interface ReplanResult {

  completedTasks: number;

  remainingTasks: number;

  remainingHours: number;

  selectedRecovery: string;

  recoveryPlans:
    ReturnType<
      typeof generateRecoveryPlans
    >;
}

export function replanAfterProgress(

  graph: ProjectGraph,

  constraints: ProjectConstraints,

  progress: ProgressUpdate

): ReplanResult {

  // ----------------------------
  // Remove completed tasks
  // ----------------------------

  const remainingGraph: ProjectGraph = {

    goal: graph.goal,

    nodes:

      graph.nodes.filter(
        node =>
          !progress.completedTaskIds.includes(
            node.id
          )
      ),
  };

  // ----------------------------
  // Remove dependencies pointing
  // to completed tasks
  // ----------------------------

  for (
    const node
    of remainingGraph.nodes
  ) {

    node.dependencies =
      node.dependencies.filter(
        dependency =>
          !progress.completedTaskIds.includes(
            dependency
          )
      );
  }

  // ----------------------------
  // Recalculate deadline
  // ----------------------------

  const remainingDays =
    Math.max(

      constraints.deadlineDays -
      progress.currentDay,

      1
    );

  const updatedConstraints = {

    ...constraints,

    deadlineDays:
      remainingDays,
  };

  // ----------------------------
  // Feasibility
  // ----------------------------

  const feasibility =
    calculateFeasibility(

      remainingGraph,

      updatedConstraints
    );

  const recoveryPlans =
    generateRecoveryPlans(

      remainingGraph,

      feasibility,

      updatedConstraints
    );

  const selectedPlan =
    selectRecoveryPlan(

      recoveryPlans,

      updatedConstraints
        .optimizationPreference
    );

  // ----------------------------
  // Remaining Hours
  // ----------------------------

  const remainingHours =
    remainingGraph.nodes.reduce(

      (
        sum,

        node

      ) =>

        sum +
        node.estimatedHours,

      0
    );

  return {

    completedTasks:
      progress.completedTaskIds.length,

    remainingTasks:
      remainingGraph.nodes.length,

    remainingHours,

    selectedRecovery:
      selectedPlan.title,

    recoveryPlans,
  };
}

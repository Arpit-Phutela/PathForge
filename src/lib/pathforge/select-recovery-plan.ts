import type {
  RecoveryPlan,
} from "@/lib/feasibility/generate-recovery-plans";

import type {
  OptimizationPreference,
} from "@/types/project-constraints";

export function selectRecoveryPlan(

  plans: RecoveryPlan[],

  preference: OptimizationPreference

): RecoveryPlan {

  if (plans.length === 0) {

    throw new Error(
      "No recovery plans generated."
    );
  }

  switch (preference) {

    case "balanced": {

      const plan =
        plans.find(
          p => p.title === "Balanced Recovery"
        );

      if (plan) {

        return plan;
      }

      break;
    }

    case "speed": {

      const plan =
        plans.find(
          p => p.title === "Increase Daily Hours"
        );

      if (plan) {

        return plan;
      }

      break;
    }

    case "deadline": {

      const plan =
        plans.find(
          p => p.title === "Extend Deadline"
        );

      if (plan) {

        return plan;
      }

      break;
    }

    case "scope": {

      const plan =
        plans.find(
          p =>
            p.title === "Reduce Project Scope" &&
            p.becomesFeasible
        );

      if (plan) {

        return plan;
      }

      break;
    }
  }

  return plans[0];
}
import {
  suggestScopeReduction,
} from "./suggest-scope-reduction";

import type {
  FeasibilityReport,
} from "./calculate-feasibility";

import type {
  ProjectGraph,
} from "@/types/project";

import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export interface RecoveryPlan {

  title: string;

  description: string;

  newDeadlineDays: number;

  newHoursPerDay: number;

  scopeReduction: {

    hoursSaved: number;

    taskTitles: string[];
  };

  becomesFeasible: boolean;
}

export function generateRecoveryPlans(

  graph: ProjectGraph,

  report: FeasibilityReport,

  constraints: ProjectConstraints

): RecoveryPlan[] {

  if (report.isFeasible) {

    return [

      {

        title:
          "Current Plan",

        description:
          "Your current schedule is already feasible.",

        newDeadlineDays:
          constraints.deadlineDays,

        newHoursPerDay:
          constraints.availableHoursPerDay,

        scopeReduction: {

          hoursSaved: 0,

          taskTitles: [],
        },

        becomesFeasible: true,
      },
    ];
  }

  const plans: RecoveryPlan[] = [];

  //--------------------------------------------------
  // Plan A
  //--------------------------------------------------

  const extraHoursPerDay =

    Math.ceil(

      report.deficitHours /

      constraints.deadlineDays

    );

  plans.push({

    title:
      "Increase Daily Hours",

    description:
      `Work ${extraHoursPerDay} extra hour(s) every day.`,

    newDeadlineDays:
      constraints.deadlineDays,

    newHoursPerDay:
      constraints.availableHoursPerDay +

      extraHoursPerDay,

    scopeReduction: {

      hoursSaved: 0,

      taskTitles: [],
    },

    becomesFeasible: true,
  });

  //--------------------------------------------------
  // Plan B
  //--------------------------------------------------

  const extraDays =

    Math.ceil(

      report.deficitHours /

      constraints.availableHoursPerDay

    );

  plans.push({

    title:
      "Extend Deadline",

    description:
      `Increase deadline by ${extraDays} day(s).`,

    newDeadlineDays:
      constraints.deadlineDays +

      extraDays,

    newHoursPerDay:
      constraints.availableHoursPerDay,

    scopeReduction: {

      hoursSaved: 0,

      taskTitles: [],
    },

    becomesFeasible: true,
  });

  //--------------------------------------------------
  // Plan C
  //--------------------------------------------------

  const scopePlan =

    suggestScopeReduction(

      graph,

      report.deficitHours

    );

  plans.push({

    title:
      "Reduce Project Scope",

    description:
      "Postpone optional tasks to a future version.",

    newDeadlineDays:
      constraints.deadlineDays,

    newHoursPerDay:
      constraints.availableHoursPerDay,

    scopeReduction: {

      hoursSaved:
        scopePlan.hoursSaved,

      taskTitles:

        scopePlan.removedTasks.map(

          task => task.title

        ),
    },

    becomesFeasible:

      scopePlan.hoursSaved >=

      report.deficitHours,
  });

  //--------------------------------------------------
  // Plan D
  //--------------------------------------------------

  const balancedExtraHours =

    Math.ceil(

      extraHoursPerDay / 2

    );

  const balancedExtraDays =

    Math.ceil(

      extraDays / 2

    );

  const recoveredHours =

    balancedExtraHours *

    constraints.deadlineDays +

    balancedExtraDays *

    constraints.availableHoursPerDay;

  const remainingScope =

    Math.max(

      report.deficitHours -

      recoveredHours,

      0

    );

  const balancedScope =

    suggestScopeReduction(

      graph,

      remainingScope

    );

  plans.push({

    title:
      "Balanced Recovery",

    description:
      "Increase work slightly, extend the deadline slightly, and postpone a few optional tasks.",

    newDeadlineDays:

      constraints.deadlineDays +

      balancedExtraDays,

    newHoursPerDay:

      constraints.availableHoursPerDay +

      balancedExtraHours,

    scopeReduction: {

      hoursSaved:
        balancedScope.hoursSaved,

      taskTitles:

        balancedScope.removedTasks.map(

          task => task.title

        ),
    },

    becomesFeasible:

      recoveredHours +

      balancedScope.hoursSaved

      >=

      report.deficitHours,
  });

  return plans;
}
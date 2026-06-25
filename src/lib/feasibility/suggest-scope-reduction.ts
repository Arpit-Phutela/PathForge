import type {
  ProjectGraph,
  ProjectNode,
} from "@/types/project";

export interface ScopeReductionPlan {

  removedTasks: ProjectNode[];

  hoursSaved: number;
}

export function suggestScopeReduction(

  graph: ProjectGraph,

  targetHours: number

): ScopeReductionPlan {

  const optionalTasks =

    graph.nodes

      .filter(

        node => node.canBeDeferred

      )

      .sort(

        (a, b) =>

          b.estimatedHours -

          a.estimatedHours

      );

  const removedTasks: ProjectNode[] = [];

  let hoursSaved = 0;

  for (

    const task

    of

    optionalTasks

  ) {

    removedTasks.push(task);

    hoursSaved +=

      task.estimatedHours;

    if (

      hoursSaved >=

      targetHours

    ) {

      break;
    }
  }

  return {

    removedTasks,

    hoursSaved,
  };
}
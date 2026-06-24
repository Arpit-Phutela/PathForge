export interface TaskProgress {
  nodeId: string;

  completed: boolean;
}
export interface ProgressSummary {
  totalTasks: number;

  completedTasks: number;

  completionPercentage: number;

  remainingTasks: number;
}
export function calculateProgress(
  totalTasks: number,
  progress: TaskProgress[]
): ProgressSummary {

  const completedTasks =
    progress.filter(
      task => task.completed
    ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  const remainingTasks =
    totalTasks -
    completedTasks;

  return {
    totalTasks,

    completedTasks,

    completionPercentage,

    remainingTasks,
  };
}
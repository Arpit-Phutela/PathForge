export interface ContextSnapshot {

  timestamp: string;

  completedTasks: string[];

  rejectedRecommendations: string[];

  acceptedRecommendation?: string;

  notes?: string;
}

export interface UserContext {

  goal: string;

  history: ContextSnapshot[];
}
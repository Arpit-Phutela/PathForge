import type {
  UserContext,
} from "./context-types";

const memory =
  new Map<
    string,
    UserContext
  >();

export function getContext(
  goal: string
): UserContext {

  const existing =
    memory.get(goal);

  if (existing) {
    return existing;
  }

  const context: UserContext = {

    goal,

    history: [],
  };

  memory.set(
    goal,
    context
  );

  return context;
}
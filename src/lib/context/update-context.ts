import {
  getContext,
} from "./context-memory";

import type {
  ContextSnapshot,
} from "./context-types";

export function updateContext(

  goal: string,

  snapshot:
    ContextSnapshot

) {

  const context =
    getContext(goal);

  context.history.push(
    snapshot
  );

  return context;
}
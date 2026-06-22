import { NextResponse } from "next/server";

import { validateGraph } from "@/lib/validation/validate-graph";
import type { ProjectGraph } from "@/types/project";

export async function POST(
  request: Request
) {
  try {
    const graph =
      (await request.json()) as ProjectGraph;

    const result = validateGraph(graph);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        isValid: false,
        errors: ["Invalid request body"],
      },
      { status: 400 }
    );
  }
}
import { NextResponse } from "next/server";

import { validateGraph } from "@/lib/validation/validate-graph";

import { analyzeGraph } from "@/lib/graph/cpm";

import type { ProjectGraph } from "@/types/project";

export async function POST(
  request: Request
) {
  try {
    const graph: ProjectGraph =
      await request.json();

    const validationResult =
      validateGraph(graph);

    if (
      !validationResult.isValid
    ) {
      return NextResponse.json(
        {
          success: false,
          errors:
            validationResult.errors,
        },
        {
          status: 400,
        }
      );
    }

    const analyzedGraph =
      analyzeGraph(graph);

    return NextResponse.json({
      success: true,
      data: analyzedGraph,
    });

  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: [
          "Internal server error.",
        ],
      },
      {
        status: 500,
      }
    );
  }
}
import { NextResponse } from "next/server";

import {
  generateProjectGraph,
} from "@/lib/gemini/planner-agent";

export async function GET() {
  try {
    const graph =
      await generateProjectGraph(
        "Build a portfolio website in 2 weeks"
      );

    return NextResponse.json({
      success: true,
      data: graph,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
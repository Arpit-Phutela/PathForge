import { NextResponse } from "next/server";

import {
  runGoal,
} from "@/lib/pathforge/run-goal";

import type {
  ProjectConstraints,
} from "@/types/project-constraints";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const goal =
      body.goal;

    const constraints:
      ProjectConstraints = {

      deadlineDays:
        body.deadlineDays,

      availableHoursPerDay:
        body.availableHoursPerDay,

      optimizationPreference:
        body.optimizationPreference,
    };

    if (

      !goal ||

      typeof goal !== "string"

    ) {

      return NextResponse.json(

        {

          success: false,

          error:
            "Goal is required.",

        },

        {

          status: 400,

        }

      );
    }

    const result =
      await runGoal(

        goal,

        constraints

      );

    return NextResponse.json({

      success: true,

      data: result,

    });

  }

  catch (error) {

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
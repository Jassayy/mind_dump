import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { checkAuth } from "../../helpers/auth";
import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest, context: any) {
  //export async function METHOD(req: NextRequest, context: { params: Promise<any> })

  //nextjs injects dynamic req params as second paramter of api function
  try {
    const user = checkAuth(req); //will return userid and email

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthenticated request",
        },
        {
          status: 401,
        }
      );
    }
    const params = await context.params;
    const dumpId = params.id;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        {
          message: "Content should be provided",
        },
        {
          status: 400,
        }
      );
    }

    const existingDump = await prisma.dumps.findUnique({
      where: {
        id: dumpId,
      },
    });

    if (!existingDump || existingDump.userId !== user.id) {
      return NextResponse.json(
        { message: "Not authorized to update this dump" },
        { status: 403 }
      );
    }

    const updatedDump = await prisma.dumps.update({
      where: {
        id: dumpId,
      },
      data: {
        content,
      },
    });

    //update redis cache after deleting
    const pattern = `dumps:${user.id}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);

    revalidatePath("/dashboard");

    return NextResponse.json(
      {
        message: "Dump updated successfully!",
        dump: updatedDump,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating dumps: /dumps/:id", error);
    return NextResponse.json(
      {
        message: "Error updating dump",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized request",
        },
        {
          status: 401,
        }
      );
    }

    const params = await context.params;
    const dumpId = params.id;

    const existingDump = await prisma.dumps.findUnique({
      where: {
        id: dumpId,
      },
    });

    if (!existingDump || existingDump.userId !== user.id) {
      return NextResponse.json(
        {
          message: "Not authorized to delete this dump",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.dumps.delete({
      where: {
        id: dumpId,
      },
    });

    const pattern = `dumps:${user.id}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
    revalidatePath("/dashboard");

    return NextResponse.json(
      {
        message: "Dump deleted successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting dumps: /dumps/:id", error);
    return NextResponse.json(
      {
        message: "Error deleting dump",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(req: NextRequest, context: any) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized request",
        },
        {
          status: 401,
        }
      );
    }

    const params = await context.params;
    const dumpId = params.id;

    const dump = await prisma.dumps.findUnique({
      where: {
        id: dumpId,
      },
    });

    if (!dump) {
      return NextResponse.json(
        {
          message: "No dump found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Dump fetched successfully",
        dump,
      },
      {
        status: 200,
      }
    );
  } catch (error) {}
}

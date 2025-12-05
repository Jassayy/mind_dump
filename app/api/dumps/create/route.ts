import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthenticated request",
        },
        {
          status: 401,
        }
      );
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    }; //typescript does not know what the decode token contains or what its type is
    //we do as id:string email:string to tell typescript trust me bro decoded contains email and id

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        {
          error: "Content is required",
        },
        {
          status: 400,
        }
      );
    }

    const dump = await prisma.dumps.create({
      data: {
        content,
        userId: decodedToken.id,
      },
    });

    return NextResponse.json(
      {
        message: "You made a dump successfully!",
        dump,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in dumps/create route.ts", error);
    return NextResponse.json(
      {
        message: "Error while creating dump",
      },
      {
        status: 500,
      }
    );
  }
}

//this file is made for fetching all the dumps the user has saved

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "../helpers/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: any) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    //extract dumps with pagination to make application load fast
    //show maximum 10 dumps on one page
    //convert whole url to an object with the help of URL
    const { searchParams } = new URL(req.url);

    //convert this url string to integer and set pages and limit
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit; //how many records need to be skipped for respective page
    //for eg -> for page 2 we need to skip first 10 records in the database

    //now we need all the dumps and the count for dumps to calculate pagination
    //need to run two queries
    const [dumps, count] = await Promise.all([
      prisma.dumps.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc", //order in descending order
        },
        skip, //skip for each page
        take: limit, //limit for page -> will get only 10 dumps in a single query
      }),
      prisma.dumps.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json(
      {
        dumps,
        page,
        totalPages: Math.ceil(count / limit),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching dumps : /dumps", error);
    return NextResponse.json(
      {
        message: "Error fetching dumps",
      },
      {
        status: 500,
      }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

//this file is made for fetching all the dumps the user has saved

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "../helpers/auth";
import { prisma } from "@/app/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
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

    //check cache if it has data
    const cacheKey = `dumps:${user.id}:page:${page}:limit:${limit}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Redis cache hit");
      return NextResponse.json(cachedData);
    }

    console.log("Fetching data from database");

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

    const totalPages = Math.ceil(count / limit);
    const responseData = { dumps, page, totalPages };

    await redis.set(cacheKey, responseData, { ex: 120 }); //expiring in 120secs

    return NextResponse.json(responseData, {
      status: 200,
    });
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

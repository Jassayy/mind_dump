import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "../../helpers/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
     try {
          const user = checkAuth(req);
          if (!user) {
               return NextResponse.json(
                    {
                         error: "Unauthorized",
                    },
                    {
                         status: 401,
                    }
               );
          }

          const userData = await prisma.user.findUnique({
               where: { id: user.id },
               select: {
                    id: true,
                    name: true,
                    email: true,
               },
          });

          if (!userData) {
               return NextResponse.json(
                    {
                         error: "User not found",
                    },
                    {
                         status: 404,
                    }
               );
          }

          return NextResponse.json(
               {
                    user: userData,
               },
               {
                    status: 200,
               }
          );
     } catch (error) {
          console.error("Error fetching user:", error);
          return NextResponse.json(
               {
                    error: "Internal server error",
               },
               {
                    status: 500,
               }
          );
     }
}

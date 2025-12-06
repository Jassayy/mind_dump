import { prisma } from "@/app/lib/prisma";
import { groq } from "@/lib/groq";
import { getMoodEmoji } from "@/lib/mood-emoji";
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
          //after createing dump we send the dump to groq for mood analysis
          try {
               const response = await groq.chat.completions.create({
                    model: "llama-3.1-8b-instant",
                    messages: [
                         {
                              role: "system",
                              content: "Analyze the following dump and determine the mood of the user. Return only the mood in lowercase. If the mood is not clear, return 'neutral'.",
                         },
                         {
                              role: "user",
                              content: content,
                         },
                    ],
                    temperature: 0.5,
               });
               const mood =
                    response.choices[0].message.content?.toLowerCase() || "neutral";
               const moodEmoji = getMoodEmoji(mood); //we can store via this as well in the

               //update the dump with the mood
               await prisma.dumps.update({
                    where: {
                         id: dump.id,
                    },
                    data: {
                         mood,
                    },
               });
               dump.mood = mood;
          } catch (error) {
               console.error("Error in mood analysis", error);
          }

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

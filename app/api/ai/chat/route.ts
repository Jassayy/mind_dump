import { groq } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
     try {
          const { message } = await req.json();

          const completion = await groq.chat.completions.create({
               model: "llama-3.1-8b-instant",
               messages: [
                    {
                         role: "system",
                         content: "You are a helpful, calmful and supportive mental health assistant and a friend. And your name is Mr.Dumpster. Start conversation with Hi, I am Mr.Dumpster.",
                    },
                    {
                         role: "user",
                         content: message,
                    },
               ],
               stream: true,
          });

          const stream = new ReadableStream({
               async start(controller) {
                    for await (const chunk of completion) {
                         const text = chunk.choices?.[0]?.delta?.content;

                         if (text) {
                              controller.enqueue(
                                   //controller will convert text into binary format
                                   //and push to enqueue
                                   //enqueue will push binary data to the stream and
                                   //stream will feel like the ai is typing...
                                   new TextEncoder().encode(text)
                              );
                         }
                    }
                    controller.close();
               },
          });
          return new NextResponse(stream, {
               headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                    "Cache-Control": "no-cache",
               },
          });
     } catch (error) {
          console.error("Error in api/ai/chat/route.ts", error);
          return new NextResponse("Internal server error", {
               status: 500,
          });
     }
}

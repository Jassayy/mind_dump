import { groq } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
     try {
          const audioData = await req.arrayBuffer(); //incoming audio
          const file = new File([audioData], "audio.wav", { //we need to covert it into a new file as groq expects an audio file 
               type: "audio/wav",
               lastModified: Date.now(),
          });

          const response = await groq.audio.transcriptions.create({
               file: file,
               model: "whisper-large-v3",
               response_format: "json",
          });

          return NextResponse.json({
               text: response.text,
          });
     } catch (error) {
          console.error("Error in /api/ai/transcribe/route.ts", error);
          return new NextResponse("Failed to transcribe speech to text", {
               status: 500,
          });
     }
}

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/ui/rich-text-editor";

const CreateDumpPage = () => {
     const router = useRouter();
     const [content, setContent] = useState("");
     const [saving, setSaving] = useState(false);
     const [recording, setRecording] = useState(false);
     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
     const audioChunksRef = useRef<Blob[]>([]);

     const startRecording = async () => {
          try {
               const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
               });

               const mediaRecorder = new MediaRecorder(stream);
               mediaRecorderRef.current = mediaRecorder;
               audioChunksRef.current = [];

               mediaRecorder.ondataavailable = (e) =>
                    audioChunksRef.current.push(e.data);

               mediaRecorder.start();
               setRecording(true);

               mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, {
                         type: "audio/wav",
                    });

                    const buffer = await audioBlob.arrayBuffer();

                    const res = await fetch("/api/ai/transcribe", {
                         method: "POST",
                         headers: {
                              "Content-Type": "audio/wav",
                         },
                         body: buffer,
                    });

                    const data = await res.json();

                    if (data.text) {
                         setContent((prev) => prev + " " + data.text);
                         toast.success("Transcribed successfully!");
                    } else {
                         toast.error("Transcription failed");
                    }
               };
          } catch (error) {
               toast.error("Microphone permission denied");
          }
     };

     const stopRecording = () => {
          mediaRecorderRef.current?.stop();
          setRecording(false);
     };

     const handleSave = async () => {
          const textContent = content.replace(/<[^>]*>/g, "").trim();
          if (!textContent) {
               toast.error("Content cannot be empty");
               return;
          }

          setSaving(true);

          try {
               const res = await fetch("/api/dumps/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ content }),
               });

               const data = await res.json();

               if (!res.ok)
                    return toast.error(data.error || "Failed to create dump");

               toast.success("You've made quite a dump!", {
                    description: "Your dump has been saved.",
               });
               router.push(`/dashboard/dumps/${data.dump.id}`);
          } catch (error) {
               toast.error("Error saving dump");
          } finally {
               setSaving(false);
          }
     };

     return (
          <div className="min-h-screen">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                         {/* Header */}
                         <div className="flex items-center justify-between mb-6">
                              <Button
                                   variant="ghost"
                                   onClick={() => router.push("/dashboard")}
                                   className="gap-2"
                              >
                                   <ArrowLeft className="h-4 w-4" />
                                   Back
                              </Button>

                              <div className="flex items-center gap-3">
                                   <Button
                                        onClick={
                                             recording
                                                  ? stopRecording
                                                  : startRecording
                                        }
                                        variant={
                                             recording
                                                  ? "destructive"
                                                  : "secondary"
                                        }
                                        className="gap-2"
                                   >
                                        {recording ? (
                                             <>
                                                  <MicOff className="h-4 w-4" />
                                                  Stop Recording
                                             </>
                                        ) : (
                                             <>
                                                  <Mic className="h-4 w-4" />
                                                  Speak to Dump
                                             </>
                                        )}
                                   </Button>

                                   <Button
                                        onClick={handleSave}
                                        disabled={
                                             saving ||
                                             !content
                                                  .replace(/<[^>]*>/g, "")
                                                  .trim()
                                        }
                                        className="gap-2"
                                   >
                                        {saving ? (
                                             <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                             <Save className="h-4 w-4" />
                                        )}
                                        Save Dump
                                   </Button>
                              </div>
                         </div>

                         {/* Editor Card */}
                         <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 lg:p-8">
                              <h2 className="text-2xl font-bold mb-2">
                                   Create New Dump
                              </h2>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                                   Let your thoughts flow freely. Speak or write
                                   whatever comes to mind.
                              </p>

                              <div className="min-h-[500px]">
                                   <RichTextEditor
                                        value={content}
                                        onChange={setContent}
                                        placeholder="Start writing or tap the mic to speak..."
                                   />
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default CreateDumpPage;

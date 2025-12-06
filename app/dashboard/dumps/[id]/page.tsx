"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Trash2, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import RichTextEditor from "@/components/ui/rich-text-editor";

interface Dump {
     id: string;
     content: string;
     mood: string | null;
     createdAt: string;
     updatedAt: string;
}

const DumpViewPage = () => {
     const router = useRouter();
     const params = useParams();
     const dumpId = params.id as string;

     const [dump, setDump] = useState<Dump | null>(null);
     const [loading, setLoading] = useState(true);
     const [isEditing, setIsEditing] = useState(false);
     const [editContent, setEditContent] = useState("");
     const [saving, setSaving] = useState(false);
     const [deleting, setDeleting] = useState(false);

     useEffect(() => {
          const fetchDump = async () => {
               try {
                    const res = await fetch(`/api/dumps/${dumpId}`, {
                         credentials: "include",
                    });

                    if (!res.ok) {
                         toast("Error", {
                              description: "Failed to fetch dump",
                         });
                         router.push("/dashboard");
                         return;
                    }

                    const data = await res.json();
                    setDump(data.dump);
                    setEditContent(data.dump.content);
               } catch (error) {
                    console.error("Error fetching dump:", error);
                    toast("Error", {
                         description: "Failed to fetch dump",
                    });
                    router.push("/dashboard");
               } finally {
                    setLoading(false);
               }
          };

          if (dumpId) {
               fetchDump();
          }
     }, [dumpId, router]);

     const handleEdit = () => {
          setIsEditing(true);
     };

     const handleCancel = () => {
          setIsEditing(false);
          setEditContent(dump?.content || "");
     };

     const handleSave = async () => {
          // Strip HTML tags to check if there's actual content
          const textContent = editContent.replace(/<[^>]*>/g, "").trim();
          if (!textContent) {
               toast("Error", {
                    description: "Content cannot be empty",
               });
               return;
          }

          setSaving(true);
          try {
               const res = await fetch(`/api/dumps/${dumpId}`, {
                    method: "PATCH",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ content: editContent }),
               });

               const data = await res.json();

               if (!res.ok) {
                    toast("Error", {
                         description: data.message || "Failed to update dump",
                    });
                    return;
               }

               setDump(data.dump);
               setIsEditing(false);
               toast("Your dump is edited", {
                    description: "Changes have been saved successfully",
               });
          } catch (error) {
               console.error("Error updating dump:", error);
               toast("Error", {
                    description: "Failed to update dump",
               });
          } finally {
               setSaving(false);
          }
     };

     const handleDelete = async () => {
          if (
               !confirm(
                    "Are you sure you want to delete this dump? This action cannot be undone."
               )
          ) {
               return;
          }

          setDeleting(true);
          try {
               const res = await fetch(`/api/dumps/${dumpId}`, {
                    method: "DELETE",
                    credentials: "include",
               });

               if (!res.ok) {
                    toast("Error", {
                         description: "Failed to delete dump",
                    });
                    return;
               }

               toast("Whoopsie long time old dump!", {
                    description: "Your dump has been deleted",
               });
               router.push("/dashboard");
          } catch (error) {
               console.error("Error deleting dump:", error);
               toast("Error", {
                    description: "Failed to delete dump",
               });
          } finally {
               setDeleting(false);
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
               </div>
          );
     }

     if (!dump) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                         <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                              Dump not found
                         </h2>
                         <Button
                              onClick={() => router.push("/dashboard")}
                              className="mt-4"
                         >
                              Back to Dashboard
                         </Button>
                    </div>
               </div>
          );
     }

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
                              <div className="flex items-center gap-2">
                                   {!isEditing ? (
                                        <>
                                             <Button
                                                  variant="outline"
                                                  onClick={handleEdit}
                                                  className="gap-2"
                                             >
                                                  <Edit2 className="h-4 w-4" />
                                                  Edit
                                             </Button>
                                             <Button
                                                  variant="destructive"
                                                  onClick={handleDelete}
                                                  disabled={deleting}
                                                  className="gap-2"
                                             >
                                                  {deleting ? (
                                                       <Loader2 className="h-4 w-4 animate-spin" />
                                                  ) : (
                                                       <Trash2 className="h-4 w-4" />
                                                  )}
                                                  Delete
                                             </Button>
                                        </>
                                   ) : (
                                        <>
                                             <Button
                                                  variant="outline"
                                                  onClick={handleCancel}
                                                  disabled={saving}
                                                  className="gap-2"
                                             >
                                                  <X className="h-4 w-4" />
                                                  Cancel
                                             </Button>
                                             <Button
                                                  onClick={handleSave}
                                                  disabled={saving}
                                                  className="gap-2"
                                             >
                                                  {saving ? (
                                                       <Loader2 className="h-4 w-4 animate-spin" />
                                                  ) : (
                                                       <Save className="h-4 w-4" />
                                                  )}
                                                  Save
                                             </Button>
                                        </>
                                   )}
                              </div>
                         </div>

                         {/* Content Card */}
                         <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 lg:p-8">
                              {/* Metadata */}
                              <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                   <div>
                                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                             Created on
                                        </div>
                                        <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                             {format(
                                                  new Date(dump.createdAt),
                                                  "MMMM dd, yyyy 'at' hh:mm a"
                                             )}
                                        </div>
                                   </div>
                                   {dump.updatedAt !== dump.createdAt && (
                                        <div>
                                             <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                                  Last updated
                                             </div>
                                             <div className="text-sm text-zinc-700 dark:text-zinc-300">
                                                  {format(
                                                       new Date(dump.updatedAt),
                                                       "MMM dd, yyyy"
                                                  )}
                                             </div>
                                        </div>
                                   )}
                                   {dump.mood && (
                                        <div>
                                             <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                                  Mood
                                             </div>
                                             <span className="text-xs  text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
                                                  {dump.mood}
                                             </span>
                                        </div>
                                   )}
                              </div>

                              {/* Content */}
                              {isEditing ? (
                                   <RichTextEditor
                                        value={editContent}
                                        onChange={setEditContent}
                                        placeholder="Edit your dump..."
                                        className="bg-white dark:bg-zinc-900"
                                   />
                              ) : (
                                   <div
                                        className="prose prose-zinc dark:prose-invert max-w-none min-h-[400px]"
                                        dangerouslySetInnerHTML={{
                                             __html: dump.content,
                                        }}
                                   />
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default DumpViewPage;

"use client";

import React from "react";
import { NoteEditor } from "@/components/notes/note-editor";
import { NotesList } from "@/components/notes/notes-list";
import type { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type NotesAppProps = {
  _session: typeof authClient.$Infer.Session;
};

type ViewMode = "list" | "edit" | "create";

export default function NotesApp({ _session }: NotesAppProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const [selectedNoteId, setSelectedNoteId] = React.useState<
    string | undefined
  >();

  // Handle note selection
  const handleNoteSelect = React.useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setViewMode("edit");
  }, []);

  // Handle creating new note
  const handleNoteCreate = React.useCallback(() => {
    setSelectedNoteId(undefined);
    setViewMode("create");
  }, []);

  // Handle going back to list
  const handleBack = React.useCallback(() => {
    setViewMode("list");
    setSelectedNoteId(undefined);
  }, []);

  // Handle successful save (for new notes, we get the ID back)
  const handleNoteSave = React.useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setViewMode("edit");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
          {/* Notes List - Hidden on mobile when editing */}
          <div
            className={cn(
              "space-y-4 lg:w-1/3",
              (viewMode === "edit" || viewMode === "create") &&
                "hidden lg:block"
            )}
          >
            <NotesList
              onNoteCreate={handleNoteCreate}
              onNoteSelect={handleNoteSelect}
              selectedNoteId={selectedNoteId}
            />
          </div>

          {/* Note Editor - Full width on mobile, 2/3 on desktop */}
          <div
            className={cn("lg:w-2/3", viewMode === "list" && "hidden lg:block")}
          >
            {viewMode === "list" ? (
              <div className="py-16 text-center">
                <h3 className="font-medium text-muted-foreground text-xl">
                  Select a note to edit
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Choose a note from the list to start editing, or create a new
                  one.
                </p>
              </div>
            ) : (
              <NoteEditor
                noteId={selectedNoteId}
                onBack={handleBack}
                onSave={handleNoteSave}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

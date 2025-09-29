"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { client, orpc } from "@/utils/orpc";
import { Plus, Edit, Trash2, Search } from "lucide-react";

type NotesListProps = {
  onNoteSelect?: (noteId: string) => void;
  onNoteCreate?: () => void;
  selectedNoteId?: string;
};

export function NotesList({
  onNoteSelect,
  onNoteCreate,
  selectedNoteId,
}: NotesListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const queryClient = useQueryClient();

  // Query for notes list
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery(orpc.notes.list.queryOptions());

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => client.notes.delete({ id: noteId }),
    onSuccess: () => {
      toast.success("Note deleted successfully");
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: orpc.notes.list.queryKey() });
    },
    onError: (error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });

  // Filter notes based on search query
  const filteredNotes = React.useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  // Handle note deletion with confirmation
  const handleDeleteNote = React.useCallback(
    (noteId: string, noteTitle: string) => {
      if (window.confirm(`Are you sure you want to delete "${noteTitle}"?`)) {
        deleteNoteMutation.mutate(noteId);
      }
    },
    [deleteNoteMutation]
  );

  // Extract plain text from HTML content
  const extractTextContent = React.useCallback((htmlContent: string) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    return div.textContent || div.innerText || "";
  }, []);

  // Truncate text for preview
  const truncateText = React.useCallback((text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Notes</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card className="animate-pulse" key={i}>
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/4 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <h2 className="font-bold text-2xl text-destructive">
          Error loading notes
        </h2>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <Button
          className="mt-4"
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Notes</h2>
        <Button onClick={onNoteCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
        <input
          className="w-full rounded-md border py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          type="text"
          value={searchQuery}
        />
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              {searchQuery ? (
                <Search className="h-10 w-10 text-muted-foreground" />
              ) : (
                <Plus className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-semibold text-foreground text-xl">
              {searchQuery
                ? "No notes found"
                : "Start your note-taking journey"}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search terms or create a new note with this content"
                : "Capture your thoughts, ideas, and insights with rich formatting and AI-powered summaries"}
            </p>
            {searchQuery ? (
              <Button className="mt-6" onClick={onNoteCreate} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create note with search term
              </Button>
            ) : (
              <Button className="mt-6" onClick={onNoteCreate} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create your first note
              </Button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <Card
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                selectedNoteId === note.id && "border-primary bg-muted"
              )}
              key={note.id}
              onClick={() => onNoteSelect?.(note.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2 text-lg leading-tight">
                    {note.title || "Untitled"}
                  </CardTitle>
                  <div className="ml-2 flex items-center gap-1">
                    <Button
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteSelect?.(note.id);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit note</span>
                    </Button>
                    <Button
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={deleteNoteMutation.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id, note.title || "Untitled");
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete note</span>
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(note.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {truncateText(extractTextContent(note.content))}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

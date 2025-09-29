"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Copy, Save, Sparkles } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { client, orpc } from "@/utils/orpc";
import { RichTextEditor } from "./rich-text-editor";

type NoteEditorProps = {
  noteId?: string;
  onBack?: () => void;
  onSave?: (noteId: string) => void;
  className?: string;
};

export function NoteEditor({
  noteId,
  onBack,
  onSave,
  className,
}: NoteEditorProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = React.useState(false);
  const [showSummary, setShowSummary] = React.useState(false);
  const [summaryContent, setSummaryContent] = React.useState("");
  const [summaryFormat, setSummaryFormat] = React.useState<
    "executive" | "bullet-points" | "action-items"
  >("executive");
  const [copiedSummary, setCopiedSummary] = React.useState(false);

  const isEditing = Boolean(noteId);

  // Query for existing note data
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    ...orpc.notes.get.queryOptions({ input: { id: noteId! } }),
    enabled: Boolean(noteId),
  });

  const queryClient = useQueryClient();

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      client.notes.create(data),
    onSuccess: (newNote) => {
      toast.success("Note created successfully");
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      onSave?.(newNote.id);
      // Invalidate notes list to refresh it
      queryClient.invalidateQueries({ queryKey: orpc.notes.list.queryKey() });
    },
    onError: (error) => {
      toast.error(`Failed to create note: ${error.message}`);
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: (data: { id: string; title?: string; content?: string }) =>
      client.notes.update(data),
    onSuccess: () => {
      toast.success("Note saved successfully");
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      // Invalidate notes list and current note to refresh them
      queryClient.invalidateQueries({ queryKey: orpc.notes.list.queryKey() });
      if (noteId) {
        queryClient.invalidateQueries({
          queryKey: orpc.notes.get.queryKey({ input: { id: noteId } }),
        });
      }
    },
    onError: (error) => {
      toast.error(`Failed to save note: ${error.message}`);
    },
  });

  // AI summarization mutation
  const summarizeMutation = useMutation({
    mutationFn: (data: {
      noteId: string;
      format: "executive" | "bullet-points" | "action-items";
    }) => client.notes.summarize(data),
    onSuccess: (summary) => {
      setSummaryContent(summary.content);
      setShowSummary(true);
      toast.success("Summary generated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to generate summary: ${error.message}`);
    },
  });

  // Load note data when noteId changes
  React.useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setHasUnsavedChanges(false);
      setLastSavedAt(note.updatedAt);
    } else if (!isEditing) {
      // Reset for new note
      setTitle("");
      setContent("");
      setHasUnsavedChanges(false);
      setLastSavedAt(null);
    }
  }, [note, isEditing]);

  // Track changes
  React.useEffect(() => {
    if (note) {
      const hasChanges = title !== note.title || content !== note.content;
      setHasUnsavedChanges(hasChanges);
    } else if (title || content) {
      setHasUnsavedChanges(true);
    }
  }, [title, content, note]);

  // Handle save
  const handleSave = React.useCallback(() => {
    if (!title.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }

    if (isEditing && noteId) {
      const changes: { id: string; title?: string; content?: string } = {
        id: noteId,
      };
      if (title !== note?.title) changes.title = title;
      if (content !== note?.content) changes.content = content;

      if (Object.keys(changes).length > 1) {
        updateNoteMutation.mutate(changes);
      }
    } else {
      createNoteMutation.mutate({ title, content });
    }
  }, [
    title,
    content,
    isEditing,
    noteId,
    note,
    createNoteMutation,
    updateNoteMutation,
  ]);

  // Auto-save implementation (debounced)
  const autoSaveTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  React.useEffect(() => {
    if (hasUnsavedChanges && isEditing && noteId && title.trim()) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      setIsAutoSaving(true);
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
        setIsAutoSaving(false);
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        setIsAutoSaving(false);
      }
    };
  }, [hasUnsavedChanges, isEditing, noteId, title, handleSave]);

  // Handle AI summarization
  const handleSummarize = React.useCallback(() => {
    if (!noteId) {
      toast.error("Please save the note first");
      return;
    }

    if (!content.trim()) {
      toast.error("Note content is empty");
      return;
    }

    summarizeMutation.mutate({ noteId, format: summaryFormat });
  }, [noteId, content, summaryFormat, summarizeMutation]);

  // Handle copying summary to clipboard
  const handleCopySummary = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(summaryContent);
      setCopiedSummary(true);
      toast.success("Summary copied to clipboard");
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (error) {
      toast.error("Failed to copy summary");
    }
  }, [summaryContent]);

  // Keyboard shortcuts
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="animate-pulse">
          <div className="h-8 w-1/3 rounded bg-muted" />
        </CardHeader>
        <CardContent className="animate-pulse space-y-4">
          <div className="h-10 rounded bg-muted" />
          <div className="h-64 rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="py-8 text-center">
          <h3 className="font-medium text-destructive text-lg">
            Error loading note
          </h3>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <Button className="mt-4" onClick={onBack} variant="outline">
            Go back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isPending =
    createNoteMutation.isPending || updateNoteMutation.isPending;

  return (
    <div
      className={cn("w-full space-y-4", className)}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button onClick={onBack} size="sm" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <h2 className="font-semibold text-xl">
            {isEditing ? "Edit Note" : "New Note"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {lastSavedAt && !hasUnsavedChanges && !isAutoSaving && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Saved {lastSavedAt.toLocaleTimeString()}
            </span>
          )}
          {isAutoSaving && (
            <span className="flex items-center gap-1 text-blue-600 text-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              Auto-saving...
            </span>
          )}
          {hasUnsavedChanges && !isAutoSaving && (
            <span className="flex items-center gap-1 text-orange-600 text-sm">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              Unsaved changes
            </span>
          )}

          {/* AI Summarization Button */}
          {noteId && (
            <Button
              disabled={summarizeMutation.isPending || !content.trim()}
              onClick={handleSummarize}
              size="sm"
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {summarizeMutation.isPending ? "Summarizing..." : "AI Summary"}
            </Button>
          )}

          <Button
            disabled={isPending || !hasUnsavedChanges}
            onClick={handleSave}
            size="sm"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <input
            className="resize-none border-none bg-transparent font-bold text-2xl outline-none placeholder:text-muted-foreground"
            disabled={isPending}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            type="text"
            value={title}
          />
        </CardHeader>
        <CardContent>
          <RichTextEditor
            autoSave={isEditing}
            autoSaveDelay={2000}
            className="border-none shadow-none"
            onChange={setContent}
            placeholder="Start writing your note..."
            value={content}
          />
        </CardContent>
      </Card>

      {/* AI Summary Section */}
      {showSummary && summaryContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5" />
                AI Summary
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* Summary Format Selection */}
                <select
                  className="rounded border px-2 py-1 text-sm"
                  disabled={summarizeMutation.isPending}
                  onChange={(e) => setSummaryFormat(e.target.value as any)}
                  value={summaryFormat}
                >
                  <option value="executive">Executive Summary</option>
                  <option value="bullet-points">Bullet Points</option>
                  <option value="action-items">Action Items</option>
                </select>

                {/* Regenerate Summary */}
                <Button
                  disabled={summarizeMutation.isPending}
                  onClick={handleSummarize}
                  size="sm"
                  variant="outline"
                >
                  {summarizeMutation.isPending ? "Generating..." : "Regenerate"}
                </Button>

                {/* Copy Summary */}
                <Button onClick={handleCopySummary} size="sm" variant="outline">
                  {copiedSummary ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy summary</span>
                </Button>

                {/* Close Summary */}
                <Button
                  onClick={() => setShowSummary(false)}
                  size="sm"
                  variant="ghost"
                >
                  ×
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none"
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {summaryContent}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help text */}
      <p className="text-muted-foreground text-sm">
        Press Cmd+S to save • Changes are auto-saved when editing
        {noteId && " • Click AI Summary to generate insights"}
      </p>
    </div>
  );
}

"use client";

import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing your note...",
  className,
  autoSave = false,
  autoSaveDelay = 1000,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = React.useState(false);
  const autoSaveTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Handle auto-save with debouncing
  const debouncedAutoSave = React.useCallback(
    (content: string) => {
      if (autoSave) {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
        autoSaveTimerRef.current = setTimeout(() => {
          // This would trigger the parent's save function
          console.log("Auto-saving content:", content);
        }, autoSaveDelay);
      }
    },
    [autoSave, autoSaveDelay]
  );

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Handle content changes
  const handleInput = React.useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      debouncedAutoSave(content);
    }
  }, [onChange, debouncedAutoSave]);

  // Format text functions
  const formatText = React.useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      handleInput();
    },
    [handleInput]
  );

  // Keyboard shortcuts
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        // biome-ignore lint/style/useDefaultSwitchClause: <explanation>
        switch (e.key) {
          case "b":
            e.preventDefault();
            formatText("bold");
            break;
          case "i":
            e.preventDefault();
            formatText("italic");
            break;
          case "u":
            e.preventDefault();
            formatText("underline");
            break;
          case "1":
            e.preventDefault();
            formatText("formatBlock", "h1");
            break;
          case "2":
            e.preventDefault();
            formatText("formatBlock", "h2");
            break;
          case "3":
            e.preventDefault();
            formatText("formatBlock", "h3");
            break;
          case "0":
          case "p":
            e.preventDefault();
            formatText("formatBlock", "p");
            break;
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        formatText("insertText", "\t");
      }
    },
    [formatText]
  );

  // Toolbar buttons configuration
  const toolbarButtons = [
    {
      icon: Bold,
      command: "bold",
      title: "Bold (Cmd+B)",
      shortcut: "⌘B",
    },
    {
      icon: Italic,
      command: "italic",
      title: "Italic (Cmd+I)",
      shortcut: "⌘I",
    },
    {
      icon: Heading1,
      command: "formatBlock",
      value: "h1",
      title: "Heading 1 (Cmd+1)",
      shortcut: "⌘1",
    },
    {
      icon: Heading2,
      command: "formatBlock",
      value: "h2",
      title: "Heading 2 (Cmd+2)",
      shortcut: "⌘2",
    },
    {
      icon: Heading3,
      command: "formatBlock",
      value: "h3",
      title: "Heading 3 (Cmd+3)",
      shortcut: "⌘3",
    },
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Numbered List",
    },
  ];

  return (
    <div className={cn("rounded-md border", className)}>
      {/* Toolbar */}
      <div
        className={cn(
          "flex items-center gap-1 border-b bg-background p-2",
          isEditorFocused && "bg-muted/30"
        )}
      >
        {toolbarButtons.map((button, index) => (
          <Button
            className="h-8 w-8 p-0"
            key={index}
            onClick={() => formatText(button.command, button.value)}
            size="sm"
            title={button.title}
            type="button"
            variant="ghost"
          >
            <button.icon className="h-4 w-4" />
            <span className="sr-only">{button.title}</span>
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div
        aria-label="Rich text editor"
        aria-multiline="true"
        className={cn(
          "min-h-[200px] p-4 text-sm leading-relaxed outline-none",
          "focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "prose prose-sm max-w-none",
          // Prose styles for rich text elements
          "[&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:font-bold [&_h1]:text-2xl",
          "[&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:font-semibold [&_h2]:text-xl",
          "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-medium [&_h3]:text-lg",
          "[&_ul]:my-4 [&_ul]:ml-6 [&_ul]:list-disc",
          "[&_ol]:my-4 [&_ol]:ml-6 [&_ol]:list-decimal",
          "[&_li]:mb-1",
          "[&_p]:mb-3",
          "[&_strong]:font-semibold",
          "[&_em]:italic"
        )}
        contentEditable
        data-placeholder={placeholder}
        onBlur={() => setIsEditorFocused(false)}
        onFocus={() => setIsEditorFocused(true)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning={true}
        tabIndex={0}
      />

      {/* Screen reader instructions */}
      <div className="sr-only">
        Rich text editor. Use Cmd+B for bold, Cmd+I for italic, Cmd+U for
        underline, Cmd+1-3 for headings, Cmd+0 for paragraph, Tab for indent.
        Tab to navigate toolbar buttons.
      </div>
    </div>
  );
}

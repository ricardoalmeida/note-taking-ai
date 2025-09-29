import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "../db";
import { notes } from "../db/schema/notes";
import { protectedProcedure } from "../lib/orpc";

// Input schemas
const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
});

const updateNoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
});

const deleteNoteSchema = z.object({
  id: z.string(),
});

const summarizeNoteSchema = z.object({
  noteId: z.string(),
  format: z.enum(["executive", "bullet-points", "action-items"]),
});

// Output schemas
const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
});

const summarySchema = z.object({
  content: z.string(),
  format: z.enum(["executive", "bullet-points", "action-items"]),
});

export const notesRouter = {
  // Get all notes for the current user
  list: protectedProcedure
    .output(z.array(noteSchema))
    .handler(async ({ context }) => {
      const userNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.userId, context.session.user.id))
        .orderBy(desc(notes.updatedAt));

      return userNotes;
    }),

  // Get a specific note by ID
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(noteSchema)
    .handler(async ({ input, context }) => {
      const [note] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, input.id));

      if (!note) {
        throw new Error("Note not found");
      }

      // Ensure user owns the note
      if (note.userId !== context.session.user.id) {
        throw new Error("Unauthorized");
      }

      return note;
    }),

  // Create a new note
  create: protectedProcedure
    .input(createNoteSchema)
    .output(noteSchema)
    .handler(async ({ input, context }) => {
      const now = new Date();
      const noteId = nanoid();

      const [newNote] = await db
        .insert(notes)
        .values({
          id: noteId,
          title: input.title,
          content: input.content,
          userId: context.session.user.id,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return newNote;
    }),

  // Update an existing note
  update: protectedProcedure
    .input(updateNoteSchema)
    .output(noteSchema)
    .handler(async ({ input, context }) => {
      // First verify the note exists and user owns it
      const [existingNote] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, input.id));

      if (!existingNote) {
        throw new Error("Note not found");
      }

      if (existingNote.userId !== context.session.user.id) {
        throw new Error("Unauthorized");
      }

      // Update the note
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (input.title !== undefined) {
        updateData.title = input.title;
      }

      if (input.content !== undefined) {
        updateData.content = input.content;
      }

      const [updatedNote] = await db
        .update(notes)
        .set(updateData)
        .where(eq(notes.id, input.id))
        .returning();

      return updatedNote;
    }),

  // Delete a note
  delete: protectedProcedure
    .input(deleteNoteSchema)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context }) => {
      // First verify the note exists and user owns it
      const [existingNote] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, input.id));

      if (!existingNote) {
        throw new Error("Note not found");
      }

      if (existingNote.userId !== context.session.user.id) {
        throw new Error("Unauthorized");
      }

      // Delete the note
      await db.delete(notes).where(eq(notes.id, input.id));

      return { success: true };
    }),

  // AI summarization endpoint
  summarize: protectedProcedure
    .input(summarizeNoteSchema)
    .output(summarySchema)
    .handler(async ({ input, context }) => {
      // First get the note and verify ownership
      const [note] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, input.noteId));

      if (!note) {
        throw new Error("Note not found");
      }

      if (note.userId !== context.session.user.id) {
        throw new Error("Unauthorized");
      }

      // Generate AI summary based on format
      let prompt: string;
      switch (input.format) {
        case "executive":
          prompt = `Please provide an executive summary of the following note content. Focus on the key points and main takeaways in a concise paragraph format:\n\n${note.content}`;
          break;
        case "bullet-points":
          prompt = `Please summarize the following note content as bullet points. Extract the main ideas and present them as a clear, organized list:\n\n${note.content}`;
          break;
        case "action-items":
          prompt = `Please extract action items and next steps from the following note content. Focus on tasks, decisions, and actionable items:\n\n${note.content}`;
          break;
        default:
          throw new Error("Invalid summary format");
      }

      try {
        const { text } = await generateText({
          model: google("gemini-2.0-flash"),
          prompt,
        });

        return {
          content: text,
          format: input.format,
        };
      } catch (error) {
        throw new Error(
          "Failed to generate summary. Please check your AI API configuration."
        );
      }
    }),
};

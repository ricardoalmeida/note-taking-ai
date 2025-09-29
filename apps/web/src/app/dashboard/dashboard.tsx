"use client";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export default function Dashboard({
  _session,
}: {
  _session: typeof authClient.$Infer.Session;
}) {
  const privateData = useQuery(orpc.privateData.queryOptions());
  const { data: notes = [] } = useQuery(orpc.notes.list.queryOptions());

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Notes Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
            <CardDescription>
              You have {notes.length} note{notes.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/notes">
              <Button className="w-full">View All Notes</Button>
            </Link>
            <Link href="/notes">
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New Note
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>Backend connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {privateData.isLoading
                ? "Checking..."
                : privateData.data?.message || "Connected"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes */}
      {notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your latest notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notes.slice(0, 3).map((note) => (
                <Link href="/notes" key={note.id}>
                  <div className="rounded-md border p-3 transition-colors hover:bg-muted/50">
                    <h4 className="font-medium">{note.title || "Untitled"}</h4>
                    <p className="text-muted-foreground text-sm">
                      Updated {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {notes.length > 3 && (
              <Link href="/notes">
                <Button className="mt-4 w-full" variant="outline">
                  View All {notes.length} Notes
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";
import { useQuery } from "@tanstack/react-query";
import type { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export default function Dashboard({
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const privateData = useQuery(orpc.privateData.queryOptions());

  return (
    <div>
      <p>API: {privateData.data?.message}</p>
    </div>
  );
}

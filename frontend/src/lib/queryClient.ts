import { QueryClient } from "@tanstack/react-query";

// Exported so lib/session can wipe it at session boundaries â€” cached data outlives logout.
export const queryClient = new QueryClient();

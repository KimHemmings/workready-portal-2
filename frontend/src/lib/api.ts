// Typed fetch layer over the backend. Base is the relative "/api" prefix so the
// same code works in dev (Vite proxies /api â†’ backend) and behind a single origin in prod.
const BASE = "/api";
/** Same base, exported for direct browser navigations (file downloads, new tabs). */
export const API_BASE = BASE;

// Fields are declared, not constructor parameter properties: tsconfig sets
// erasableSyntaxOnly, which rejects `constructor(readonly status: number)`.
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`request failed with ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type JsonBody = unknown;

async function request<T>(method: string, path: string, body?: JsonBody): Promise<T> {
  // Auth rides the httpOnly session cookie automatically â€” never add auth headers here.
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // Backend reports request-validation failures as non-2xx with a detail/error body.
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new ApiError(res.status, errBody);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// Generic REST helpers
export const apiGet = <T>(path: string) => request<T>("GET", path);
export const apiPost = <T>(path: string, body?: JsonBody) => request<T>("POST", path, body ?? null);
export const apiPut = <T>(path: string, body?: JsonBody) => request<T>("PUT", path, body ?? null);
export const apiPatch = <T>(path: string, body?: JsonBody) =>
  request<T>("PATCH", path, body ?? null);
export const apiDelete = <T>(path: string) => request<T>("DELETE", path);

// Azure OpenAI Chat Types & Helper
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatCompletionResponse {
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  created: number;
  id: string;
  model: string;
  object: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
  * Sends messages to the Azure OpenAI /api/chat endpoint and returns the AI text response.
  */
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const response = await apiPost<ChatCompletionResponse>("/chat", { messages });
  return response.choices[0]?.message?.content ?? "";
}
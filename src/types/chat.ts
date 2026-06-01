export type Tenant = "demo";

export type MessageRole = "user" | "assistant";

export interface ToolCall {
  tool: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  loading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface ChatMessageResponse {
  role?: "user" | "assistant" | "tool";
  content?: string;
  tool_calls?: any;
  tool_call_id?: any;
  name?: any;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationResponse {
  [id: string]: ChatMessageResponse[];
}

export interface ChatResponse {
  assistantMessage: string;
  conversationId: string;
  toolCalls: ToolCall[] | null;
}
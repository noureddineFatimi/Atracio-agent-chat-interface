export type MessageRole = "user" | "assistant";

export interface ThinkingStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  thinking?: ThinkingStep[];
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Conversation, ChatMessage, MessageRole, ConversationResponse, ChatMessageResponse } from "@/types/chat";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function extractUpdatedAt(items: ChatMessageResponse[]): number {
  const raw = items.find((m) => m.updated_at)?.updated_at;
  return raw ? new Date(raw).getTime() : Date.now();
}

function extractTitle(items: ChatMessageResponse[]): string {
  const firstUserContent = items.find((m) => m.role === "user")?.content ?? "";
  if (!firstUserContent.trim()) return "Nouvelle conversation";
  return firstUserContent.length > 50
    ? `${firstUserContent.slice(0, 50)}…`
    : firstUserContent;
}

function isDisplayableMessage(
  m: ChatMessageResponse
): m is ChatMessageResponse & { role: "user" | "assistant"; content: string } {
  return (
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    m.content.trim().length > 0
  );
}

export function mapConversationHistory(data: ConversationResponse): Conversation[] {
  return Object.entries(data)
    .map(([id, items]) => {
      const messages: ChatMessage[] = items
        .filter(isDisplayableMessage)
        .map((m, index) => ({
          id: `${id}-msg-${index}`,
          role: m.role as MessageRole,
          content: m.content,
        }));

      return {
        id,
        title: extractTitle(items),
        updatedAt: extractUpdatedAt(items),
        messages,
      };
    })
    .sort((a, b) => b.updatedAt - a.updatedAt); // plus récente en premier
}
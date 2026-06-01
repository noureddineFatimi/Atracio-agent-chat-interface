import { useEffect, useRef } from "react";
import { Box, Stack } from "@mui/material";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  streamingMessage: ChatMessage | null;
  onRetry?: (id: string) => void;
  loadingAssistantMessage:boolean
}

export function MessageList({ messages, streamingMessage, onRetry, loadingAssistantMessage }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streamingMessage]);

  return (
    <Box sx={{ flex: 1, overflowY: "auto", py: 4 }}>
      <Stack spacing={3} sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 } }}>
        {messages.map((m, i) => (
          <MessageBubble
            key={m.id}
            message={m}
            onRetry={
              m.role === "assistant" && i === messages.length - 1 && onRetry
                ? () => onRetry(m.id)
                : undefined
            }
            loadingAssistantMessage={loadingAssistantMessage}
          />
        ))}
        {streamingMessage && (
          <MessageBubble
            message={streamingMessage}
            thinkingActive
            loadingAssistantMessage={loadingAssistantMessage}
          />
        )}
        <div ref={endRef} />
      </Stack>
    </Box>
  );
}

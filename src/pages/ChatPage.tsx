import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box } from "@mui/material";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { atracioAuthClient } from "@/services/atracioAuthClient";
import { agentClient } from "@/services/agentClient";
import type { ChatMessage, Conversation, ThinkingStep } from "@/types/chat";

function newConv(): Conversation {
  return {
    id: `c-${Date.now()}`,
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

export function ChatPage() {
  const navigate = useNavigate();
  const session = useMemo(() => atracioAuthClient.getSession(), []);
  const [conversations, setConversations] = useState<Conversation[]>([newConv()]);
  const [activeId, setActiveId] = useState<string>(() => conversations[0].id);
  const [streaming, setStreaming] = useState<ChatMessage | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!session) navigate({ to: "/login" });
  }, [session, navigate]);

  if (!session) return null;

  const active = conversations.find((c) => c.id === activeId)!;

  const updateActive = (fn: (c: Conversation) => Conversation) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? fn(c) : c)),
    );
  };

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    updateActive((c) => ({
      ...c,
      messages: [...c.messages, userMsg],
      title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
      updatedAt: Date.now(),
    }));

    setBusy(true);
    setStreaming({
      id: "streaming",
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      thinking: [],
    });

    await agentClient.sendChatMessage(text, {
      onThinking: (steps: ThinkingStep[]) => {
        setStreaming((prev) =>
          prev ? { ...prev, thinking: steps } : prev,
        );
      },
      onComplete: (msg) => {
        updateActive((c) => ({
          ...c,
          messages: [...c.messages, msg],
          updatedAt: Date.now(),
        }));
        setStreaming(null);
        setBusy(false);
      },
    });
  };

  const handleNew = () => {
    const c = newConv();
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
  };

  const handleClear = () => {
    updateActive((c) => ({ ...c, messages: [], title: "New conversation" }));
  };

  const handleRetry = (_id: string) => {
    const msgs = active.messages;
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    updateActive((c) => ({
      ...c,
      messages: c.messages.slice(0, -1), // drop last assistant
    }));
    setTimeout(() => sendMessage(lastUser.content), 0);
  };

  const handleLogout = () => {
    atracioAuthClient.logout();
    navigate({ to: "/login" });
  };

  return (
    <Box sx={{ display: "flex", height: "100dvh", bgcolor: "background.default" }}>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        email={session.email}
        onNew={handleNew}
        onSelect={setActiveId}
        onLogout={handleLogout}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header tenant={session.tenant} />
        <ChatPanel
          messages={active.messages}
          streamingMessage={streaming}
          busy={busy}
          onSend={sendMessage}
          onClear={handleClear}
          onRetry={handleRetry}
        />
      </Box>
    </Box>
  );
}

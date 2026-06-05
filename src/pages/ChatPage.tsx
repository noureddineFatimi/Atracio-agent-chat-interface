import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Box, CircularProgress, Snackbar } from "@mui/material";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { atracioAuthClient } from "@/services/atracioAuthClient";
import { agentClient } from "@/services/agentClient";
import type { ChatMessage, ChatMessageResponse, ChatResponse, Conversation, ConversationResponse, MessageRole } from "@/types/chat";
import type { AuthSession } from "@/types/auth";
import { ChatError, ShouldLoginError, UnauthorizedError } from "@/services/exceptions";
import { v4 as uuidv4 } from 'uuid';
import { mapConversationHistory } from "@/lib/utils";

function newConv(): Conversation {
  return {
    id: `c-${uuidv4()}`,
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

export function ChatPage() {
  const navigate = useNavigate();
  const session = null;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [streaming, setStreaming] = useState<ChatMessage | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAssistantMessage, setLoadingAssistantMessage] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const active = useMemo<Conversation | undefined>(
      () => conversations.find((c) => c.id === activeId) ?? conversations[0],
      [conversations, activeId]
    );

  useEffect(() => {
    if (localStorage.getItem("access.token")==null) navigate({ to: "/login" });
  }, []);

  const loadConversations = async () => {
      try {
        const data: ConversationResponse = await agentClient.getConversationHistory();
        const parsed = mapConversationHistory(data);

        if (parsed.length > 0) {
          // ✅ On met à jour activeId en même temps pour qu'il pointe
          // vers une conversation qui existe réellement dans parsed
          setConversations(parsed);
          setActiveId(parsed[0].id);
        } else {
          const c = newConv();
          setConversations([c]);
          setActiveId(c.id);
        }
      } catch {
        // Fallback : on crée une conv vide pour ne pas bloquer l'UI
        const c = newConv();
        setConversations([c]);
        setActiveId(c.id);
      } finally {
        setLoading(false);
      }
    };
  
 useEffect(() => {
    loadConversations();
  }, []);

  const updateActive = (fn: (c: Conversation) => Conversation) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? fn(c) : c)),
    );
  };

  const sendMessage = async (text: string) => {
    setLoadingAssistantMessage(true);
    const userMsg: ChatMessage = {
      id: `u-${uuidv4()}`,
      role: "user",
      content: text,
      toolCalls: null
    };
    updateActive((c) => ({
      ...c,
      messages: [...c.messages, userMsg],
      title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
      updatedAt: Date.now(),
    }));
    setBusy(true);
    try {
      const response: ChatResponse = await agentClient.sendChatMessage(text, activeId);
       const assistantMsg: ChatMessage = {
        id: `a-${uuidv4()}`,
        role: "assistant",
        content: response.assistantMessage,
        toolCalls: response.toolCalls
      };
      updateActive((c) => ({
      ...c,
        messages: [...c.messages, assistantMsg],
      }));
    } catch (error) {
      if (error instanceof ChatError) {
        const assistantMsg: ChatMessage = {
        id: `a-${uuidv4()}`,
        role: "assistant",
        content:
          error instanceof ChatError
            ? error.message
            : "An unexpected error occurred.",
        toolCalls: null
      };
        updateActive((c) => ({
      ...c,
        messages: [...c.messages, assistantMsg],
      }));
      }
      if (error instanceof ShouldLoginError) {
        navigate({ to: "/login" });
        return;
      }
   } finally {
    setBusy(false);
    setLoadingAssistantMessage(false);
   }
  };

  const handleNew = () => {
    const c = newConv();
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
  };

  const handleClear = async (conversationId: string) :Promise<void> => {
    try { 
      const result = await agentClient.clearConversationHistory(conversationId);
      if (result?.success) {
        loadConversations();
        setSnackbar({
          open: true,
          message: "Conversation deleted",
        });
        }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error during deleting the conversation",
      });
    }
  };

  const handleRetry = (_id: string) => {
    if (!active) return;
    const lastUser = [...active.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    updateActive((c) => ({ ...c, messages: c.messages.slice(0, -1) }));
    setTimeout(() => sendMessage(lastUser.content), 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("access.token");
    navigate({ to: "/login" });
  };

 // ✅ Garde le rendu suspendu le temps du chargement initial
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100dvh",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <Box sx={{ display: "flex", height: "100dvh", bgcolor: "background.default" }}>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        email="Admin"
        onNew={handleNew}
        onSelect={setActiveId}
        onLogout={handleLogout}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header tenant="demo" />
        
        <ChatPanel
          // ✅ Fallback défensif au cas où active serait undefined pendant une transition
          messages={active?.messages ?? []}
          streamingMessage={streaming}
          busy={busy}
          onSend={sendMessage}
          onClear={handleClear}
          onRetry={handleRetry}
          loadingAssistantMessage={loadingAssistantMessage}
          activeId={activeId}
        />
      </Box>
      
    </Box>
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      message={snackbar.message}
      onClose={() =>
        setSnackbar((prev) => ({
          ...prev,
          open: false,
        }))
      }
    />
  </>
  );
}
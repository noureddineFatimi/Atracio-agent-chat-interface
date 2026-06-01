import { useState, type KeyboardEvent } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import type { ChatMessage } from "@/types/chat";
import { MessageList } from "./MessageList";
import { EmptyState } from "./EmptyState";

interface Props {
  messages: ChatMessage[];
  streamingMessage: ChatMessage | null;
  busy: boolean;
  onSend: (text: string) => void;
  onClear: (conversationId: string) => Promise<void>;
  onRetry: (id: string) => void;
  loadingAssistantMessage: boolean;
  activeId: string;
}
/* const generateConversationsList = (
    conversationResponse: ConversationResponse
  ): Conversation[] => {
    return Object.entries(conversationResponse)
      .map(([id, items]) => {
        // 1. Extraire les métadonnées (items sans role)
        const createdAtRaw = items.find((m) => m.created_at)?.created_at;
        const updatedAtRaw = items.find((m) => m.updated_at)?.updated_at;

        const updatedAt = updatedAtRaw
          ? new Date(updatedAtRaw).getTime()
          : createdAtRaw
          ? new Date(createdAtRaw).getTime()
          : Date.now();

        // 2. Filtrer : garder uniquement les messages visibles
        //    - role user ou assistant
        //    - content non-null (exclut les tool_calls purs)
        //    - sans tool_calls (exclut les requêtes d'outil)
        //    - rôle "tool" exclu (résultats d'outil internes)
        const chatMessages: ChatMessage[] = items
          .filter(
            (m): m is ChatMessageResponse & { role: "user" | "assistant"; content: string } =>
              (m.role === "user" || m.role === "assistant") &&
              m.content != null &&
              m.content.trim() !== "" &&
              !m.tool_calls
          )
          .map((m, index) => ({
            id: `${id}-${index}`,
            role: m.role as MessageRole,
            content: m.content,
          }));

        // 3. Titre = premier message user, tronqué à 50 caractères
        const firstUserMessage = chatMessages.find((m) => m.role === "user");
        const title = firstUserMessage
          ? firstUserMessage.content.length > 50
            ? firstUserMessage.content.slice(0, 47) + "…"
            : firstUserMessage.content
          : "New conversation";

        return { id, title, updatedAt, messages: chatMessages };
      })
      // 4. Tri : plus récente en premier
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }; */

export function ChatPanel({
  messages,
  streamingMessage,
  busy,
  onSend,
  onClear,
  onRetry,
  loadingAssistantMessage,
  activeId
}: Props) {
  const [input, setInput] = useState("");
  const theme = useTheme();

  const send = () => {
    const v = input.trim();
    if (!v || busy) return;
    onSend(v);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      
      {messages.length === 0 && !streamingMessage ? (
        <Box sx={{ flex: 1, display: "flex" }}>
          <EmptyState onPick={(t) => onSend(t)} />
        </Box>
      ) : (
        <MessageList
          messages={messages}
          streamingMessage={streamingMessage}
          onRetry={onRetry}
          loadingAssistantMessage={loadingAssistantMessage}
        />
      )}

      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default",
          px: { xs: 2, md: 4 },
          py: 2,
        }}
      >
        
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
              p: 1,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: "background.paper",
              boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.06)}`,
              transition: "border-color 0.2s",
              "&:focus-within": { borderColor: "primary.main" },
            }}
          >
            
            <TextField
              fullWidth
              multiline
              maxRows={6}
              variant="standard"
              placeholder="Ask about orders, stock, vendors, clients…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              slotProps={{ input: { disableUnderline: true } }}
              sx={{ px: 1.5, py: 1, fontSize: 15 }}
            />
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              {messages.length > 0 && (
                <Tooltip title="Delete conversation">
                  <span>
                    <IconButton onClick={() => onClear(activeId)} disabled={busy} size="small">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              
              <Tooltip title="Send">
                <span>
                  <IconButton
                    onClick={send}
                    disabled={!input.trim() || busy}
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { bgcolor: "primary.dark" },
                      "&.Mui-disabled": {
                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                        color: "primary.contrastText",
                      },
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </span>
                
              </Tooltip>
              {loadingAssistantMessage && <CircularProgress/>}
            </Stack>
            
          </Box>
          
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 1 }}
          >
            Atracio Agent can make mistakes. Verify critical ERP actions before
            confirming.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

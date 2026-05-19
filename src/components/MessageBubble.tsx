import { useState } from "react";
import { Avatar, Box, IconButton, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { ChatMessage } from "@/types/chat";
import { ThinkingBlock } from "./ThinkingBlock";

interface Props {
  message: ChatMessage;
  thinkingActive?: boolean;
  thinkingSteps?: ChatMessage["thinking"];
  onRetry?: () => void;
}

function renderContent(text: string) {
  // light markdown: bold + bullets + line breaks
  return text.split("\n").map((line, i) => {
    const isBullet = /^\s*•/.test(line);
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
    return (
      <Typography
        key={i}
        variant="body1"
        component="div"
        sx={{
          lineHeight: 1.7,
          pl: isBullet ? 1 : 0,
        }}
      >
        {parts.map((p, j) => {
          if (p.startsWith("**") && p.endsWith("**"))
            return <strong key={j}>{p.slice(2, -2)}</strong>;
          if (p.startsWith("*") && p.endsWith("*"))
            return <em key={j}>{p.slice(1, -1)}</em>;
          return <span key={j}>{p}</span>;
        })}
      </Typography>
    );
  });
}

export function MessageBubble({ message, thinkingActive, thinkingSteps, onRetry }: Props) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "flex-start",
        flexDirection: isUser ? "row-reverse" : "row",
        animation: "fadeIn 0.35s ease",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isUser ? "primary.main" : alpha(theme.palette.secondary.main, 0.15),
          color: isUser ? "primary.contrastText" : "secondary.main",
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <AutoAwesomeIcon fontSize="small" />}
      </Avatar>
      <Box sx={{ maxWidth: "min(760px, calc(100% - 60px))", flex: 1 }}>
        {!isUser && thinkingSteps && thinkingSteps.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <ThinkingBlock steps={thinkingSteps} active={!!thinkingActive} />
          </Box>
        )}
        {message.content && (
          <Box
            sx={{
              display: "inline-block",
              maxWidth: "100%",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: isUser ? "primary.main" : "background.paper",
              color: isUser ? "primary.contrastText" : "text.primary",
              border: isUser ? "none" : `1px solid ${theme.palette.divider}`,
              boxShadow: isUser ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            {renderContent(message.content)}
          </Box>
        )}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            alignItems: "center",
            mt: 0.75,
            justifyContent: isUser ? "flex-end" : "flex-start",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {!isUser && message.content && (
            <>
              <Tooltip title={copied ? "Copied" : "Copy"}>
                <IconButton size="small" onClick={copy}>
                  {copied ? (
                    <CheckIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              </Tooltip>
              {onRetry && (
                <Tooltip title="Retry">
                  <IconButton size="small" onClick={onRetry}>
                    <RefreshIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

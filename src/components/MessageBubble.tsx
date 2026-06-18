import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, CircularProgress, IconButton, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { ChatMessage } from "@/types/chat";
import { ThinkingBlock } from "./ThinkingBlock";
import PsychologyIcon from '@mui/icons-material/Psychology';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import DangerousIcon from '@mui/icons-material/Dangerous';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
interface Props {
  message: ChatMessage;
  thinkingActive?: boolean;
  onRetry?: () => void;
  loadingAssistantMessage:boolean;
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

function translateToolNameToBusiness(tool: string) {
  switch (tool) {   
    case "document.search":
      return "Recherche documentaire";
    case "document.get_details":
      return "Détails du document";
    case "document.save_draft":
      return "Enregistrer le brouillon";
    case "document.apply_process_action":
      return "Appliquer une action sur le processus";
    case "wms.get_article_stock_summary":
      return "Résumé du stock d'article";
    case "wms.lookup_inventory_unit":
      return "Rechercher une unité d'inventaire";
    case "partner.get_summary":
      return "Résumé du partenaire";
    default:
      return tool;
  }
}

export function MessageBubble({ message, thinkingActive, onRetry, loadingAssistantMessage }: Props) {
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
        bgcolor: isUser
          ? "primary.main"
          : alpha(theme.palette.secondary.main, 0.15),
        color: isUser
          ? "primary.contrastText"
          : "secondary.main",
      }}
    >
      {isUser ? (
        <PersonIcon fontSize="small" />
      ) : (
        <AutoAwesomeIcon fontSize="small" />
      )}
    </Avatar>

    <Box sx={{ maxWidth: "min(760px, calc(100% - 60px))" }}>
      {/* Message */}
      {message.content && (
        <Box
          sx={{
            marginRight: "16px",
            display: "inline-block",
            maxWidth: "100%",
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser
              ? "primary.contrastText"
              : "text.primary",
            border: isUser
              ? "none"
              : `1px solid ${theme.palette.divider}`,
            boxShadow: isUser
              ? "none"
              : "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {renderContent(message.content)}
        </Box>
      )}

      {/* Raisonnement */}
      {!isUser &&
        message.content &&
        message.toolCalls != null && (
          <Box sx={{ mt: 1 }}>
            <Accordion
              sx={{
                boxShadow: "none",
                backgroundColor: "transparent",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                sx={{
                  minHeight: 0,
                  p: 0,
                  "&.Mui-expanded": {
                    minHeight: 0,
                  },
                  "& .MuiAccordionSummary-content": {
                    flexGrow: 0,
                    margin: 0,
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: 0,
                  },
                }}
              >
                <Typography>Raisonnement</Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  borderLeft: "2px solid",
                  borderColor: "divider",
                  ml: 1,
                  pl: 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {message.toolCalls.map((tool, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>{translateToolNameToBusiness(tool.tool)}</span>

                      {tool.status === "success" ? (
                        <CheckIcon
                          color="success"
                          fontSize="small"
                        />
                      ) : (
                        <DangerousIcon
                          color="error"
                          fontSize="small"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

      {/* Actions */}
      {!isUser && message.content && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 0.5,
            justifyContent: "flex-start",
          }}
        >
          <Tooltip title={copied ? "Copied" : "Copy"}>
            <IconButton size="small" onClick={copy}>
              {copied ? (
                <CheckIcon sx={{ fontSize: 14 }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: 14 }} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  </Stack>
  );
}

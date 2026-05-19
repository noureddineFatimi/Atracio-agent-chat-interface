import { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Stack,
  Typography,
  alpha,
  keyframes,
  useTheme,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { ThinkingStep } from "@/types/chat";

const pulse = keyframes`
  0%,100% { opacity: 0.35; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

interface Props {
  steps: ThinkingStep[];
  active: boolean;
}

export function ThinkingBlock({ steps, active }: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setOpen(false), 800);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (!steps.length) return null;

  const doneCount = steps.filter((s) => s.status === "done").length;
  const label = active
    ? "Thinking…"
    : `Thought through ${doneCount} step${doneCount > 1 ? "s" : ""}`;

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        overflow: "hidden",
        maxWidth: 720,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          px: 1.5,
          py: 1,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <AutoAwesomeIcon
          fontSize="small"
          sx={{
            color: "primary.main",
            animation: active ? `${pulse} 1.4s ease-in-out infinite` : "none",
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            flex: 1,
            ...(active && {
              background: `linear-gradient(90deg, ${alpha(
                theme.palette.text.primary,
                0.5,
              )} 0%, ${theme.palette.text.primary} 50%, ${alpha(
                theme.palette.text.primary,
                0.5,
              )} 100%)`,
              backgroundSize: "400px 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `${shimmer} 2s linear infinite`,
            }),
          }}
        >
          {label}
        </Typography>
        <IconButton size="small">
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Stack>
      <Collapse in={open} timeout={250}>
        <Stack
          spacing={1.25}
          sx={{
            px: 2.25,
            pb: 1.75,
            pt: 0.5,
            borderTop: `1px dashed ${theme.palette.divider}`,
          }}
        >
          {steps.map((s) => (
            <Stack key={s.id} direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.status === "done" ? (
                  <CheckCircleIcon
                    sx={{ fontSize: 14, color: "primary.main" }}
                  />
                ) : s.status === "active" ? (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      animation: `${pulse} 1.1s ease-in-out infinite`,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      border: `1.5px solid ${alpha(theme.palette.text.secondary, 0.4)}`,
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color:
                    s.status === "pending" ? "text.secondary" : "text.primary",
                  opacity: s.status === "pending" ? 0.7 : 1,
                }}
              >
                {s.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}

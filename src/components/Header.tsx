import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import { useColorMode } from "@/theme-provider";

interface Props {
  tenant: string;
}

export function Header({ tenant }: Props) {
  const theme = useTheme();
  const { mode, toggle } = useColorMode();

  return (
    <Box
      sx={{
        height: 60,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 3 },
        bgcolor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          Atracio Agent
        </Typography>
        <Typography variant="caption" color="text.secondary">
          AI-powered ERP & Logistics Assistant
        </Typography>
      </Box>
      <Stack
        direction="row"
        spacing={1.25}
        sx={{ alignItems: "center" }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "success.main",
              boxShadow: `0 0 0 4px ${alpha(theme.palette.success.main, 0.18)}`,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Connected
          </Typography>
        </Stack>
        <Chip
          label={tenant}
          size="small"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
            border: "none",
          }}
        />
        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
          <IconButton onClick={toggle} size="small">
            {mode === "dark" ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

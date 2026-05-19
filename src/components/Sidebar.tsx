import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Conversation } from "@/types/chat";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  email: string;
  onNew: () => void;
  onSelect: (id: string) => void;
  onLogout: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  email,
  onNew,
  onSelect,
  onLogout,
}: Props) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        spacing={1.25}
        sx={{ alignItems: "center", px: 2.25, py: 2 }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "#fff",
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            Atracio
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Agent
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNew}
        >
          New conversation
        </Button>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ px: 2.5, fontSize: 11, letterSpacing: "0.1em" }}
        >
          Recent
        </Typography>
        <List dense sx={{ px: 1 }}>
          {conversations.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ px: 1.5, py: 1 }}
            >
              No conversations yet.
            </Typography>
          )}
          {conversations.map((c) => (
            <ListItemButton
              key={c.id}
              selected={c.id === activeId}
              onClick={() => onSelect(c.id)}
              sx={{
                borderRadius: 1.5,
                mb: 0.25,
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.14),
                  },
                },
              }}
            >
              <ChatBubbleOutlineIcon
                sx={{ fontSize: 16, mr: 1.25, color: "text.secondary" }}
              />
              <ListItemText
                primary={c.title}
                slotProps={{
                  primary: {
                    variant: "body2",
                    noWrap: true,
                    sx: { fontWeight: c.id === activeId ? 600 : 400 },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider />
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", px: 2, py: 1.5 }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
          {email.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tenant · demo
          </Typography>
        </Box>
        <IconButton size="small" onClick={onLogout} aria-label="Logout">
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}

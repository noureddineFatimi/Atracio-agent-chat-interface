import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontIcon from "@mui/icons-material/StorefrontOutlined";

const suggestions = [
  { icon: <ReceiptIcon />, text: "Show me recent purchase orders from Global Vendor" },
  { icon: <InventoryIcon />, text: "What's the stock of article A-100?" },
  { icon: <LocalShippingIcon />, text: "Release sales order SO-000101" },
  { icon: <StorefrontIcon />, text: "List overdue invoices for Northwind Logistics" },
];

interface Props {
  onPick: (text: string) => void;
}

export function EmptyState({ onPick }: Props) {
  const theme = useTheme();
  return (
    <Stack
      spacing={4}
      sx={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "#fff",
          boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 32 }} />
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          How can I help with your ERP today?
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520, mx: "auto" }}>
          Ask about purchase orders, sales orders, vendors, clients, warehouses
          or inventory movements.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
          maxWidth: 720,
          width: "100%",
        }}
      >
        {suggestions.map((s) => (
          <Stack
            key={s.text}
            direction="row"
            spacing={1.5}
            onClick={() => onPick(s.text)}
            sx={{
              alignItems: "center",
              p: 1.75,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                transform: "translateY(-1px)",
              },
            }}
          >
            <Box sx={{ color: "primary.main", display: "flex" }}>{s.icon}</Box>
            <Typography variant="body2">{s.text}</Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}

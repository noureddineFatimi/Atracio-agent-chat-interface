import { Box, Stack, keyframes } from "@mui/material";

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
`;

export function TypingIndicator() {
  return (
    <Stack direction="row" spacing={0.6} sx={{ px: 1, py: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "text.secondary",
            animation: `${bounce} 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </Stack>
  );
}

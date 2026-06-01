import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { atracioAuthClient } from "@/services/atracioAuthClient";

export function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState<"login" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading("login");
    setError(null);
    try {
      const auth_result = await atracioAuthClient.login(
      email,
      password,
      remember
      );
      auth_result.success ? navigate({ to: "/chat" }) : setError(auth_result.errorMessage);
    } catch (error) {
      setError("An error occured, please try again");
    }
    setLoading(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? `radial-gradient(1200px 600px at 10% -10%, ${alpha(
                theme.palette.primary.main,
                0.25,
              )}, transparent), radial-gradient(900px 500px at 110% 110%, ${alpha(
                theme.palette.secondary.main,
                0.18,
              )}, transparent), ${theme.palette.background.default}`
            : `radial-gradient(1200px 600px at 10% -10%, ${alpha(
                theme.palette.primary.main,
                0.15,
              )}, transparent), radial-gradient(900px 500px at 110% 110%, ${alpha(
                theme.palette.secondary.main,
                0.12,
              )}, transparent), ${theme.palette.background.default}`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 30px 80px ${alpha(theme.palette.primary.main, 0.18)}`,
          animation: "rise 0.6s ease",
          "@keyframes rise": {
            from: { opacity: 0, transform: "translateY(12px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        
        <Stack spacing={3}>
          <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "#fff",
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              
              <AutoAwesomeIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome to Atracio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered ERP and Logistics Assistant
            </Typography>
          </Stack>
          <form onSubmit={(e) => submit(e)}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                label="Username or email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Password"
                type={showPw ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPw((s) => !s)}
                        >
                          {showPw ? (
                            <VisibilityOffOutlined fontSize="small" />
                          ) : (
                            <VisibilityOutlined fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2">Remember me</Typography>
                  }
                />
              </Stack>
              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={loading !== null}
                sx={{ py: 1.25 }}
              >
                {loading === "login" ? "Signing in…" : "Sign in"}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Protected by Atracio Agent Identity · v1.0
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

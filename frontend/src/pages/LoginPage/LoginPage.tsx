import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../../components/FormInput";
import { FormImageUpload } from "../../components/FormImageUpload";
import { Box, Typography, Button, Link, Divider } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import AppAlert from "../../components/Alert";
import { AxiosError } from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../hooks/useAuth";

const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
});

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePicture: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Image is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;
type AuthForm = LoginForm | SignupForm;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const { login, register: registerUser } = useAuth();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "success" | "info" | "warning"
  >("error");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AuthForm>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: AuthForm) => {
    setLoading(true);

    try {
      if (isLogin) {
        await login(data as LoginForm);

        setAlertMessage("Login successful!");
        setAlertSeverity("success");
        setAlertOpen(true);

        navigate("/");
      } else {
        const signupData = data as SignupForm;

        await registerUser({
          ...signupData,
          profilePicture: signupData.profilePicture?.[0],
        });

        setAlertMessage("Account created successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
        setIsLogin(true);
      }
    } catch (err) {
      let message = "Oops, something went wrong. Try again later.";

      if (err instanceof AxiosError) {
        const backendMessage =
          err.response?.data?.error || err.response?.data;

        if (backendMessage) {
          message = backendMessage;
        }
      }

      setAlertMessage(message);
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
          backgroundColor: "#FFF4EB",
        }}
      >
        <Box
          component="img"
          src="/chef.png"
          alt="Logo"
          sx={{ width: 220, height: 220, mb: 3 }}
        />

        <Typography variant="h3" fontWeight={700} color="primary.main" mb={2}>
          Recip-Ease
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 380 }}
        >
          Discover, share, and savor recipes from home cooks around the world.
          Your culinary journey starts here.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            width: 380,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
            {isLogin ? "Welcome back" : "Create Account"}
          </Typography>

          {!isLogin && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 3 }}
            >
              Join the community and start sharing recipes.
            </Typography>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {!isLogin && (
              <Box marginTop={2}>
                <FormImageUpload<AuthForm>
                  name="profilePicture"
                  control={control}
                  size={130}
                  round
                />
              </Box>
            )}
            <FormInput<AuthForm>
              name="username"
              control={control}
              label="Username"
              icon={<PersonOutlineIcon sx={{ color: "gray" }} />}
            />
            {!isLogin && (
              <FormInput<AuthForm>
                name="email"
                control={control}
                label="Email address"
                type="email"
                icon={<MailOutlineIcon sx={{ color: "gray" }} />}
              />
            )}
            <FormInput<AuthForm>
              name="password"
              control={control}
              label="Password"
              type="password"
              icon={<LockOutlinedIcon sx={{ color: "gray" }} />}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isValid}
              sx={{
                mt: 3,
                bgcolor: "primary.main",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "primary.dark" },
                py: 1.2,
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <Divider sx={{ my: 3, color: "text.secondary" }}>or</Divider>

          <Typography textAlign="center">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              underline="hover"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </Link>
          </Typography>
        </Box>
      </Box>

      <AppAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />
    </Box>
  );
}
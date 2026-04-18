import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import AppAlert from "../../components/Alert/Alert";
import { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";
import AuthBranding from "../../components/AuthBrand/AuthBrand";
import AuthForm from "../../components/AuthForm/AuthForm";

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
export type FormSchema = LoginForm | SignupForm;

export type { LoginForm, SignupForm };

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login, register: registerUser, loginWithGoogle, isAuthenticated } = useAuth();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info" | "warning">("error");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { isValid } } = useForm<FormSchema>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormSchema) => {
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
        await registerUser({ ...signupData, profilePicture: signupData.profilePicture?.[0] });
        setAlertMessage("Account created successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
        setIsLogin(true);
      }
    } catch (err) {
      let message = "Oops, something went wrong. Try again later.";
      if (err instanceof AxiosError) {
        const backendMessage = err.response?.data?.error || err.response?.data;
        if (backendMessage) message = backendMessage;
      }
      setAlertMessage(message);
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      await loginWithGoogle(idToken);
      navigate("/");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setAlertMessage("Google sign-in failed. Please try again.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      <AuthBranding />
      <AuthForm
        isLogin={isLogin}
        control={control}
        handleSubmit={handleSubmit}
        isValid={isValid}
        loading={loading}
        onSubmit={onSubmit}
        onToggleMode={() => setIsLogin(!isLogin)}
        onGoogleSignIn={handleGoogleSignIn}
      />
      <AppAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />
    </Box>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../components/FormInput";
import { FormImageUpload } from "../components/FormImageUpload";
import { Box, Typography, Button, Link, Divider } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AuthForm>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: "onChange",
  });

  const onSubmit = (data: AuthForm) => {
    if (isLogin) {
      console.log("Login:", data);
    } else {
      const signupData = data as SignupForm;
      console.log("Signup:", {
        ...signupData,
        profilePicture: signupData.profilePicture?.[0],
      });
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
              <Box display="flex" alignItems="flex-start" gap={3}>
                <Box flex={1} display="flex" flexDirection="column">
                  <FormInput<AuthForm>
                    name="firstName"
                    control={control}
                    label="First Name"
                    icon={<PersonOutlineIcon sx={{ color: "gray" }} />}
                  />
                  <FormInput<AuthForm>
                    name="lastName"
                    control={control}
                    label="Last Name"
                    icon={<PersonOutlineIcon sx={{ color: "gray" }} />}
                  />
                </Box>
                <Box marginTop={2}>
                    <FormImageUpload<AuthForm>
                    name="profilePicture"
                    control={control}
                    size={130}
                    round
                    />
                </Box>
              </Box>
            )}

            <FormInput<AuthForm>
              name="email"
              control={control}
              label="Email address"
              type="email"
              icon={<MailOutlineIcon sx={{ color: "gray" }} />}
            />

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
                "&:hover": { bgcolor: "primary.dark" },
                py: 1.2,
                fontWeight: 600,
              }}
            >
              {isLogin ? "Sign In" : "Sign Up"}
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
    </Box>
  );
}
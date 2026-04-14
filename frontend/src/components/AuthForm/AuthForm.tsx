import { Box, Typography, Button, Link, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { FormInput } from "../FormInput/FormInput";
import { FormImageUpload } from "../FormImageUpload/FormImageUpload";
import type { Control, SubmitHandler } from "react-hook-form";
import type { FormSchema as AuthFormType } from "../../pages/LoginPage/LoginPage";
import { container, card, submitButton } from "./styles";
import GoogleSignInButton from "../GoogleSignInButton/GoogleSignInButton";

interface AuthFormProps {
  isLogin: boolean;
  control: Control<AuthFormType>;
  handleSubmit: (cb: SubmitHandler<AuthFormType>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isValid: boolean;
  loading: boolean;
  onSubmit: SubmitHandler<AuthFormType>;
  onToggleMode: () => void;
  onGoogleSignIn: (idToken: string) => Promise<void>;
}

const AuthForm = ({ isLogin, control, handleSubmit, isValid, loading, onSubmit, onToggleMode, onGoogleSignIn }: AuthFormProps) => {
  return (
    <Box sx={container}>
      <Box sx={card}>
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          {isLogin ? "Welcome back" : "Create Account"}
        </Typography>

        {!isLogin && (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Join the community and start sharing recipes.
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <Box marginTop={2}>
              <FormImageUpload<AuthFormType>
                name="profilePicture"
                control={control}
                size={130}
                round
              />
            </Box>
          )}
          <FormInput<AuthFormType>
            name="username"
            control={control}
            label="Username"
            icon={<PersonOutlineIcon sx={{ color: "gray" }} />}
          />
          {!isLogin && (
            <FormInput<AuthFormType>
              name="email"
              control={control}
              label="Email address"
              type="email"
              icon={<MailOutlineIcon sx={{ color: "gray" }} />}
            />
          )}
          <FormInput<AuthFormType>
            name="password"
            control={control}
            label="Password"
            type="password"
            icon={<LockOutlinedIcon sx={{ color: "gray" }} />}
          />

          <Button type="submit" variant="contained" fullWidth disabled={!isValid} sx={submitButton}>
            {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <Divider sx={{ my: 3, color: "text.secondary" }}>or</Divider>

        <GoogleSignInButton onCredential={onGoogleSignIn} />

        <Typography textAlign="center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link underline="hover" sx={{ cursor: "pointer" }} onClick={onToggleMode}>
            {isLogin ? "Sign Up" : "Log In"}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthForm;
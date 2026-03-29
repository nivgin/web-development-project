import { Box, Typography, Button, IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router";
import logo from "/chef.png";
import { Home, User, ChefHat, LogOut, Plus } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import {
  navbarContainerStyle,
  logoContainerStyle,
  linksContainerStyle,
  navButtonStyle,
  logoutButtonStyle,
  newRecipeButtonStyle,
} from "./styles";
import { useAuth } from "../../hooks/useAuth";

export const NavBar = () => {
    const { logout } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
  const { pathname } = useLocation();

  const navigationMap = {
    feed: {
        path: "/",
        icon: Home,
        text: "Feed",
    },
    askChef: {
        path: "/search",
        icon: ChefHat,
        text: "Ask the Chef",
    },
    profile: {
        path: "/profile",
        icon: User,
        text: "Profile",
    },
    };


  const handleLogout = async () => {
    await logout()
  };

  return (
    <Box sx={navbarContainerStyle}>
      <Box sx={logoContainerStyle}>
        <Box component="img" sx={{ width: "60px" }} src={logo} />
        <Typography variant="h5" fontWeight="bold">
          Recip-Ease
        </Typography>
      </Box>

      <Box sx={linksContainerStyle}>
        {Object.values(navigationMap).map(({ path, icon: Icon, text }, index) => {
        const isActive = pathname === path;

        return (
            <Button
            key={index}
            component={Link}
            to={path}
            sx={navButtonStyle(isActive)}
            >
            <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.8}
                color={isActive ? theme.palette.primary.main : theme.palette.text.secondary}
            />

            <Typography
                variant="body1"
                fontWeight={600}
                color={isActive ? "primary.main" : "text.secondary"}
            >
                {text}
            </Typography>
            </Button>
        );
        })}



      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button variant="contained" size="medium" sx={newRecipeButtonStyle} onClick={() => navigate("/upload")}>
          <Plus size={18} />
          New Recipe
        </Button>
        <IconButton onClick={handleLogout} sx={logoutButtonStyle}>
          <LogOut size={26} />
        </IconButton>
      </Box>
    </Box>
  );
};
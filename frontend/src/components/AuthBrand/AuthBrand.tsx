import { Box, Typography } from "@mui/material";
import { container, logo, title, subtitle } from "./styles";

const AuthBranding = () => {
  return (
    <Box sx={container}>
      <Box component="img" src="/chef.png" alt="Logo" sx={logo} />
      <Typography variant="h3" sx={title}>
        Recip-Ease
      </Typography>
      <Typography variant="h6" sx={subtitle}>
        Discover, share, and savor recipes from home cooks around the world.
        Your culinary journey starts here.
      </Typography>
    </Box>
  );
};

export default AuthBranding;
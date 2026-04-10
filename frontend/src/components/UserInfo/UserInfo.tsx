import { Avatar, Box, Button, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/User";
import { root, avatar, name, email, textGroup, userDetails, editButton } from "./styles";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  const navigate = useNavigate();

  return (
    <Box sx={root}>
      <Box sx={userDetails}>
        <Avatar src={user.pfpUrl} alt={user.username} sx={avatar} />
        <Box sx={textGroup}>
          <Typography variant="h6" sx={name}>
            {user.username}
          </Typography>
          <Typography variant="body2" sx={email}>
            {user.email}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        disableElevation
        startIcon={<SettingsIcon />}
        onClick={() => navigate("/profile/update")}
        sx={editButton}
      >
        Edit Profile
      </Button>
    </Box>
  );
}

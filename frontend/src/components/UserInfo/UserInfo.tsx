import { Avatar, Box, Typography } from "@mui/material";
import type { User } from "../../types/User";
import { root, avatar, name, email, textGroup } from "./styles";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <Box sx={root}>
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
  );
}

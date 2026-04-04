import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAPI } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import UserInfo from "../../components/UserInfo/UserInfo";

export default function ProfilePage() {
  const api = useAPI();
  const { user: userId } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.users.getUserById(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "80px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "lg", mt: "80px", mx: "auto"}}>
      {user && <UserInfo user={user} />}
    </Box>
  );
}

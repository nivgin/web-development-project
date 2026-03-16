import { Box, Skeleton } from "@mui/material";
import { root, avatar, lines } from "./styles";

export default function ChefThinkingLoader() {
  return (
    <Box sx={root}>
      <Box component="img" src="/chef.png" alt="Chef" sx={avatar} />
      <Box sx={lines}>
        <Skeleton variant="rounded" width={224} height={14} />
        <Skeleton variant="rounded" width={160} height={14} />
      </Box>
    </Box>
  );
}
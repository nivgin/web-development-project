import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { container, icon, primaryText, secondaryText } from "./styles";

const FeedEnd = () => {
  return (
    <Box sx={container}>
      <CheckCircleOutlineIcon sx={icon} />
      <Typography variant="body2" sx={primaryText}>
        You're all caught up!
      </Typography>
      <Typography variant="caption" sx={secondaryText}>
        No more recipes to show
      </Typography>
    </Box>
  );
};

export default FeedEnd;
import { Box, Typography } from "@mui/material";
import SearchBar from "../Searchbar/Searchbar";
import { container, title, subtitle } from "./styles";

interface HeroSectionProps {
  onSearch: (value: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <Box sx={container}>
      <Typography variant="h3" sx={title}>
        Discover Recipes
      </Typography>

      <Typography variant="subtitle1" sx={subtitle}>
        Beautiful dishes from home cooks around the world.
      </Typography>
      <SearchBar onSearch={onSearch} />
    </Box>
  );
};

export default HeroSection;
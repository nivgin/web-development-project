import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { wrapper, submitBtn } from "./styles";

interface SearchBarProps {
  onSearch: (value: string) => void;
  onSubmit?: () => void;
  value?: string;
  placeholder?: string;
}

const SearchBar = ({ onSearch, onSubmit, value, placeholder }: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit?.();
  };

  return (
    <Box sx={wrapper}>
      <TextField
        fullWidth
        placeholder={placeholder ?? "Search recipes..."}
        variant="outlined"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: onSubmit ? (
            <InputAdornment position="end">
              <IconButton onClick={onSubmit} sx={submitBtn} size="small">
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
    </Box>
  );
};

export default SearchBar;

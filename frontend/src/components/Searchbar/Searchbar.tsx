import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { wrapper } from "./styles";

const SearchBar = () => {
  return (
    <Box sx={wrapper}>
      <TextField
        fullWidth
        placeholder="Search recipes..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
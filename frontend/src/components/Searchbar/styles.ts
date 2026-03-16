import type { SxProps } from "@mui/material";

export const wrapper: SxProps = {
  maxWidth: 500,
  mx: 'auto',
  py: 2,
  "& .MuiOutlinedInput-root": {
    backgroundColor: 'background.paper',
    borderRadius: 1,

    "& fieldset": {
      borderColor: 'grey.400',
    },

    "&:hover fieldset": {
      borderColor: 'grey.600',
    },

    "&.Mui-focused fieldset": {
      borderColor: 'primary.main',
      borderWidth: 2,
    },
  },
};

export const submitBtn = {
  backgroundColor: "primary.main",
  color: "#f9f7f5",
  borderRadius: "8px",
  width: 32,
  height: 32,
  "&:hover": {
    backgroundColor: "primary.dark",
  },
};
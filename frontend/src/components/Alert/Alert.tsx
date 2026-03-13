import { Snackbar, Alert } from "@mui/material";

interface AppAlertProps {
  open: boolean;
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  onClose: () => void;
}

export default function AppAlert({
  open,
  message,
  severity = "error",
  onClose,
}: AppAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={onClose} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
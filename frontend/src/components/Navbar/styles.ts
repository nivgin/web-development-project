export const navbarContainerStyle = {
  width: "100%",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 3,
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "background.paper",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 100,
};

export const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  color: "text.secondary"
};

export const linksContainerStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: 3,
};

export const navButtonStyle = (active: boolean) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  padding: "8px 14px",
  borderRadius: "12px",
  minWidth: "fit-content",

  color: active ? "primary.main" : "text.secondary",

  backgroundColor: active ? "#f6eae4" : "transparent",

  "&:hover": {
    backgroundColor: active ? "#f6eae4" : "#e0e0e0",
  },
});



export const logoutButtonStyle = {
  color: "#333",
  "&:hover": {
    color: "red",
  },
};

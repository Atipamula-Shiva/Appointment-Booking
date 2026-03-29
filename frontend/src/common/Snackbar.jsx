import { Snackbar, Alert, Slide } from "@mui/material";
import { createContext, useContext, useState } from "react";

// Create Snackbar Context
const SnackbarContext = createContext();

// Slide transition for smooth animation
const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

// Snackbar Provider Component
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
    duration: 4000,
    vertical: "top",
    horizontal: "center",
  });

  const showSnackbar = (message, severity = "success", duration = 4000) => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration,
      vertical: "top",
      horizontal: "center",
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    hideSnackbar();
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleClose}
        anchorOrigin={{
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal,
        }}
        TransitionComponent={SlideTransition}
        sx={{
          "& .MuiSnackbar-root": {
            zIndex: 9999,
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            minWidth: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "14px",
            fontWeight: "500",
            alignItems: "center",
            "& .MuiAlert-icon": {
              fontSize: "20px",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use snackbar
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }
  return context;
};

export default useSnackbar;
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { ToggleContext, ToggleContextType } from "../../context/ToggleProvider";

const Toast = (): JSX.Element => {
  const context = useContext(ToggleContext);
  const theme = context?.theme;

  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        // Default options for all toasts
        className: "font-edu font-medium border-2",
        style: {
          background: theme ? "#0f172a" : "#ffffff", // Dark: Slate, Light: White
          color: theme ? "#00ffa5" : "#111827",      // Dark: Primary Green, Light: Dark Text
          border: `2px solid ${theme ? "#00ffa5" : "#111827"}`,
          boxShadow: `0 0 10px 2px ${theme ? "rgba(0, 255, 165, 0.2)" : "rgba(17, 24, 39, 0.1)"}`,
          borderRadius: "12px",
          padding: "16px",
          fontSize: "1rem",
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: "#00ffa5",
            secondary: "#0f172a",
          },
          style: {
            borderColor: "#00ffa5",
            boxShadow: `0 0 10px 2px rgba(0, 255, 165, 0.3)`,
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
          style: {
            borderColor: "#ef4444",
            color: theme ? "#ef4444" : "#ef4444",
            boxShadow: `0 0 10px 2px rgba(239, 68, 68, 0.3)`,
          },
        },
        loading: {
          style: {
            borderColor: "#60a5fa", // Blue-ish for loading
            color: theme ? "#60a5fa" : "#1d4ed8",
            boxShadow: `0 0 10px 2px rgba(96, 165, 250, 0.3)`,
          },
        },
      }}
    />
  );
};

export default Toast;

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
        className: "font-edu font-medium",
        style: {
          background: theme ? "#0f172a" : "#ffffff", // Dark: Slate, Light: White
          color: theme ? "#e2e8f0" : "#111827",      // Dark: Light Gray, Light: Dark Text
          border: `1px solid ${theme ? "#1e293b" : "#e5e7eb"}`, // Subtle border
          boxShadow: theme ? "0 4px 6px -1px rgba(0, 0, 0, 0.5)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
        loading: {
          iconTheme: {
            primary: "#60a5fa",
            secondary: "#ffffff",
          }
        },
      }}
    />
  );
};

export default Toast;

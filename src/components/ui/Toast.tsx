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
          boxShadow: `0 0 5px 2px ${theme ? "#00ffa5" : "#111827"}`,
          borderRadius: "12px",
          padding: "16px",
          fontSize: "1rem",
        },
        success: {
          duration: 5000,
          iconTheme: {
            primary: "#00ffa5",
            secondary: theme ? "#0f172a" : "#ffffff",
          },
          style: {
            borderColor: "#00ffa5",
            boxShadow: `0 0 5px 2px #00ffa5`,
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: theme ? "#0f172a" : "#ffffff",
          },
          style: {
            borderColor: "#0f172a",
            color: theme ? "#ef4444" : "#ef4444",
            boxShadow: `0 0 5px 2px #ef4444`,
          },
        },
        loading: {
          style: {
            borderColor: "#0f172a", // Blue-ish for loading
            color: theme ? "#60a5fa" : "#1d4ed8",
            boxShadow: `0 0 5px 2px #60a5fa`,
          },
          iconTheme: {
            primary: "#60a5fa",
            secondary: theme ? "#0f172a" : "#ffffff",
          }
        },
      }}
    />
  );
};

export default Toast;

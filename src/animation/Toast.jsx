import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { ToggleContext } from "../context/ToggleProvider";

const Toast = () => {
      const { theme } = useContext(ToggleContext);
    return (
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={15000}
        toastOptions={{
          success: {
            duration: 5000,
            iconTheme: {
              primary: "#00ffa5",
              secondary: "#111827",
            },
            className:
              "font-edu text-[#111827] dark:text-white font-medium border-2 border-[#111827]",
            style: {
              boxShadow: `0 0 5px 2px #00ffa5`,
              borderRadius: "12px",
              cursor: "pointer",
              padding: "16px",
              background: `${theme ? "#111827" : "white"}`,
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#111827",
            },
            className:
              "font-edu text-[#111827] dark:text-white font-medium border-2 border-[#111827]",
            style: {
              boxShadow: `0 0 5px 2px #ef4444`,
              borderRadius: "12px",
              cursor: "pointer",
              padding: "16px",
              background: `${theme ? "#111827" : "white"}`,
            },
          },
        }}
      />
    );
};

export default Toast;
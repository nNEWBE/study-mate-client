import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import AuthProvider from "./context/AuthProvider";
import ToggleProvider from "./context/ToggleProvider";
import Cursor from "./animation/Cursor";
import { AnimatePresence } from "framer-motion";
import Toast from "./animation/Toast";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AnimatePresence mode="wait">
      <AuthProvider>
        <ToggleProvider>
          <RouterProvider router={router} />
          <Cursor />
          <Toast />
        </ToggleProvider>
      </AuthProvider>
    </AnimatePresence>
);

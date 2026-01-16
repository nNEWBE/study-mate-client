import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import AuthProvider from "./context/AuthProvider";
import ToggleProvider from "./context/ToggleProvider";

import { AnimatePresence } from "framer-motion";
import Toast from "./components/ui/Toast";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import "primeicons/primeicons.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ModalProvider } from "./components/ui/Modal";
import WelcomeModalHandler from "./components/WelcomeModalHandler";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <AnimatePresence mode="wait">
    <Provider store={store}>
      <AuthProvider>
        <ToggleProvider>
          <ModalProvider>
            <WelcomeModalHandler />
            <RouterProvider router={router} />
            <Toast />
          </ModalProvider>
        </ToggleProvider>
      </AuthProvider>
    </Provider>
  </AnimatePresence>
);


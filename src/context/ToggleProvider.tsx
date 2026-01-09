import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface ToggleContextType {
  theme: boolean | null;
  setTheme: React.Dispatch<React.SetStateAction<boolean | null>>;
  overflow: boolean;
  setOverflow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleContext = createContext<ToggleContextType | null>(null);

export const useToggle = (): ToggleContextType => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("useToggle must be used within a ToggleProvider");
  }
  return context;
};

interface ToggleProviderProps {
  children: ReactNode;
}

const ToggleProvider = ({ children }: ToggleProviderProps): JSX.Element => {
  const [theme, setTheme] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      const userTheme = localStorage.getItem("theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      // Return true for dark, false for light
      return userTheme === "dark" || (!userTheme && systemTheme);
    }
    return false;
  });
  const [overflow, setOverflow] = useState<boolean>(false);

  useEffect(() => {
    const html = document.documentElement.classList;
    if (theme) {
      html.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <ToggleContext.Provider value={{ theme, setTheme, overflow, setOverflow }}>
      {children}
    </ToggleContext.Provider>
  );
};

export default ToggleProvider;

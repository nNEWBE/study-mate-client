import { createContext, useEffect, useState, ReactNode } from "react";

export interface ToggleContextType {
  theme: boolean | null;
  setTheme: React.Dispatch<React.SetStateAction<boolean | null>>;
  overflow: boolean;
  setOverflow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleContext = createContext<ToggleContextType | null>(null);

interface ToggleProviderProps {
  children: ReactNode;
}

const ToggleProvider = ({ children }: ToggleProviderProps): JSX.Element => {
  const [theme, setTheme] = useState<boolean | null>(null);
  const [overflow, setOverflow] = useState<boolean>(false);

  useEffect(() => {
    const userTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const html = document.documentElement.classList;

    if (userTheme === "dark" || (!userTheme && systemTheme)) {
      html.add("dark");
      setTheme(true);
      return;
    }
    setTheme(false);
  }, []);

  useEffect(() => {
    const html = document.documentElement.classList;

    if (html.contains("dark")) {
      html.remove("dark");
      localStorage.setItem("theme", "light");
      return;
    }
    html.add("dark");
    localStorage.setItem("theme", "dark");
  }, [theme]);

  return (
    <ToggleContext.Provider value={{ theme, setTheme, overflow, setOverflow }}>
      {children}
    </ToggleContext.Provider>
  );
};

export default ToggleProvider;
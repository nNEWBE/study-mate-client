import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";


export const ToggleContext=createContext(null);

const ToggleProvider = ({children}) => {
    
    const [theme, setTheme] = useState(null);
    const [overflow, setOverflow] = useState(false);

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
      <ToggleContext.Provider
        value={{theme, setTheme,overflow,setOverflow }}
      >{children}</ToggleContext.Provider>
    );
};

export default ToggleProvider;

ToggleProvider.propTypes = {
  children: PropTypes.node,
};
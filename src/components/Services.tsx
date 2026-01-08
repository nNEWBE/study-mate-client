import { IoSunny } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import "../styles/style.css";
import { useToggle } from "../context/ToggleProvider";

const Services = () => {
  const { theme, setTheme } = useToggle();
  const handleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDark = e.target.checked;
    setTheme(isDark);
  };
  return (
    <div
      className="flex h-screen items-center justify-center gap-20 bg-cyan-400"
      id="Services"
    >
      <div>
        <input
          onChange={handleTheme}
          checked={theme === null ? false : theme}
          type="checkbox"
          id="darkmode-toggle"
          className="toggle-input"
        />
        <label htmlFor="darkmode-toggle" className="toggle-label">
          <IoSunny className="sun" />
          <IoMoon className="moon" />
        </label>
      </div>

      <div>
        <div className="checkbox-wrapper">
          <input type="checkbox" id="input-1" className="check-input" />
          <label htmlFor="input-1" className="checkbox">
            <svg viewBox="0 0 22 16" fill="none">
              <path d="M1 6.85L8.09677 14L21 1" />
            </svg>
          </label>
          <label htmlFor="input-1" className="ml-4">
            HTML
          </label>
        </div>
        <div className="checkbox-wrapper">
          <input type="checkbox" id="input-2" className="check-input" />
          <label htmlFor="input-2" className="checkbox">
            <svg viewBox="0 0 22 16" fill="none">
              <path d="M1 6.85L8.09677 14L21 1" />
            </svg>
          </label>
          <span>CSS</span>
        </div>
        <div className="checkbox-wrapper">
          <input type="checkbox" id="input-3" className="check-input" />
          <label htmlFor="input-3" className="checkbox">
            <svg viewBox="0 0 22 16" fill="none">
              <path d="M1 6.85L8.09677 14L21 1" />
            </svg>
          </label>
          <span>JavaScript</span>
        </div>
      </div>
    </div>
  );
};

export default Services;

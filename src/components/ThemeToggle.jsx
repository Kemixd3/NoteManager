import { useState } from "react";
import { setTheme, getTheme } from "../ThemeColors";
import "./Toggle.css";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(getTheme() === "night");

  const handleThemeChange = () => {
    const newTheme = isDarkMode ? "day" : "night";
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
  };

  return (
    <div className={`toggle-container ${isDarkMode ? "dark" : "light"}`}>
      <label className="toggle-label" htmlFor="toggle">
        <input
          id="toggle"
          className="toggle-checkbox"
          type="checkbox"
          checked={isDarkMode}
          onChange={handleThemeChange}
        />
        <span className="toggle-slider"></span>
        <span className="toggle-icons">
          <span className="icon-night">🌜</span>
          <span className="icon-day">🌞</span>
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;

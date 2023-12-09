export const colors = {
  night: {
    "--lightest": "#e4e6eb",
    color: "#b0b3b8",
    "--medium": "#3a3b3c",
    "background-color": "#242526",
    "--darker": "#18191a",
  },
  day: {
    "--lightest": "#ffffff",
    "background-color": "#f7f7f7",
    "--medium": "#dfe3ee",
    "--dark": "#8b9dc3",
    color: "black",
    "--darker": "#3b5998",
  },
};

const themes = Object.keys(colors);
const fallback = themes[0];

const getTheme = () => {
  const theme = localStorage.getItem("theme");
  return colors[theme] ? theme : fallback;
};

const saveTheme = (theme = fallback) => localStorage.setItem("theme", theme);

const setColorScheme = (theme = fallback) => {
  Object.entries(colors[theme]).map(([color, value]) => {
    document.body.style.setProperty(color, value);
    if (theme == "night") {
      document.body.classList.add("darkmode");
      document.body.classList.remove("lightmode");
    } else {
      document.body.classList.remove("darkmode");
      document.body.classList.remove("lightmode");
    }
  });
};

const setTheme = (() => {
  // it will load the last saved theme from the local storage
  // or fallback to the first available one
  // and then set it
  // happens on page load once
  setColorScheme(getTheme());

  return (theme) => {
    theme = colors[theme] ? theme : fallback;
    if (getTheme() !== theme) {
      setColorScheme(theme);
      saveTheme(theme);
    }

    return theme;
  };
})();

export { themes, getTheme, setTheme };

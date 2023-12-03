import Router from "../router";
import NavbarDisplay from "./Nav";
import { themes, getTheme, setTheme } from "../ThemeColors";
function AuthenticatedView({
  user,
  userData,
  handleLogout,
  handleThemeChange,
  currentTheme,
}) {
  return (
    <div>
      <NavbarDisplay user={user} userData={userData} />
      <button onClick={handleLogout}>Log out</button>
      <select onChange={handleThemeChange} value={currentTheme}>
        {themes.map((theme, i) => (
          <option key={i} value={theme}>
            {theme}
          </option>
        ))}
      </select>
      <Router user={user} userData={userData} />
    </div>
  );
}

export default AuthenticatedView;

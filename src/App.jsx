import { useState, useEffect } from "react";
//import PropTypes from "prop-types";
import Router from "./router";
import NavbarDisplay from "./components/Nav";
import "./frontcss.css";
import { Navigate } from "react-router-dom";

import { themes, getTheme, setTheme } from "./ThemeColors";
import axios from "axios";
import { setUser, fetchUserData, setUserData } from "./actions/userActions";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userData = useSelector((state) => state.userData.userData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [token, setToken] = useState("");

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(setUser(codeResponse));
      window.localStorage.setItem("emailForSignIn", codeResponse.access_token);
      setToken(codeResponse.access_token);
      dispatch(fetchUserData(codeResponse.access_token));
      // Store user authentication status in local storage
      window.localStorage.setItem("isLoggedIn", "true");
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  //const [darkMode, setDarkMode] = useState(darkModeDefault);
  const logOut = () => {
    googleLogout();
    window.localStorage.removeItem("emailForSignIn");
    dispatch(setUser({}));
  };

  const [currentTheme, nextTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(currentTheme);
    console.log(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      // Redirect to login page if the user is not authenticated
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  //  if (isLoadingUser) {
  //   return <div className="loader"></div>;
  // }

  return (
    <div>
      <div>
        {isLoggedIn ? (
          <div>
            <NavbarDisplay user={user} userData={userData} />
            <button onClick={logOut}>Log out</button>
            <select
              onChange={(event) => nextTheme(event.target.value)}
              value={currentTheme}
            >
              {themes.map((theme, i) => (
                <option key={i} value={theme}>
                  {theme}
                </option>
              ))}
            </select>

            <Router user={user} userData={userData}></Router>
          </div>
        ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
        )}
      </div>
    </div>
  );
}

export default App;

//App.propTypes = {
//  darkModeDefault: PropTypes.bool,
//};

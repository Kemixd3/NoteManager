import { useState, useEffect } from "react";
//import PropTypes from "prop-types";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//import Auth from "./pages/Auth";
import HomePage from "./pages/home";

import Account from "./components/Account";
import StockReceiving from "./pages/scanning";
import { auth } from "./firebaseClient";
import NavbarDisplay from "./components/Nav";
import "./frontcss.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
//import { DarkModeProvider } from "./Context/DarkmodeContext";
import POOversigt from "./oversigt";
import { themes, getTheme, setTheme } from "./ThemeColors";
import { jwtDecode } from "jwt-decode";

console.log("a");

import { useUser } from "./Context/UserContext";

export const App = () => {
  const {
    user,
    setUser,
    userData,
    setUserData,
    isLoadingUser,
    setIsLoadingUser,
  } = useUser();

  //const [darkMode, setDarkMode] = useState(darkModeDefault);

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  function handleCallbackResponse(response) {
    const userObject = jwtDecode(response.credential);

    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    console.log(user.email, "USER??");
  }

  useEffect(() => {
    const signInDiv = document.getElementById("signInDiv");

    const initGoogleSignIn = () => {
      if (
        signInDiv &&
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.initialize({
          client_id: "xxxxxxxx",
          callback: handleCallbackResponse,
        });

        // Check if the element with ID "signInDiv" exists

        if (signInDiv) {
          window.google.accounts.id.renderButton(signInDiv, {
            shape: "pill",
          });
        }
        window.google.accounts.id.prompt();
        console.log("Google Sign-In initialized");
      } else {
        setTimeout(initGoogleSignIn, 100);
      }
    };
    initGoogleSignIn();
  }, []);

  const [currentTheme, nextTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(currentTheme);
    console.log(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoadingUser(true);
        if (user) {
          const getUser = await fetch(
            "http://localhost:3001/users/usersFromEmail/" + user.email
          );

          const response = await getUser.json();
          console.log(response, "her!!!");

          if (response.message !== "User not found") {
            const UserData = {
              userId: user.uid,
              userName: response.user.name,
              userEmail: user.email,
              userImage: response.user.image,
              userOrg: response.user.Organization,
            };
            setUserData(UserData);
            setIsLoadingUser(false);
          } else {
            setIsLoadingUser(true);
            console.log("NOT DIS");
            await fetch("http://localhost:3001/users/post", {
              method: "POST",
              body: JSON.stringify({
                userid: user.sub,
                name: "",
                email: user.email,
                image:
                  "https://media.licdn.com/dms/image/C560BAQHuF4hk-oVm4w/company-logo_200_200/0/1630637919310/uav_components_aps_logo?e=2147483647&v=beta&t=QrkJiLZuMdpNdWvF2jCSGUJZyUs-nrqfsHvXfQJZkrM",
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            });

            setIsLoadingUser(false);
          }
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoadingUser(false);
      }
    };
    if (user) {
      getProfile();
    }
  }, [user]);

  if (isLoadingUser) {
    <div>
      <h1>Not signed in</h1>
    </div>;
  }

  return (
    <div>
      <div id="signInDiv"></div>

      <div>
        {userData && Object.keys(user).length != 0 ? (
          <div>
            <NavbarDisplay user={user} userData={userData} />
            <button onClick={(e) => handleSignOut(e)} />
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
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={<HomePage user={user} userData={userData} />}
                />
                <Route
                  path="/account"
                  element={<Account user={user} userData={userData} />}
                />
                <Route
                  path="/PO"
                  element={<POOversigt userData={userData.userOrg} />}
                />
                <Route
                  path="/scan/:id"
                  element={<StockReceiving user={user} userData={userData} />}
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </div>
        ) : (
          <div id="signInDiv"></div>
        )}
      </div>
    </div>
  );
};

//App.propTypes = {
//  darkModeDefault: PropTypes.bool,
//};

import { useState, useEffect } from "react";
//import PropTypes from "prop-types";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import HomePage from "./pages/home";

import Account from "./components/Account";
import StockReceiving from "./scanning";
import { auth } from "./firebaseClient";
import NavbarDisplay from "./components/Nav";
import "./frontcss.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
//import { DarkModeProvider } from "./Context/DarkmodeContext";
import POOversigt from "./oversigt";
import { themes, getTheme, setTheme } from "./ThemeColors";

export const App = () => {
  //const [darkMode, setDarkMode] = useState(darkModeDefault);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currentTheme, nextTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(currentTheme);
    console.log(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoadingUser(true);
        if (user) {
          const getUser = await fetch(
            "http://localhost:3001/users/users/" + user.uid
          );

          const response = await getUser.json();
          console.log(response, "her");
          if (response.message !== "User not found") {
            const UserData = {
              userId: user.uid,
              userName: response.user.name,
              userEmail: response.user.email,
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
                userid: user.uid,
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
    return <div className="loader"></div>;
  }

  return (
    <div>
      <Provider store={store}>
        <div>
          {userData && user && !isLoadingUser ? (
            <div>
              <NavbarDisplay user={user} userData={userData} />
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
                    element={<HomePage user={user} userData={userData}/>}
                  />
                  <Route
                    path="/account"
                    element={<Account user={user} userData={userData} />}
                  />
                  <Route
                    path="/PO"
                    element={<POOversigt userData={userData.userOrg} />}
                  />
                  <Route path="/scan/:id" element={<StockReceiving  user={user} userData={userData}/>} />

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </BrowserRouter>
            </div>
          ) : (
            <Auth />
          )}
        </div>
      </Provider>
    </div>
  );
};

//App.propTypes = {
//  darkModeDefault: PropTypes.bool,
//};

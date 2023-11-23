import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Account from "./components/Account";
import StockReceiving from "./scanning";
import { auth } from "./firebaseClient";
import NavbarDisplay from "./components/Nav";
import "./frontcss.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { DarkModeProvider } from "./Context/DarkmodeContext";

export const App = ({ darkModeDefault = false }) => {
  const [darkMode, setDarkMode] = useState(darkModeDefault);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userData, setUserData] = useState(null);

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

          if (response.message !== "User not found") {
            const UserData = {
              userId: user.uid,
              userName: response.user.name,
              userEmail: response.user.email,
              userImage: response.user.image,
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
      <DarkModeProvider>
        <Provider store={store}>
          <div>
            {userData && user && !isLoadingUser ? (
              <div>
                <NavbarDisplay
                  user={user}
                  userData={userData}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  className={darkMode ? "darkmode" : undefined}
                />
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/"
                      element={<Account user={user} userData={userData} />}
                    />
                    <Route path="/scan" element={<StockReceiving />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </BrowserRouter>
              </div>
            ) : (
              <Auth />
            )}
          </div>
        </Provider>
      </DarkModeProvider>
    </div>
  );
};

App.propTypes = {
  darkModeDefault: PropTypes.bool,
};

import { useState, useEffect } from "react";
//import PropTypes from "prop-types";
import "./frontcss.css";
import { themes, getTheme, setTheme } from "./ThemeColors";
import axios from "axios";
import AuthenticatedView from "./components/AuthenticatedView";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useUser } from "./Context/UserContext";

function App() {
  const {
    user,
    setUser,
    userData,
    setUserData,
    isLoadingUser,
    setIsLoadingUser,
  } = useUser();
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  const [token, setToken] = useState("");

  const login = useGoogleLogin({
    onSuccess: (codeResponse) =>
      setUser(codeResponse) +
      window.localStorage.setItem("emailForSignIn", codeResponse.access_token) +
      setToken("initial"),

    onError: (error) => console.log("Login Failed:", error),
  });

  //const [darkMode, setDarkMode] = useState(darkModeDefault);
  const logOut = () => {
    googleLogout();
    window.localStorage.removeItem("emailForSignIn");
    setUser({});
  };

  useEffect(() => {
    console.log(user, "what is user?");
    let stashedUser = window.localStorage.getItem("emailForSignIn");

    if (stashedUser) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${stashedUser}`,
          {
            headers: {
              Authorization: `Bearer ${stashedUser}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data, "OMG WORKS");

          setUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (event) => {
    setCurrentTheme(event.target.value);
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoadingUser(true);
        console.log(user);
        if (user) {
          const getUser = await fetch(
            "http://localhost:3001/users/usersFromEmail/" + user.email
          );

          const response = await getUser.json();
          console.log(response, "her!!!");

          if (response.message !== "User not found") {
            const UserData = {
              userId: user.id,
              userName: response.user.name,
              userEmail: response.user.email,
              userImage: response.user.image,
              userOrg: response.user.Organization,
            };
            setUserData(UserData);
            console.log(UserData, "THE USER DATA");
            setIsLoadingUser(false);
          } else {
            setIsLoadingUser(true);

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
  }, [user, token]);

  //  if (isLoadingUser) {
  //   return <div className="loader"></div>;
  // }

  return (
    <div>
      {userData && Object.keys(user).length !== 0 && !isLoadingUser ? (
        <AuthenticatedView
          user={user}
          userData={userData}
          handleLogout={logOut}
          handleThemeChange={handleThemeChange}
          currentTheme={currentTheme}
        />
      ) : (
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </div>
  );
}

export default App;

//App.propTypes = {
//  darkModeDefault: PropTypes.bool,
//};

import React, { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import { getUserFromEmail } from "../Controller/UserController";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [token, setToken] = useState("");

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      setToken("Initial");
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    //Check if user is not logged in, then initiate automatic login
    if (!user) {
      login();
    }
  }, [user, login]);

  const logout = () => {
    googleLogout();
    setUser(null);
    setUserData(null);
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data && res.data.email) {
            setUser(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email) {
        setIsLoadingUser(true);
        //getting user or checking of token is still valid
        const response = await getUserFromEmail(user.email);
        if (response) {
          setUserData(response);
          setIsLoadingUser(false);
        } else if (user.email) {
          setToken("Rerun");
        } else {
          setIsLoadingUser(false);
          console.log("Access denied");
        }
      }
    };

    fetchUserData();
  }, [user, token]);

  //Setting user and userdata ref (Bad store alternative)
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUser !== "null" && storedUserData !== "null") {
      setUser(JSON.parse(storedUser));
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    //Setting the initial usedata in session storage
    const CurrentUser = sessionStorage.getItem("user");
    const CurrentUserData = sessionStorage.getItem("userData");
    if (user && user.email && !CurrentUser) {
      window.sessionStorage.setItem("user", JSON.stringify(user));
    } else if (user && !user.email) {
      setToken("Rerun");
    }
    if (userData && !CurrentUserData) {
      window.sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [user, userData]);

  return (
    <AuthContext.Provider
      value={{ user, userData, isLoadingUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

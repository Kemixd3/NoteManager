import React, { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [token, setToken] = useState("");

  const [userStore, setUserStore] = useState(null);
  const [userDataStore, setUserDataStore] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      setToken("Initial");

      // Store the token or relevant user data as needed
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    // Check if the user is not logged in, then initiate automatic login
    if (!user) {
      login();
    }
  }, [user, login]);

  const logout = () => {
    googleLogout();
    setUser(null);
    setUserData(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userData");
  };

  useEffect(() => {
    console.log(user, "what is user?");

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
          console.log(res.data, "OMG WORKS");

          setUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && user.email) {
          setIsLoadingUser(true);

          const response = await axios.get(
            `http://localhost:3001/users/usersFromEmail/${user.email}`
          );

          if (response.data && response.data.message !== "User not found") {
            const userDetail = response.data.user;
            const UserData = {
              userId: userDetail.id,
              userName: userDetail.name,
              userEmail: userDetail.email,
              userImage: userDetail.image,
              userOrg: userDetail.Organization,
            };

            setUserData(UserData);
          } else {
            await axios.post("http://localhost:3001/users/post", {
              userid: user.uid,
              name: "",
              email: user.email,
              image:
                "https://media.licdn.com/dms/image/C560BAQHuF4hk-oVm4w/company-logo_200_200/0/1630637919310/uav_components_aps_logo?e=2147483647&v=beta&t=QrkJiLZuMdpNdWvF2jCSGUJZyUs-nrqfsHvXfQJZkrM",
            });
          }
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUser !== "null" && storedUserData !== "null") {
      setUser(JSON.parse(storedUser));
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("user", JSON.stringify(user));
    window.sessionStorage.setItem("userData", JSON.stringify(userData));
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

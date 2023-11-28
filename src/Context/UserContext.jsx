import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const value = {
    user,
    setUser,
    userData,
    setUserData,
    isLoadingUser,
    setIsLoadingUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

import Router from "../router";
import NavbarDisplay from "./Nav";

import { useAuth } from "../Context/AuthContext";
import { useEffect } from "react";

function AuthenticatedView() {
  const {
    user,
    userData,
    isLoadingUser,

    login,
  } = useAuth();

  useEffect(() => {
    if (!user) {
      login();
    }
  }, [user, login]);

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userData && Object.keys(user).length !== 0 ? (
        <div>
          <NavbarDisplay user={user} userData={userData} />
          <Router />
        </div>
      ) : (
        <button onClick={login}>Sign in</button>
      )}
    </div>
  );
}

export default AuthenticatedView;

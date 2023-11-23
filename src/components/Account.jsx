import { createContext, useContext, useState, useEffect } from "react";

import "./Account.css";
import { auth } from "../firebaseClient";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../store/darkModeSlice";

const Account = ({ user, userData, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const darkMode = useSelector(selectDarkMode);
  console.log(darkMode);

  console.log(userData, "account");
  //const { userData, setUserData } = useUserData();
  console.log(darkMode, "acc");
  let bg = "nav"; // Default class

  if (darkMode) {
    bg += " dark-mode"; // Add dark mode class
  } else {
    bg += " light-mode"; // Add light mode class
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        console.log(user, "her");
        if (userData != "User not found") {
          // Now you can access individual fields from the data object
          setUsername(userData.userName || "No name uploaded");
          setEmail(user.email || "No email uploaded");
          setAvatarUrl(userData.userImage || "No picture uploaded");
          //console.log("DIS", response.user.image);
        } else {
          console.log("Error");
          setLoading(false);
          //console.log("Profile document does not exist");
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/users/users/${user.uid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            email: email,
            image: avatar_url,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update local state if the request was successful
      setUsername(username);
      setEmail(email);
      setAvatarUrl(avatar_url);

      //await setDoc(doc(firestore, "profiles", user.uid), updates);
    } catch (error) {
      alert("awdawdwadwad", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log(onLogout);
      //onLogout(); //TODO make callback function to handle logout in parent component
    } catch (error) {
      alert("awddawdawd", error.message);
    }
  };

  return (
    <div aria-live="polite" id="accountForm" className={bg}>
      {loading ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} id="accountForm" className="form-widget">
          <div>Email: {email}</div>
          <div>
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              placeholder={username}
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="avatar_url">image</label>
            <input
              id="avatar_url"
              type="url"
              value={avatar_url || ""}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
          <img id="userImage" src={avatar_url} alt="User Avatar" />

          <div>
            <button className="button primary block" disabled={loading}>
              Update profile
            </button>
          </div>
          <button onClick={handleLogout} className="button secondary">
            Logout
          </button>
        </form>
      )}
    </div>
  );
};

export default Account;

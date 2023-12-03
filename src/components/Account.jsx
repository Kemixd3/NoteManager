import { useState, useEffect } from "react";

import "./Account.css";

//import { useSelector } from "react-redux";
//import { selectDarkMode } from "../store/darkModeSlice";

const Account = ({ user, userData }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  //const darkMode = useSelector(selectDarkMode);

  console.log(userData, "account");

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
        `http://localhost:3001/users/users/${user.id}`,
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
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      //await auth.signOut();
      console.log("need logout function");
      //onLogout(); //TODO make callback function to handle logout in parent component
    } catch (error) {
      alert("awddawdawd", error.message);
    }
  };

  return (
    <div aria-live="polite" id="accountForm">
      {loading ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} id="accountForm" className="form-widget">
          <div>
            <h4>{email}</h4>
          </div>

          <img id="userImage" src={avatar_url} alt="User Avatar" />
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
          <div>
            <button
              className="button primary block"
              type="submit"
              disabled={loading}
            >
              Update profile
            </button>
          </div>

          <button
            onClick={handleLogout}
            type="submit"
            className="button secondary"
          >
            Logout
          </button>
        </form>
      )}
    </div>
  );
};

export default Account;

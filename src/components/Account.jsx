import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../actions/userActions";

import "./Account.css";
import { auth } from "../firebaseClient";

const Account = ({ user, onLogout }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const getUser = await fetch(
          "http://localhost:3001/users/users/" + user.uid
        );
        const response = await getUser.json();

        if (response != "User not found") {
          // Now you can access individual fields from the data object
          setUsername(response.name || "No name uploaded");
          setEmail(response.email || "No name uploaded");
          setAvatarUrl(response.image || "No picture uploaded");
          //console.log("DIS", response.user.image);
          const UserData = {
            userId: user.uid,
            userName: response.user.name,
            userEmail: response.user.email,
            userImage: response.user.image,
          };
          dispatch(setUserData(UserData));
        } else {
          // Document does not exist
          console.log("jup");

          await fetch("http://localhost:3001/users/post", {
            method: "POST",
            body: JSON.stringify({
              userid: user.uid,
              name: "",
              email: "",
              image: "",
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });

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
  }, [user, dispatch]);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      //const updates = {
      //  username,
      //
      //  avatar_url,
      //  updated_at: new Date(),
      //};

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
    <div aria-live="polite" id="accountForm">
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
        </form>
      )}
      <button onClick={handleLogout} className="button secondary">
        Logout
      </button>
    </div>
  );
};

export default Account;

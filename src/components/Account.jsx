import { useState, useEffect } from "react";
import { updateProfile } from "../Controller/UserController";
import "./Account.css";
import { useAuth } from "../Context/AuthContext";

const Account = ({ userData }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  document.title = "Account";

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        if (userData != "User not found") {
          setUsername(userData.name || "No name uploaded"); //individual fields from the data object
          setEmail(userData.email || "No email uploaded");
          setAvatarUrl(userData.image || "No picture uploaded");
        } else {
          console.log("Error");
          setLoading(false);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [userData]);

  const updateUserProfile = async (e) => {
    e.preventDefault();
    console.log(userData);
    try {
      setLoading(true);
      const updatedUser = await updateProfile(
        userData.userid,
        username,
        email,
        avatar_url
      );

      setUsername(updatedUser.username);
      setEmail(updatedUser.email);
      setAvatarUrl(updatedUser.avatar_url);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-live="polite" id="accountForm">
      {loading ? (
        "Saving ..."
      ) : (
        <form
          onSubmit={updateUserProfile}
          id="accountForm"
          className="form-widget"
        >
          <div>
            <h4>{email}</h4>
          </div>
          <div>
            {" "}
            <img id="userImage" src={avatar_url} alt="User Avatar" />
          </div>

          <b htmlFor="username">Name</b>
          <div>
            <input
              style={{ width: "20%" }}
              id="username"
              type="text"
              placeholder={username}
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <b htmlFor="avatar_url">Image</b>
          <div>
            <input
              style={{ width: "20%" }}
              id="avatar_url"
              type="url"
              value={avatar_url || ""}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
          <div>
            <button
              className="button primary block me-5"
              type="submit"
              disabled={loading}
            >
              Update profile
            </button>
            <button onClick={logout} type="submit" className="button secondary">
              Logout
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Account;

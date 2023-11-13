import React, { useState, useEffect } from "react";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";

import { auth, firestore } from "./firebaseClient";

const Account = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const docRef = doc(collection(firestore, "profiles"), user.uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log("Profile Data:", data);

          // Now you can access individual fields from the data object
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url || "Picture");
        } else {
          // Document does not exist
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
      const updates = {
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      await setDoc(doc(firestore, "profiles", user.uid), updates);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-live="polite">
      {loading ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <div>Email: {user.email}</div>
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
    </div>
  );
};

export default Account;

import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
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
          setAvatarUrl(data.avatar_url || "");
        } else {
          // Document does not exist
          setLoading(false);
          //console.log("Profile document does not exist");
        }

        // const { data } = await getDoc(
        //  doc(collection(firestore, "profiles"), user.uid)
        // );

        //  if (data) {
        //    setUsername(data.username);
        //    setWebsite(data.website);

        //        setAvatarUrl(data.avatar_url || "");
        //    }
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
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <button className="button primary block" disabled={loading}>
              Update profile
            </button>
          </div>
        </form>
      )}
      <button
        type="button"
        className="button block"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Account;

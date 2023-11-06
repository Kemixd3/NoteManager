import React, { useState, useEffect } from "react";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import mammoth from "mammoth";
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

  function DocxParser() {
    const [parsedData, setParsedData] = useState(null);
    const [editable, setEditable] = useState(false);

    const parseWordDocxFile = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const arrayBuffer = reader.result;
        console.log(arrayBuffer);
        const htmlResult = await mammoth.convertToHtml({
          arrayBuffer: arrayBuffer,
        });

        //const htmlString = htmlResult.value;
        //const parser = new DOMParser();
        //const html = parser.parseFromString(htmlString, "text/html");

        // Update the state with the parsed data
        setParsedData({
          html: htmlResult.value,

          //kage: html,
        });
      };
      reader.readAsArrayBuffer(file);
      setLoading(false);
    };

    return (
      <div aria-live="polite">
        {loading ? (
          "Loading ..."
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

        <div>
          <input type="file" onChange={parseWordDocxFile} />
          {parsedData && (
            <div>
              <div>
                <h3>HTML Content:</h3>
                {console.log("THIS", parsedData.html)}
                <div
                  dangerouslySetInnerHTML={{ __html: parsedData.html }}
                  contentEditable={editable} // Make it editable
                  onInput={(e) => {
                    // Update the parsedData.html when the content changes
                    setParsedData((prevState) => ({
                      ...prevState,
                      html: e.target.innerHTML,
                    }));
                  }}
                />

                <button
                  onClick={() => setEditable(!editable)}
                  disabled={loading}
                >
                  Toggle Editable
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <DocxParser />
    </div>
  );
};

export default Account;

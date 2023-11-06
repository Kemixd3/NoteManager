import "./index.css";
import { useState, useEffect } from "react";
import { auth } from "./firebaseClient";
import Auth from "./Auth";
import Account from "./Account";
import EditableHTML from './EditableHTML';
import React from 'react';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!user ? <Auth /> : <Account user={user} />}
    </div>
  );
}


//function App() {
//  const initialContent = '<h1>This is a Header</h1><img src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" alt="Description of the image"><p>This is a <strong>bold</strong> and <em>cursive</em> text example.</p><p>Here is a short description of the styled text.</p>';
//
//  return (
//    <div>
//      <h1>Navn på dokument</h1>
//      <EditableHTML initialContent={initialContent} />
//    </div>
//  );
//}
//
//export default App;
//
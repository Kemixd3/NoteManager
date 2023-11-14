import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Auth from "./Auth";
import Account from "./Account";
import StockReceiving from "./scanning";
import { auth } from "./firebaseClient";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!user ? (
        <Auth />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Account user={user} />} />
            <Route path="/scan" element={<StockReceiving />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

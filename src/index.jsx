import ReactDOM from "react-dom/client";
import "./App.scss";
import App from "./App";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

console.log("Starting ReactDOM");

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

import ReactDOM from "react-dom/client";
import "./App.scss";
import { App } from "./App";
import React from "react";
import { UserProvider } from "./Context/UserContext";

console.log("test");
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

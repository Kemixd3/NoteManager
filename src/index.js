import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
//import reportWebVitals from "./reportWebVitals";

//<Route path="blogs" element={<Blogs />} />
//<Route path="contact" element={<Contact />} />
//<Route path="*" element={<NoPage />} />

export default function Apps() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Apps />);

// to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

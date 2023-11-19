import "./index.css";
import { useState, useEffect } from "react";
import { auth } from "./firebaseClient";
import Auth from "./Auth";
import Account from "./Account";
import React from 'react';

import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home";
import Nav from "./components/Nav";

export default function App() {
    return (
        <main>
            <Nav />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/posts/:postId" element={<UpdatePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </main>
    );
  }


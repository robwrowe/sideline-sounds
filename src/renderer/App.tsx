import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";

import { Library, Main } from "./views";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.electron) {
      window.electron.onNavigate((route: string) => {
        navigate(route);
      });
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Current route:", `"${location.pathname}"`);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<p>Home</p>} />
      <Route path="/main/*" element={<Main />} />
      <Route path="/library/*" element={<Library />} />
    </Routes>
  );
}

import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";

import { Main } from "./views";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.electron) {
      window.electron.onNavigate((route: string) => {
        navigate(route);
      });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<p>Home</p>} />
      <Route path="/main/*" element={<Main />} />
    </Routes>
  );
}

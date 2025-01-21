import React from "react";
import { Route, Routes } from "react-router";

import { Home } from "./views";

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}

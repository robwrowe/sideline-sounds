import React from "react";
import { Route, Routes } from "react-router";

import LoadShow from "./LoadShow";
import Show from "./Show";
import TempShow from "./Show/TempShow";

export default function Main() {
  return (
    <Routes>
      <Route path="" element={<LoadShow />} />
      {/* /main/show/:showID/:bankID */}
      <Route path="show/:showID/*" element={<Show />} />
      <Route path="show" element={<TempShow />} />
    </Routes>
  );
}

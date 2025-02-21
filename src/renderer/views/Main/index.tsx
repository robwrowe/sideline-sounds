import React from "react";
import { Route, Routes } from "react-router";

import { AudioEngineProvider } from "../../context";

import LoadShow from "./LoadShow";
import Show from "./Show";

export default function MainView() {
  return (
    <AudioEngineProvider>
      <Routes>
        <Route path="" element={<LoadShow />} />
        {/* /main/show/:showID/:bankID */}
        <Route path="show/:showID/*" element={<Show />} />
      </Routes>
    </AudioEngineProvider>
  );
}

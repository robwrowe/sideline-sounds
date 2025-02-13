import React, { useEffect } from "react";
import { useParams, Route, Routes } from "react-router";

import { ShowParams } from "../../../../types";
import { setActivePageID } from "../../../features";
import { useAppDispatch } from "../../../hooks";

import Bank from "./Bank";

export default function Show() {
  const dispatch = useAppDispatch();
  const { pageID } = useParams<ShowParams>();

  useEffect(() => {
    if (pageID) {
      dispatch(setActivePageID(pageID));
    } else {
      dispatch(setActivePageID(null));
    }

    // on dismount, clear selection
    return () => {
      dispatch(setActivePageID(null));
    };
  }, [dispatch, pageID]);

  return (
    <Routes>
      <Route path="bank/:bankID" element={<Bank />} />
      <Route path="*" element={<p>No bank selected</p>} />
    </Routes>
  );
}

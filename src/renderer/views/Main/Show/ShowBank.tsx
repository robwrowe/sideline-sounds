import React, { useEffect } from "react";
import { useParams } from "react-router";
import styles from "./index.module.scss";

import { DataSongCard, SongCard } from "../../../components";
import { ShowParams } from "../../../../types";
import { useAppDispatch } from "../../../hooks";
import { setActiveBankID } from "../../../features";

const NUM_OF_ROWS = 4;
const NUM_OF_COLS = 4;

export default function ShowBank() {
  const { bankID, showID, pageID } = useParams<ShowParams>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bankID) {
      dispatch(setActiveBankID(bankID));
    } else {
      dispatch(setActiveBankID(null));
    }

    // on dismount, clear selection
    return () => {
      dispatch(setActiveBankID(null));
    };
  }, [dispatch, bankID]);

  // update local storage for future reference
  useEffect(() => {
    if (showID && pageID) {
      localStorage.setItem(
        `bank-selection:show:${showID}:page:${pageID}`,
        JSON.stringify(bankID)
      );
    }
  }, [bankID, pageID, showID]);

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: Array(NUM_OF_COLS).fill("1fr").join(" "),
        gridTemplateRows: Array(NUM_OF_ROWS).fill("1fr").join(" "),
      }}
    >
      <DataSongCard
        title="03 Open w Vamp"
        filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 01/03 Open w Vamp.wav"
      />
      <DataSongCard
        title="18 60 ElectroRock Bump"
        filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 02/18 60 ElectroRock Bump.wav"
      />
      <DataSongCard
        title="27 45 Inspirational Orchestral Bump"
        filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 02/27 45 Inspirational Orchestral Bump.wav"
      />
      <DataSongCard
        title="17 05-07 Groovy Hip Hop Sting"
        filePath="/Users/robwrowe/Documents/test-audio/Event Theme Disc 02/17 05-07 Groovy Hip Hop Sting.wav"
      />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
      <SongCard />
    </div>
  );
}

import React from "react";
import { useParams } from "react-router";
import styles from "./index.module.scss";

import { DataSongCard, SongCard } from "../../../components";
import { ShowParams } from "../../../../types";

const NUM_OF_ROWS = 4;
const NUM_OF_COLS = 4;

export default function ShowBank() {
  const { showID, bankID } = useParams<ShowParams>();

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: Array(NUM_OF_COLS).fill("1fr").join(" "),
        gridTemplateRows: Array(NUM_OF_ROWS).fill("1fr").join(" "),
      }}
    >
      <p>Show ID x: {showID}</p>
      <p>Bank ID x: {bankID}</p>
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

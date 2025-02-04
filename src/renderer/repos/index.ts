import { AudioFile, Bank, ContentButton, Page, Show } from "../../types";
import { IndexedDBApp } from "../classes";
import initDB, { InitDBStore } from "./init.repo";

export const stores: InitDBStore[] = [
  { storeName: "shows" },
  { storeName: "pages" },
  { storeName: "banks" },
  { storeName: "contentButtons", keyPath: ["bankID", "buttonNumber"] },
  { storeName: "audioFiles" },
];

export const dbShows = new IndexedDBApp<Show>("shows");
export const dbPages = new IndexedDBApp<Page>("pages");
export const dbBanks = new IndexedDBApp<Bank>("banks");
export const dbContentButtons = new IndexedDBApp<ContentButton>(
  "contentButtons"
);
export const dbAudioFiles = new IndexedDBApp<AudioFile>("audioFiles");

export default initDB;

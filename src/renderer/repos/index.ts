import { AudioFile, Bank, ContentButton, Page, Show } from "../../types";
import { IndexedDBApp } from "../classes";
import initDB, { InitDBStore } from "./init.repo";

export * from "./asRunLogs.repo";

export const stores: InitDBStore[] = [
  { storeName: "shows" },
  { storeName: "pages" },
  { storeName: "banks" },
  // TODO: if a piece of content was deleted, purge it from the buttons too
  { storeName: "contentButtons", keyPath: ["bankID", "buttonNumber"] },
  { storeName: "audioFiles" },
  { storeName: "asRunLog" },
];

export const dbShows = new IndexedDBApp<Show>("shows");
export const dbPages = new IndexedDBApp<Page>("pages");
export const dbBanks = new IndexedDBApp<Bank>("banks");
export const dbContentButtons = new IndexedDBApp<ContentButton>(
  "contentButtons"
);
export const dbAudioFiles = new IndexedDBApp<AudioFile>("audioFiles");

export default initDB;

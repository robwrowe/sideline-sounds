import { Bank, ContentButton, Page, Show } from "../../types";
import { IndexedDBApp } from "../classes";

export const dbShows = new IndexedDBApp<Show>("shows");
export const dbPages = new IndexedDBApp<Page>("pages");
export const dbBanks = new IndexedDBApp<Bank>("banks");
export const dbContentButtons = new IndexedDBApp<ContentButton>(
  "contentButtons"
);

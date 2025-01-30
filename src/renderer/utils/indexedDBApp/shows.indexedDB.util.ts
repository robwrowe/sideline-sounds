import indexedDB, { indexedDBAppOpts } from "./indexedDBApp.utils";
import { Show } from "../../../types";

export default function dbShows(opts: indexedDBAppOpts = {}) {
  return indexedDB<Show>("shows", opts);
}

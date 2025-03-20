import { IndexedDBApp } from "../classes";
import { AsRunLog } from "../../types";
import { v4 as uuid } from "uuid";

export const dbAsRunLogs = new IndexedDBApp<AsRunLog>("asRunLog");

export type AddToAsRunOpts = Pick<
  Partial<AsRunLog>,
  "id" | "showID" | "subclipID" | "inPoint" | "startTime"
>;

/**
 * Add an item to the as run log
 * @param contentID Unique identifier of the content.
 * @param opts.id Unique identifier of this log entry.
 * @param opts.showID Unique identifier of the show.
 * @param opts.subclipID Unique identifier of the subclip. Only needed for metadata.
 * @param opts.startTime ISO String of when the file began playing.
 * @param opts.inPoint The in point of the content when it started.
 */
export async function addToAsRun(
  contentID: AsRunLog["contentID"],
  opts: AddToAsRunOpts = {}
) {
  const id = opts?.id ?? uuid();
  const showID = opts?.showID ?? null;
  const subclipID = opts?.subclipID ?? null;
  const startTime = opts?.startTime ?? new Date().toISOString();
  const inPoint = opts?.inPoint ?? null;

  await dbAsRunLogs.addItem({
    id,
    showID,
    contentID,
    subclipID,
    startTime,
    endTime: null,
    inPoint,
    outPoint: null,
  });
}

export type SetAsRunEndTimeOpts = Pick<
  Partial<AsRunLog>,
  "endTime" | "outPoint"
>;

/**
 * Updates the as run log with the end time for the content
 * @param id The ID of the log entry
 * @param opts.endTime The ISO string of when the content stopped
 * @param opts.outPoint The time in seconds of when the content was stopped
 */
export async function setAsRunEndTime(
  id: string,
  opts: SetAsRunEndTimeOpts = {}
) {
  const endTime = opts?.endTime ?? new Date().toISOString();
  const outPoint = opts?.outPoint ?? null;

  // get the item at this ID
  const records = await dbAsRunLogs.getItems();
  const item = records.find((r) => r.id === id);

  if (!item) {
    throw new Error(`Cannot find log item at ID "${id}"`);
  }

  await dbAsRunLogs.updateItem({ ...item, endTime, outPoint });
}

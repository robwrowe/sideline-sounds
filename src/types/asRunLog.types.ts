export type AsRunLog = {
  /**
   * Unique identifier of this log entry
   */
  id: string;

  /**
   * Unique identifier of the show
   */
  showID: string | null;

  /**
   * Unique identifier of the content
   */
  contentID: string;

  /**
   * Unique identifier of the subclip
   * Only needed for metadata
   */
  subclipID: string | null;

  /**
   * ISO String of when the file began playing
   */
  startTime: string | null;

  /**
   * ISO String of when the file stopped playing
   */
  endTime: string | null;

  /**
   * The in point of the content when it started
   */
  inPoint: number | null;

  /**
   * The out point of the content when it started
   */
  outPoint: number | null;
};

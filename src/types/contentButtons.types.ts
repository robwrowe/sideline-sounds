export enum ButtonActionType {
  /**
   * The button will play a clip or sub-clip
   */
  FILE = "file",

  /**
   * The button will play a playlist
   */
  PLAYLIST = "playlist",

  /**
   * The button is a looping piece, comprised of 2 or 3 files
   */
  LOOP = "loop",
}

type ContentButtonFile = {
  /**
   * The type of button this is
   */
  type: ButtonActionType.FILE;

  /**
   * The content ID that will be played
   */
  contentID: string;
};

type ContentButtonPlaylist = {
  /**
   * The type of button this is
   */
  type: ButtonActionType.PLAYLIST;

  /**
   * The playlist ID that will be played
   */
  playlistID: string;
};

type ContentButtonLoop = {
  /**
   * The type of button this is
   */
  type: ButtonActionType.LOOP;
} & (
  | {
      /**
       * The files to loop
       */
      contentIDs: [string, string];

      /**
       * The index of the file to loop
       */
      loopIndex: 0 | 1;
    }
  | {
      /**
       * The files to loop
       */
      contentIDs: [string, string, string];
      loopIndex: never;
    }
);

export type ContentButton = {
  /**
   * The bank this button belongs to
   */
  bankID: string;

  /**
   * The button number on the page. Must be unique.
   */
  buttonNumber: number;

  /**
   * The color the button should appear
   */
  color: string | null;

  /**
   * The keyboard hot keys that will trigger this button
   */
  hotkey: string | null;
} & (ContentButtonFile | ContentButtonLoop | ContentButtonPlaylist);

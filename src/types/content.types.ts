import { IAudioMetadata } from "music-metadata";

// TODO: add datetime when file was imported and last edited
// TODO: add artist/album table

export type AudioFileMetadata = IAudioMetadata & { cover: string | null };

// TODO: add ability to set volume for file
// TODO: add ability to set panning for file
// TODO: add ability to set EQ bands
export type AudioFile = {
  /**
   * Unique identifier of the content
   */
  id: string;

  /**
   * The title of the song
   */
  title: string;

  /**
   * The artist of the song
   */
  artist: string | null;

  /**
   * The album the song is on
   */
  album: string | null;

  /**
   * The year the song was released
   */
  year: string | null;

  /**
   * The image associated with the content. Typically the album cover.
   */
  // image: Blob | null;

  /**
   * The filepath to read the file from disk
   */
  filePath: string;

  /**
   * The color a button with this content should appear as.
   * It will override the default, but it can be overridden by a button's custom color or a subclip's color
   */
  color: string | null;

  /**
   * Subclips that are associated with this clip.
   */
  subclips: Subclip[];

  /**
   * The total run time for the file in seconds
   */
  duration: number | null;

  // TODO: add the following properties
  /**
   * - tags
   * - include in as-run
   * - duck (sound fx)
   * - loop behavior (single vs. 3 point loop)
   * - image/cover photo
   */
};

export type Subclip = {
  /**
   * Unique identifier of the content
   */
  id: string;

  /**
   * The name of this subclip
   */
  name: string;

  /**
   * The number in seconds to start the subclip.
   * If omitted, it will default to the start (0s)
   */
  inPoint: number | null;

  /**
   * The number in seconds to end the subclip.
   * If omitted, it will default to the end of the file
   */
  outPoint: number | null;

  /**
   * The color a button with this content should appear as.
   * It will override the parent's color, but it can be overridden by a button's custom color
   */
  color: string | null;

  /**
   * TODO: add the following properties
   * - tags
   * - include in as-run
   * - duck (sound fx)
   * - loop behavior (single vs. 3 point loop)
   */
};

export type Playlist = {
  /**
   * Unique identifier of the playlist
   */
  id: string;

  /**
   * The name of the playlist
   */
  name: string;

  /**
   * When `true`, once the playlist plays the final track in the array,
   * it will re-start from the top of the array.
   * Default is `false`
   */
  loop: boolean;

  /**
   * When `true`, the playlist will be shuffled each time it is started.
   * i.e. it will reorder the playlist to a new, randomized order.
   * If `loop` is `true`, it will re-shuffle each time it is played.
   * Default is `false`
   */
  shuffle: boolean;

  /**
   * An array of subclip IDs to be played in the playlist
   */
  subclipIDs: string[];
};

export type AudioFileState = Omit<AudioFile, "id" | "title" | "filePath"> & {
  title: AudioFile["title"] | null;
  filePath: AudioFile["filePath"] | null;
  id: AudioFile["id"] | null;
};

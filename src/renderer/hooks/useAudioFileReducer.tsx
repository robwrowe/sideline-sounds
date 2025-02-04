import { useReducer } from "react";
import { AudioFile } from "../../types";

export type AudioFileState = Omit<
  AudioFile,
  "id" | "subClips" | "title" | "filePath"
> & {
  title: AudioFile["title"] | null;
  filePath: AudioFile["filePath"] | null;
};

export type AudioFileAction =
  | { type: "RESET" }
  | { type: "SET"; payload: AudioFileState }
  | {
      type: "SET_TITLE";
      payload: AudioFileState["title"];
    }
  | {
      type: "SET_ARTIST";
      payload: AudioFileState["artist"];
    }
  | {
      type: "SET_ALBUM";
      payload: AudioFileState["album"];
    }
  | {
      type: "SET_YEAR";
      payload: AudioFileState["year"];
    }
  | {
      type: "SET_FILE_PATH";
      payload: AudioFileState["filePath"];
    }
  | {
      type: "SET_DURATION";
      payload: AudioFileState["duration"];
    }
  | {
      type: "SET_COLOR";
      payload: AudioFileState["color"];
    };

export type AudioFileActionHandler = Exclude<
  AudioFileAction,
  { type: "RESET" } | { type: "SET" } | { type: "SET_DURATION" }
>;

const audioFileInitialState: AudioFileState = {
  title: null,
  artist: null,
  album: null,
  year: null,
  filePath: null,
  color: null,
  duration: null,
};

function reducer(state: AudioFileState, action: AudioFileAction) {
  switch (action.type) {
    case "RESET":
      return { ...audioFileInitialState };

    case "SET":
      return { ...action.payload };

    case "SET_TITLE":
      return { ...state, title: action.payload };

    case "SET_ARTIST":
      return { ...state, artist: action.payload };

    case "SET_ALBUM":
      return { ...state, album: action.payload };

    case "SET_YEAR":
      return { ...state, year: action.payload };

    case "SET_FILE_PATH":
      return { ...state, filePath: action.payload };

    case "SET_DURATION":
      return { ...state, duration: action.payload };

    case "SET_COLOR":
      return { ...state, color: action.payload };

    default:
      throw new Error("Invalid action");
  }
}

export default function useAudioFileReducer(
  initialState = audioFileInitialState
) {
  return useReducer(reducer, initialState);
}

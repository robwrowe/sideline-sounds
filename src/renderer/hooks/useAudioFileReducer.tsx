import { useReducer } from "react";
import { v4 as uuid } from "uuid";

import { AudioFile, Subclip } from "../../types";

export type AudioFileState = Omit<AudioFile, "id" | "title" | "filePath"> & {
  title: AudioFile["title"] | null;
  filePath: AudioFile["filePath"] | null;
  id: AudioFile["id"] | null;
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
    }
  | {
      type: "SET_SUBCLIPS";
      payload: AudioFileState["subclips"];
    }
  | {
      type: "UPDATE_SUBCLIP";
      id: string;
      payload: Subclip;
    }
  | {
      type: "DELETE_SUBCLIP";
      payload: string;
    }
  | {
      type: "ADD_SUBCLIP";
      payload?: Partial<Subclip>;
    };

export type AudioFileActionHandler = Exclude<
  AudioFileAction,
  { type: "RESET" } | { type: "SET" } | { type: "SET_DURATION" }
>;

const audioFileInitialState: AudioFileState = {
  id: null,
  title: null,
  artist: null,
  album: null,
  year: null,
  filePath: null,
  color: null,
  duration: null,
  subclips: [],
};
/*
const audioFileInitialState: AudioFileState = {
  id: "90a0b674-8af8-4708-82e8-5a529969eb5f",
  title: "Open w Vamp",
  artist: "ESPN",
  album: "College Football",
  year: null,
  filePath:
    "/Users/robwrowe/Documents/test-audio/Event Theme Disc 01/03 Open w Vamp.wav",
  color: null,
  duration: 74.64,
  subclips: [
    {
      id: "42069",
      inPoint: 5,
      outPoint: 20,
      name: "Subclip 1",
      color: null,
    },
    {
      id: "42169",
      inPoint: null,
      outPoint: 10,
      name: "Subclip 2",
      color: null,
    },
    {
      id: "42269",
      inPoint: 40,
      outPoint: null,
      name: "Subclip 3",
      color: null,
    },
  ],
};
*/

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

    case "SET_SUBCLIPS":
      return { ...state, subclips: action.payload };

    case "UPDATE_SUBCLIP":
      return {
        ...state,
        subclips: state.subclips.map((item) => {
          if (item.id === action.id) {
            return action.payload;
          }

          return item;
        }),
      };

    case "DELETE_SUBCLIP":
      return {
        ...state,
        subclips: state.subclips.filter((item) => item.id !== action.payload),
      };

    case "ADD_SUBCLIP":
      return {
        ...state,
        subclips: [
          ...state.subclips,
          {
            id: action.payload?.id ?? uuid(),
            name:
              action.payload?.name ?? `Subclip ${state.subclips.length + 1}`,
            color: action.payload?.color ?? null,
            inPoint: action.payload?.inPoint ?? null,
            outPoint: action.payload?.outPoint ?? null,
          },
        ],
      };

    default:
      throw new Error("Invalid action");
  }
}

export type AudioFileReducerHelpers = {
  importFile: Promise<boolean>;
};

export default function useAudioFileReducer(
  initialState = audioFileInitialState
) {
  return useReducer(reducer, initialState);
}

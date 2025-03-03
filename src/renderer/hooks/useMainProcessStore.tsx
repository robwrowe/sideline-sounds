import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { setAudioEngineState } from "../features";

export default function useMainProcessStore() {
  const dispatch = useAppDispatch();

  // sync local store state with process updates
  useEffect(() => {
    window.audio.onStateUpdate((state) => {
      dispatch(setAudioEngineState(state.audioEngine));
    });

    // cleanup listener on unmount
    return () => {
      window.audio.removeStateListener();
    };
  }, [dispatch]);
}

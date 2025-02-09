import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { LoadingOverlay } from "@mantine/core";
import styles from "./index.module.scss";

import { formatSecondsToTime } from "../../../utils";
import { AudioFile } from "../../../types";

import SongCard from "../SongCard";
import Waveform from "../Waveform";
import AudioFileMetadataEditor from "./AudioFileMetadataEditor";
import AudioFileSubclip from "./AudioFileSubclip";

export { AudioFileMetadataEditor, AudioFileSubclip };

enum PointType {
  IN = "in",
  OUT = "out",
}

export type SubclipEditorProps = {
  file: AudioFile;
  showInOutMarker?: boolean;
  activeSubclip?: string | null;
  children?: ReactNode;
  onSetInPoint?: (value: number | null) => void;
  onSetOutPoint?: (value: number | null) => void;
};

// TODO: add ability to listen on PGM or PFL
//
export default function AudioFileEditor({
  file,
  showInOutMarker = true,
  children,
  activeSubclip,
  onSetInPoint,
  onSetOutPoint,
}: SubclipEditorProps) {
  // audio file
  const { title, artist, album, filePath } = file;
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // waveform metadata
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  // in/out points
  const [inPoint, setInPoint] = useState<number | null>(null);
  const [outPoint, setOutPoint] = useState<number | null>(null);
  const subclipDuration = useMemo(() => {
    if (inPoint !== null || outPoint !== null) {
      const outVal = outPoint || duration;
      const inVal = inPoint || 0;

      if (outVal !== null && outVal > inVal) {
        return outVal - inVal;
      }
    }

    return null;
  }, [inPoint, outPoint, duration]);

  // set the in/out point to the active subclip
  const setInOutPointFromSubclip = useCallback(() => {
    if (activeSubclip && file.subclips) {
      const subclip = file.subclips.find((item) => item.id === activeSubclip);

      if (subclip) {
        setInPoint(subclip.inPoint);
        setOutPoint(subclip.outPoint);
        return;
      }
    }

    setInPoint(null);
    setOutPoint(null);
  }, [activeSubclip, file.subclips]);

  useEffect(() => {
    setInOutPointFromSubclip();
  }, [setInOutPointFromSubclip]);

  /*****************************************************
   * HELPER FUNCTIONS                                  *
   * needed to be placed here for proper block-scoping *
   *****************************************************/
  // checks if a new in/out point isn't past the other point
  const isValidPoint = useCallback(
    (val: number | null, selectedPoint: PointType) => {
      // if its clearing the point, it will always be true
      if (val === null) return true;

      if (selectedPoint === PointType.IN) {
        // confirm the in point is before the out
        if (outPoint !== null && val >= outPoint) {
          // in point is after the out; not valid
          return false;
        }
      } else if (selectedPoint === PointType.OUT) {
        // confirm the out point is after the in
        if (inPoint !== null && val <= inPoint) {
          // out point is before the in; not valid
          return false;
        }
      }

      return true;
    },
    [inPoint, outPoint]
  );

  /********************
   * AUDIO FILE SETUP *
   ********************/
  // parse the audio file
  const fetchAndSetAudioBlob = useCallback(async () => {
    try {
      if (filePath) {
        setLoadingAudio(true);

        // get the file as a buffer
        const fileBuffer = await window.electron.audio.fileBuffer(filePath);

        if (fileBuffer) {
          // convert to a blob
          const blob = new Blob([fileBuffer]);

          if (blob) {
            // update state
            setAudioBlob(blob);
            return;
          }
        }

        setAudioBlob(null);
      } else {
        console.warn("No filepath found");
      }
    } catch (err) {
      console.error("Error setting audio blob in subclip editor.", err);
      setAudioBlob(null);
    } finally {
      setLoadingAudio(false);
    }
  }, [filePath]);

  // when the component mounts or the filepath updates, update blob
  useEffect(() => {
    fetchAndSetAudioBlob();
  }, [fetchAndSetAudioBlob]);

  /*************************
   * IN/OUT POINT HANDLERS *
   *************************/
  // set the in/out point
  const handleClickSet = useCallback(
    (point: PointType) => {
      const isValid = isValidPoint(playheadPosition, point);

      if (point === PointType.IN) {
        if (isValid) {
          setInPoint(playheadPosition);

          if (onSetInPoint) {
            onSetInPoint(playheadPosition);
          }
        } else {
          alert("In point must be before out point.");
        }
      } else if (point === PointType.OUT) {
        if (isValid) {
          setOutPoint(playheadPosition);

          if (onSetOutPoint) {
            onSetOutPoint(playheadPosition);
          }
        } else {
          alert("Out point must be after in point.");
        }
      }
    },
    [isValidPoint, onSetInPoint, playheadPosition]
  );

  return (
    <>
      <div className={styles.container}>
        {/* song info */}
        <SongCard
          title={title}
          artist={
            artist && album
              ? `${artist} | ${album}`
              : artist
                ? artist
                : album
                  ? album
                  : undefined
          }
          duration={
            subclipDuration && duration
              ? `${formatSecondsToTime(duration)} (${formatSecondsToTime(subclipDuration)})`
              : duration
                ? formatSecondsToTime(duration)
                : undefined
          }
        />
        {/* waveform */}
        <Waveform
          audioBlob={audioBlob}
          onClickLeftPipe={
            showInOutMarker ? () => handleClickSet(PointType.IN) : undefined
          }
          onClickRightPipe={
            showInOutMarker ? () => handleClickSet(PointType.OUT) : undefined
          }
          leftPipeActionIconProps={
            showInOutMarker
              ? {
                  disabled: !isValidPoint(playheadPosition, PointType.IN),
                }
              : undefined
          }
          rightPipeActionIconProps={
            showInOutMarker
              ? {
                  disabled: !isValidPoint(playheadPosition, PointType.OUT),
                }
              : undefined
          }
          onSetDuration={(val) => setDuration(val)}
          onPlayheadUpdate={(val) => setPlayheadPosition(val)}
          inPoint={inPoint}
          outPoint={outPoint}
          regions={[
            ...file.subclips.map((item) => ({
              id: item.id,
              start: item.inPoint,
              end: item.outPoint,
              active: item.id === activeSubclip,
              name: item.name,
            })),
          ]}
        />
        {/* subclip metadata */}
        {children && <div className={styles.metadata}>{children}</div>}
      </div>
      <LoadingOverlay visible={loadingAudio} />
    </>
  );
}

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { Card, LoadingOverlay } from "@mantine/core";
import styles from "./index.module.scss";

import { formatSecondsToTime } from "../../../utils";
import { AudioFile } from "../../../types";

import { InOutPointLabel } from "../InOutPoint";
import SongCard from "../SongCard";
import Waveform from "../Waveform";

enum PointType {
  IN = "in",
  OUT = "out",
}

export type SubclipEditorProps = {
  file: AudioFile;
  showInOutPoint?: boolean;
  onSetInPoint?: (value: number | null) => void;
  onSetOutPoint?: (value: number | null) => void;
  children?: ReactNode;
};

// TODO: create/update subclip
// TODO: add ability to listen on PGM or PFL
// TODO: add array of subclips to the bottom
//
export default function AudioFileEditor({
  file,
  showInOutPoint,
  onSetInPoint,
  onSetOutPoint,
  children,
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
        } else {
          alert("In point must be before out point.");
        }
      } else if (point === PointType.OUT) {
        if (isValid) {
          setOutPoint(playheadPosition);
        } else {
          alert("Out point must be after in point.");
        }
      }
    },
    [isValidPoint, playheadPosition]
  );

  // clear the value in the point
  const handleClickClear = useCallback((point: PointType) => {
    if (point === PointType.IN) {
      setInPoint(null);
    } else if (point === PointType.OUT) {
      setOutPoint(null);
    }
  }, []);

  // format the display value in the component
  const inPointValue = useMemo(
    () => (inPoint !== null ? formatSecondsToTime(inPoint, 2) : null),
    [inPoint]
  );

  const outPointValue = useMemo(
    () => (outPoint !== null ? formatSecondsToTime(outPoint, 2) : null),
    [outPoint]
  );

  // when the points update, update the parent component
  useEffect(() => {
    if (onSetInPoint) {
      onSetInPoint(inPoint);
    }
  }, [inPoint, onSetInPoint]);

  useEffect(() => {
    if (onSetOutPoint) {
      onSetOutPoint(outPoint);
    }
  }, [outPoint, onSetOutPoint]);

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
            showInOutPoint ? () => handleClickSet(PointType.IN) : undefined
          }
          onClickRightPipe={
            showInOutPoint ? () => handleClickSet(PointType.OUT) : undefined
          }
          leftPipeActionIconProps={
            showInOutPoint
              ? {
                  disabled: !isValidPoint(playheadPosition, PointType.IN),
                }
              : undefined
          }
          rightPipeActionIconProps={
            showInOutPoint
              ? {
                  disabled: !isValidPoint(playheadPosition, PointType.OUT),
                }
              : undefined
          }
          onSetDuration={(val) => setDuration(val)}
          onPlayheadUpdate={(val) => setPlayheadPosition(val)}
          inPoint={showInOutPoint ? inPoint : undefined}
          outPoint={showInOutPoint ? outPoint : undefined}
          regions={[{ id: "69420", start: inPoint, end: outPoint }]}
        />
        {/* in/out point */}
        {showInOutPoint && (
          <div className={styles.controlsContainer}>
            {/* in point */}
            <InOutPointLabel
              label="In Point"
              value={inPointValue}
              onClickClear={() => handleClickClear(PointType.IN)}
            />
            {/* out point */}
            <InOutPointLabel
              label="Out Point"
              value={outPointValue}
              onClickClear={() => handleClickClear(PointType.OUT)}
            />
          </div>
        )}
        {/* subclip metadata */}
        {children && <div className={styles.metadata}>{children}</div>}
      </div>
      <LoadingOverlay visible={loadingAudio} />
    </>
  );
}

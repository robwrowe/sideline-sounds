import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Button,
  LoadingOverlay,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin, {
  TimelinePluginOptions,
} from "wavesurfer.js/dist/plugins/timeline.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.js";
import styles from "./index.module.scss";

import InOutPoint from "../InOutPoint";
import SongCard from "../SongCard";
import AudioControls from "../AudioControls";
import ZoomControls from "../ZoomControls";
import { formatSecondsToTime } from "../../../utils";

const getTimelineOpts = (newZoom: number): Partial<TimelinePluginOptions> => {
  // get the new values based on zoom level
  const primaryLabelInterval = newZoom > 250 ? 1 : newZoom > 150 ? 5 : 10;
  const secondaryLabelInterval =
    newZoom > 250 ? undefined : newZoom > 100 ? 1 : 5;

  return {
    primaryLabelInterval,
    secondaryLabelInterval,
  };
};

// TODO: add ability to listen on PGM or PFL
// TODO: add name & color properties

export default function SubclipEditor() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(false);

  // waveform setup
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<TimelinePlugin | null>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [zoom, setZoom] = useState(100);

  // playing metadata
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadTime, setPlayheadTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  // in/out point
  const [selected, setSelected] = useState<"in" | "out" | null>(null);
  const [inPoint, setInPoint] = useState<number | null>(null);
  const [outPoint, setOutPoint] = useState<number | null>(null);

  // initialize wavesurfer instance
  useEffect(() => {
    if (!containerRef.current) return;

    const previousTimelineZoom = localStorage.getItem("editor:timeline:zoom");

    // determine if there's a default zoom
    const minPxPerSec = previousTimelineZoom
      ? JSON.parse(previousTimelineZoom)
      : 0;

    // update the state to match
    setZoom(minPxPerSec);

    // get the timeline options for this zoom level
    const timelineOpts = getTimelineOpts(minPxPerSec);

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 100,
      waveColor: theme.colors.highlight[colorScheme === "light" ? 3 : 6],
      progressColor: theme.colors.highlight[colorScheme === "light" ? 6 : 9],
      // zoom height
      minPxPerSec,
      plugins: [
        (timelineRef.current = TimelinePlugin.create(timelineOpts)),
        Minimap.create({
          height: 20,
          waveColor: "#fff",
          progressColor: "#999",
        }),
      ],
    });

    setWavesurfer(ws);

    // cleanup function to destroy the instance on unmount
    return () => {
      ws.destroy();
      setWavesurfer(null);
    };
  }, [
    colorScheme,
    theme.colors.black,
    theme.colors.dark,
    theme.colors.gray,
    theme.colors.highlight,
    theme.colors.white,
    theme.white,
  ]);

  const fetchAndSetBlob = useCallback(async () => {
    try {
      setLoading(true);
      const filePath =
        "/Users/robwrowe/Documents/test-audio/Rob Music/ACC 2019/21 60s Rock Bump.wav";

      const fileBuffer = await window.electron.audio.fileBuffer(filePath);

      const blob = new Blob([fileBuffer]);

      setAudioBlob(blob);
    } catch (err) {
      console.error("Error setting blob", err);
      setAudioBlob(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBlobAndSetDuration = useCallback(async () => {
    if (wavesurfer && audioBlob) {
      await wavesurfer.loadBlob(audioBlob);
      setDuration(wavesurfer.getDuration());
    }
  }, [audioBlob, wavesurfer]);

  useEffect(() => {
    if (wavesurfer && audioBlob) {
      loadBlobAndSetDuration();
    }
  }, [audioBlob, loadBlobAndSetDuration, wavesurfer]);

  // on mount, fetch audio data
  useEffect(() => {
    fetchAndSetBlob();
    // disabled so it only runs on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update tick marks on a zoom change
  const updateTimeline = useCallback(
    (newZoom: number) => {
      if (!timelineRef.current) return;

      // get the timeline options for this zoom level
      const timelineOpts = getTimelineOpts(newZoom);

      timelineRef.current.destroy();
      timelineRef.current = TimelinePlugin.create(timelineOpts);

      wavesurfer?.registerPlugin(timelineRef.current);
    },
    [wavesurfer]
  );

  // allow the user to zoom in/out on the waveform
  const handleClickZoom = useCallback(
    (delta: number, absolute = false) => {
      const newZoom = absolute ? delta : zoom + delta;

      // update the waveform
      wavesurfer?.zoom(newZoom);

      // update the state
      setZoom(newZoom);

      // update zoom tick marks
      updateTimeline(newZoom);
    },
    [wavesurfer, zoom, updateTimeline]
  );

  // when zoom updates, store it in local storage
  useEffect(() => {
    localStorage.setItem("editor:timeline:zoom", JSON.stringify(zoom));
  }, [zoom]);

  // when the user clicks the in/out point, set that as the active
  const handleClickInOutPoint = useCallback(
    (point: "in" | "out") => {
      if (selected === point) {
        setSelected(null);
        return;
      }

      setSelected(point);
    },
    [selected]
  );

  // control handlers
  const handleClickPlay = useCallback(() => {
    wavesurfer?.play();
    setIsPlaying(true);
  }, [wavesurfer]);

  const handleClickPause = useCallback(() => {
    wavesurfer?.pause();
    setIsPlaying(false);
  }, [wavesurfer]);

  // set the in/out point based on user selection
  const handleSetPoint = useCallback(
    (val: number | null) => {
      if (selected === "in") {
        if (val === null) {
          setInPoint(val);
          return;
        }

        // confirm the in point is before the out
        if (outPoint === null || val < outPoint) {
          setInPoint(val);
        } else {
          alert("In point must be before out point.");
        }
      } else if (selected === "out") {
        if (val === null) {
          setOutPoint(val);
          return;
        }

        // confirm the out point is after the in
        if (inPoint === null || val > inPoint) {
          setOutPoint(val);
        } else {
          alert("Out point must be after in point.");
        }
      }
    },
    [inPoint, outPoint, selected]
  );

  // playhead position
  useEffect(() => {
    if (!wavesurfer) return;

    const updateTime = () => {
      setPlayheadTime(wavesurfer.getCurrentTime());
      setDuration(wavesurfer.getDuration());
    };

    // TODO: only update waveform selection if it's valid
    // it should not adjust if the out point is before the in point
    const setPoint = () => {
      handleSetPoint(wavesurfer.getCurrentTime());
    };

    wavesurfer.on("audioprocess", updateTime);
    wavesurfer.on("seeking", updateTime);
    wavesurfer.on("interaction", setPoint);

    return () => {
      wavesurfer.un("audioprocess", updateTime);
      wavesurfer.un("seeking", updateTime);
      wavesurfer.un("interaction", setPoint);
    };
  }, [handleSetPoint, wavesurfer]);

  return (
    <>
      <div className={styles.container}>
        {/* song info */}
        <SongCard />
        <div className={styles.controls}>
          {/* controls */}
          <div>
            <AudioControls
              actionIconProps={{ variant: "default", size: "lg" }}
              iconProps={{ size: 20 }}
              handleClickBackwards={() => console.log("backwards")}
              handleClickPlay={handleClickPlay}
              handleClickPause={handleClickPause}
              handleClickForwards={() => console.log("forwards")}
              isPlaying={isPlaying}
            />
          </div>
          <div>
            <Button
              size="compact-md"
              variant="default"
              disabled={selected === null}
              onClick={() => handleSetPoint(playheadTime)}
            >
              Set Point to Playhead
            </Button>
          </div>
          {/* zoom */}
          <ZoomControls zoom={zoom} handleClickZoom={handleClickZoom} />
        </div>
        {/* waveform */}
        <div ref={containerRef} style={{ width: "100%" }} />
        {/* play heads */}
        <div className={styles.controls}>
          {/* in point */}
          <InOutPoint
            label="In Point"
            value={inPoint !== null ? formatSecondsToTime(inPoint, 2) : null}
            onClickSkip={(val) =>
              setInPoint((prev) => (prev !== null ? (prev += val) : val))
            }
            onClickComponent={() => handleClickInOutPoint("in")}
            active={selected === "in"}
          />
          {/* out point */}
          <InOutPoint
            label="Out Point"
            value={
              outPoint !== null && duration !== null
                ? formatSecondsToTime(
                    outPoint !== null ? outPoint : duration,
                    2
                  )
                : null
            }
            onClickSkip={(val) =>
              setOutPoint((prev) => (prev !== null ? (prev += val) : val))
            }
            onClickComponent={() => handleClickInOutPoint("out")}
            active={selected === "out"}
          />
        </div>
      </div>
      <LoadingOverlay visible={loading} />
    </>
  );
}

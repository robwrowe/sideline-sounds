import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useMantineColorScheme, useMantineTheme } from "@mantine/core";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin, {
  TimelinePluginOptions,
} from "wavesurfer.js/dist/plugins/timeline";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import styles from "./index.module.scss";

import { formatSecondsToTime } from "../../../utils";

import InOutPoint, { InOutPointProps } from "../InOutPoint";
import AudioControls from "../AudioControls";
import ZoomControls from "../ZoomControls";
import { useDisclosure } from "@mantine/hooks";

type getNewValOpts = {
  prev?: number | null;
  defaultValue?: number | null;
};

// validate the in/out point is valid
const getNewVal = (
  val: number,
  duration: number | null,
  { prev = null, defaultValue = null }: getNewValOpts
) => {
  const prevValue = prev ?? defaultValue;

  if (prevValue !== null) {
    const newVal = prevValue + val;

    if (newVal < 0) {
      // see if this is before 0
      return 0;
    } else if (duration !== null && newVal > duration) {
      // see if this is after the end
      return duration;
    }

    return newVal;
  }

  return val;
};

// set the tick marks based on zoom levels
const TIMELINE_OPTIONS_ZOOM: Partial<TimelinePluginOptions>[] = [
  {
    // > 700
    timeInterval: 0.05,
    primaryLabelInterval: 1,
    secondaryLabelInterval: 0.25,
  },
  {
    //  > 500
    timeInterval: 0.1,
    primaryLabelInterval: 1,
    secondaryLabelInterval: 0.25,
  },
  {
    // > 300
    timeInterval: 0.25,
    primaryLabelInterval: 1,
    secondaryLabelInterval: 0,
  },
  {
    // > 200
    timeInterval: 0.5,
    primaryLabelInterval: 1,
    secondaryLabelInterval: 0,
  },
  {
    // > 100
    timeInterval: 0.5,
    primaryLabelInterval: 5,
    secondaryLabelInterval: 1,
  },
  {
    // > 20
    timeInterval: 1,
    primaryLabelInterval: 5,
    secondaryLabelInterval: 0,
  },
  {
    // default
    timeInterval: 5,
    primaryLabelInterval: 10,
    secondaryLabelInterval: 0,
  },
];

// set the tick marks based on zoom level
const getTimelineOpts = (zoom: number): Partial<TimelinePluginOptions> => {
  if (zoom > 700) {
    return TIMELINE_OPTIONS_ZOOM[0];
  }

  if (zoom > 500) {
    return TIMELINE_OPTIONS_ZOOM[1];
  }

  if (zoom > 300) {
    return TIMELINE_OPTIONS_ZOOM[2];
  }

  if (zoom > 200) {
    return TIMELINE_OPTIONS_ZOOM[3];
  }

  if (zoom > 100) {
    return TIMELINE_OPTIONS_ZOOM[4];
  }

  if (zoom > 20) {
    return TIMELINE_OPTIONS_ZOOM[5];
  }

  return TIMELINE_OPTIONS_ZOOM[TIMELINE_OPTIONS_ZOOM.length - 1];
};

export type RegionOpts = {
  id?: string;
  start?: number | null;
  end?: number | null;
  active?: boolean;
  name?: string;
};

export type WaveformProps = Pick<
  InOutPointProps,
  | "onClickLeftPipe"
  | "onClickRightPipe"
  | "leftPipeActionIconProps"
  | "rightPipeActionIconProps"
> & {
  /**
   * Audio file to visualize in the waveform
   */
  audioBlob: Blob | null;

  /**
   * Called whenever the playhead position changes
   */
  onPlayheadUpdate?: (value: number) => void;

  /**
   * Move the playhead to the specified point
   * @param value Time in seconds to seek to
   */
  setPlayhead?: (callback: (value: number) => void) => void;

  /**
   * The time in seconds the audio file should automatically stop.
   */
  inPoint?: number | null;

  /**
   * The time in seconds the audio file should automatically stop.
   */
  outPoint?: number | null;

  /**
   * When the duration gets set, inform the parent component
   */
  onSetDuration?: (time: number) => void;

  /**
   * Regions to display in the waveform
   */
  regions?: RegionOpts[];
};

export default function Waveform({
  audioBlob,
  onClickLeftPipe,
  onClickRightPipe,
  leftPipeActionIconProps,
  rightPipeActionIconProps,
  onPlayheadUpdate,
  setPlayhead,
  inPoint = null,
  outPoint = null,
  onSetDuration,
  regions = [],
}: WaveformProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // waveform setup
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<TimelinePlugin | null>(null);
  const regionsRef = useRef<ReturnType<typeof RegionsPlugin.create> | null>(
    null
  );
  const [zoom, setZoom] = useState(100);

  // waveform metadata
  const [isPlaying, setIsPlaying] = useState(false); // audio playback state
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const regionDurationRef = useRef(duration);
  const [showTimeRemaining, { toggle: toggleTimeRemaining }] =
    useDisclosure(false);
  const playheadValue = useMemo(() => {
    const end = outPoint || duration;
    return playheadPosition !== null
      ? showTimeRemaining && end !== null
        ? `- ${formatSecondsToTime(end - playheadPosition, { decimals: 2 })}`
        : formatSecondsToTime(playheadPosition, { decimals: 2 })
      : null;
  }, [duration, outPoint, playheadPosition, showTimeRemaining]);

  /*****************************
   * WAVEFORM/WAVESURFER SETUP *
   *****************************/
  // initialize waveform
  useEffect(() => {
    if (!waveformRef.current) return;

    // get the values cached
    const previousTimelineZoom = localStorage.getItem("editor:timeline:zoom");

    // if there's a previously selected zoom, use that
    const minPxPerSec = previousTimelineZoom
      ? JSON.parse(previousTimelineZoom)
      : 0;

    // update the zoom state to match cached values
    setZoom(minPxPerSec);

    // get the timeline options (tick marks) for this zoom level
    const timelineOpts = getTimelineOpts(minPxPerSec);

    // create the waveform
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      height: 100,
      cursorColor:
        colorScheme === "light" ? theme.colors.gray[8] : theme.colors.dark[2],
      cursorWidth: 4,
      waveColor: theme.colors.accent[colorScheme === "light" ? 3 : 6],
      progressColor: theme.colors.accent[colorScheme === "light" ? 6 : 9],
      minPxPerSec, // zoom
      plugins: [
        (timelineRef.current = TimelinePlugin.create(timelineOpts)),
        (regionsRef.current = RegionsPlugin.create()),
        MinimapPlugin.create({
          height: 20,
          cursorColor: theme.colors.accent[colorScheme === "light" ? 3 : 6],
          waveColor:
            colorScheme === "light"
              ? theme.colors.gray[9]
              : theme.colors.dark[0],
          progressColor:
            colorScheme === "light"
              ? theme.colors.gray[6]
              : theme.colors.dark[3],
        }),
      ],
    });

    // set wavesurfer in state for use by other handlers
    setWavesurfer(ws);

    // destroy instance on unmount
    return () => {
      ws.destroy();
      setWavesurfer(null);
    };
  }, [colorScheme, theme.colors.dark, theme.colors.gray, theme.colors.accent]);

  // set waveform to the audio file in blob
  const loadBlobInWaveform = useCallback(async () => {
    try {
      if (wavesurfer && audioBlob) {
        // load audio
        await wavesurfer.loadBlob(audioBlob);
      }
    } catch (err) {
      alert("An error occurred when building the waveform.");
      console.error("Error when loading blob in wavesurfer", err);
    }
  }, [audioBlob, wavesurfer]);

  useEffect(() => {
    if (wavesurfer && audioBlob) {
      loadBlobInWaveform();
    }
  }, [audioBlob, loadBlobInWaveform, wavesurfer]);

  // ############################## *
  // handlers for wavesurfer events
  // ############################## *

  // audioprocess: An alias of timeupdate but only when the audio is playing
  // as the audio file plays, update playhead position
  // also do not allow the file to play past the out point
  const handleAudioprocess = useCallback(
    (currentTime: number) => {
      // update playhead position
      setPlayheadPosition(currentTime);

      if (outPoint !== null) {
        if (currentTime >= outPoint) {
          wavesurfer?.pause();
        }
      }
    },
    [outPoint, wavesurfer]
  );

  // seeking: When the user seeks to a new position
  // when the user seeks to a new position, update playhead position
  const handleSeeking = useCallback((currentTime: number) => {
    setPlayheadPosition(currentTime);
  }, []);

  // when the audio starts playing, set isPlaying state
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // when the audio playing is paused, set isPlaying state
  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // when the audio is finished playing, set isPlaying state
  const handleFinish = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // error: When source file is unable to be fetched, decoded, or an error is thrown by media element
  // when an error occurs, inform the user
  const handleError = useCallback((error: Error) => {
    alert("An error occurred when creating the waveform.");
    console.error("Error emitted in wavesurfer", error);
  }, []);

  // decode: When the audio has been decoded
  // when the audio has been loaded, set the duration
  const handleDecode = useCallback(
    (duration: number) => {
      setDuration(duration);
      regionDurationRef.current = duration;

      if (onSetDuration) {
        onSetDuration(duration);
      }
    },
    [onSetDuration]
  );

  // waveform event listeners
  // event docs: https://wavesurfer.xyz/docs/types/wavesurfer.WaveSurferEvents
  useEffect(() => {
    if (!wavesurfer) return;

    // error: When source file is unable to be fetched, decoded, or an error is thrown by media element
    wavesurfer.on("error", handleError);

    wavesurfer.on("play", handlePlay);
    wavesurfer.on("pause", handlePause);
    wavesurfer.on("finish", handleFinish);

    // audioprocess: An alias of timeupdate but only when the audio is playing
    wavesurfer.on("audioprocess", handleAudioprocess);
    // seeking: When the user seeks to a new position
    wavesurfer.on("seeking", handleSeeking);
    // decode: When the audio has been decoded
    wavesurfer.on("decode", handleDecode);

    return () => {
      wavesurfer.un("error", handleError);
      wavesurfer.un("play", handlePlay);
      wavesurfer.un("pause", handlePause);
      wavesurfer.un("finish", handleFinish);
      wavesurfer.un("audioprocess", handleAudioprocess);
      wavesurfer.un("seeking", handleSeeking);
      wavesurfer.un("decode", handleDecode);
    };
  }, [
    handleAudioprocess,
    handleDecode,
    handleError,
    handleFinish,
    handlePause,
    handlePlay,
    handleSeeking,
    wavesurfer,
  ]);

  /*********************
   * PLAYBACK HANDLERS *
   *********************/
  // play/pause controls
  const handleClickBackwards = useCallback(() => {
    // when the user clicks on the backwards button,
    // it should go to the start of the subclip
    const time = inPoint || 0;
    wavesurfer?.seekTo(time / wavesurfer.getDuration());
  }, [inPoint, wavesurfer]);

  const handleClickPlay = useCallback(() => {
    if (wavesurfer) {
      // if the playhead is outside the valid range, move it
      const start = inPoint || 0;
      const end = outPoint || wavesurfer.getDuration();

      if (
        wavesurfer.getCurrentTime() < start || // if the playhead is before the start
        (end !== null && wavesurfer.getCurrentTime() >= end) // if the playhead is after the end
      ) {
        console.info("moving playhead to the start point", start);
        wavesurfer.seekTo(start / wavesurfer.getDuration());
      }

      wavesurfer?.play();
    }
  }, [inPoint, outPoint, wavesurfer]);

  const handleClickPause = useCallback(() => {
    wavesurfer?.pause();
  }, [wavesurfer]);

  const handleClickForwards = useCallback(() => {
    // when the user clicks on the forwards button,
    // it should go to the end of the subclip
    const time = outPoint || wavesurfer?.getDuration();

    if (time !== undefined)
      wavesurfer?.seekTo(time / wavesurfer?.getDuration());
  }, [outPoint, wavesurfer]);

  /*****************
   * ZOOM HANDLERS *
   *****************/
  // zoom in/out timeline
  const handleClickZoom = useCallback(
    (delta: number, absolute = false) => {
      // get the new value
      const newZoom = absolute ? delta : zoom + delta;

      // update the waveform zoom
      wavesurfer?.zoom(newZoom);

      // update the state
      setZoom(newZoom);

      // update tick marks on timeline
      if (timelineRef.current) {
        // get the timeline options for this zoom level
        const timelineOpts = getTimelineOpts(newZoom);

        // remove the current tick marks
        timelineRef.current.destroy();

        // set the new timeline
        timelineRef.current = TimelinePlugin.create(timelineOpts);

        // add timeline with updated marks to waveform
        wavesurfer?.registerPlugin(timelineRef.current);
      }
    },
    [wavesurfer, zoom]
  );

  // when zoom updates, store it
  useEffect(() => {
    localStorage.setItem("editor:timeline:zoom", JSON.stringify(zoom));
  }, [zoom]);

  /*******************
   * REGION HANDLERS *
   *******************/
  useEffect(() => {
    if (!regionsRef.current) return;

    // Track the current region state (by ID and its start/end points)
    const currentRegionState = regionsRef.current
      .getRegions()
      .map((region) => ({
        id: region.id,
        start: region.start,
        end: region.end,
      }));

    // Check if there's an active region
    const activeRegion = regions.find((item) => item.active);

    // Compare with the new region state (by ID and start/end points)
    // If there's an active region, filter out other regions
    const newRegionState = activeRegion
      ? [
          {
            id: activeRegion.id,
            start: activeRegion.start || 0,
            end: activeRegion.end || duration,
          },
        ]
      : regions.map((region) => ({
          id: region.id,
          start: region.start || 0,
          end: region.end || duration,
        }));

    // Check if there's any difference in the regions (active or start/end changes)
    const isRegionStateChanged =
      currentRegionState.length !== newRegionState.length ||
      currentRegionState.some(
        (currRegion, index) =>
          currRegion.start !== newRegionState[index].start ||
          currRegion.end !== newRegionState[index].end
      );

    if (isRegionStateChanged) {
      // Clear existing regions
      regionsRef.current.clearRegions();
      console.info("Cleared regions due to change in state.");

      // Wait for a short delay before adding new regions
      const interval = setTimeout(() => {
        if (!regionsRef.current) return;

        // Determine if there's an active region
        const activeRegion = regions.find((item) => item.active);

        if (activeRegion) {
          const { id } = activeRegion;
          const start = activeRegion.start || 0;
          const end = activeRegion.end || duration;

          // Add the active region
          if (end !== null) {
            regionsRef.current.addRegion({
              id,
              start,
              end,
              color: "rgba(255,255,255, 0.1)",
              drag: false,
              resize: false,
            });
          }
        } else {
          // Add all regions if no active region
          for (const region of regions) {
            const { id } = region;
            const start = region.start || 0;
            const end = region.end || duration;

            if (end !== null) {
              regionsRef.current.addRegion({
                id,
                start,
                end,
                color: "rgba(255,255,255, 0.1)",
                drag: false,
                resize: false,
                content: region.name,
              });
            }
          }
        }
      }, 100); // Delay before adding regions, adjust as necessary

      // Cleanup: clear the timeout on cleanup or region change
      return () => clearTimeout(interval);
    }

    // If no change in region state, nothing to do
  }, [regions, duration]); // Run effect when regions or duration change

  /*****************************
   * PLAYHEAD DISPLAY HANDLERS *
   *****************************/
  // when the playhead moves, inform the parent
  useEffect(() => {
    if (onPlayheadUpdate) {
      onPlayheadUpdate(playheadPosition);
    }
  }, [onPlayheadUpdate, playheadPosition]);

  // allow the user to manually set the playhead
  useEffect(() => {
    if (setPlayhead && wavesurfer && duration !== null) {
      setPlayhead((val) => wavesurfer.seekTo(val / duration));
    }
  }, [duration, setPlayhead, wavesurfer]);

  // allow user to move forwards/backwards
  const handleClickSkip = useCallback(
    (val: number) => {
      // calculate new point
      const newPoint = getNewVal(val, duration, {
        prev: playheadPosition,
        defaultValue: 0,
      });

      // set playhead
      wavesurfer?.setTime(newPoint);
    },
    [duration, playheadPosition, wavesurfer]
  );

  return (
    <div className={styles.container}>
      {/* play/pause & zoom controls */}
      <div className={styles.controlsContainer}>
        {/* play/pause control */}
        <AudioControls
          actionIconProps={{ variant: "default", size: "lg" }}
          iconProps={{ size: 20 }}
          onClickBackwards={handleClickBackwards}
          onClickPlay={handleClickPlay}
          onClickPause={handleClickPause}
          onClickForwards={handleClickForwards}
          isPlaying={isPlaying}
        />
        {/* playhead controls */}
        {/* TODO: when jogging, play the audio back */}
        <InOutPoint
          value={playheadValue}
          onClickSkip={handleClickSkip}
          onClickComponent={toggleTimeRemaining}
          style={{ alignSelf: "flex-end" }}
          iconProps={{ color: colorScheme === "light" ? "dark" : "white" }}
          actionIconGroupSectionProps={{
            c: colorScheme === "light" ? theme.colors.dark[9] : theme.white,
          }}
          onClickLeftPipe={onClickLeftPipe}
          onClickRightPipe={onClickRightPipe}
          leftPipeActionIconProps={leftPipeActionIconProps}
          rightPipeActionIconProps={rightPipeActionIconProps}
        />
        {/* zoom */}
        <ZoomControls zoom={zoom} onClickZoom={handleClickZoom} />
      </div>
      {/* waveform */}
      <div ref={waveformRef} className={styles.waveform} />
    </div>
  );
}

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  ActionIcon,
  Card,
  ColorInput,
  ColorPicker,
  LoadingOverlay,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin, {
  TimelinePluginOptions,
} from "wavesurfer.js/dist/plugins/timeline";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import styles from "./index.module.scss";

import { formatSecondsToTime } from "../../../utils";
import { AudioFile } from "../../../types";

import InOutPoint, { InOutPointLabel } from "../InOutPoint";
import SongCard from "../SongCard";
import AudioControls from "../AudioControls";
import ZoomControls from "../ZoomControls";
import { SWATCHES } from "../../../constants";
import { IconX } from "@tabler/icons-react";

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

enum PointType {
  IN = "in",
  OUT = "out",
}

export type SubclipEditorProps = {
  file: AudioFile;
};

// TODO: add regions if a subclip is selected
// TODO: add name and color properties to subclip
// TODO: create/update subclip
// TODO: add ability to listen on PGM or PFL
// TODO: change the playhead color if it's selected
// TODO: setup event handlers for when user interacts with waveform
// TODO: show subclip duration somewhere
// TODO: play/pause should only play within the subclip
//
export default function SubclipEditor({ file }: SubclipEditorProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // audio file
  const { title, artist, filePath, duration } = file;
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

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

  // in/out points
  const [inPoint, setInPoint] = useState<number | null>(null);
  const [outPoint, setOutPoint] = useState<number | null>(null);
  const subclipDuration = useMemo(() => {
    const outVal = outPoint || duration;
    const inVal = inPoint || 0;

    if (outVal !== null && outVal > inVal) {
      return outVal - inVal;
    }

    return null;
  }, [duration, inPoint, outPoint]);

  // subclip metadata
  const [name, setName] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

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
      setLoadingAudio(true);

      // get the file as a buffer
      const fileBuffer = await window.electron.audio.fileBuffer(filePath);

      // convert to a blob
      const blob = new Blob([fileBuffer]);

      // update state
      setAudioBlob(blob);
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
      waveColor: theme.colors.highlight[colorScheme === "light" ? 3 : 6],
      progressColor: theme.colors.highlight[colorScheme === "light" ? 6 : 9],
      minPxPerSec, // zoom
      plugins: [
        (timelineRef.current = TimelinePlugin.create(timelineOpts)),
        (regionsRef.current = RegionsPlugin.create()),
        MinimapPlugin.create({
          height: 20,
          cursorColor: theme.colors.highlight[colorScheme === "light" ? 3 : 6],
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
  }, [
    colorScheme,
    theme.colors.dark,
    theme.colors.gray,
    theme.colors.highlight,
  ]);

  // set waveform to the audio file in blob
  const loadBlobInWaveform = useCallback(async () => {
    try {
      if (wavesurfer && audioBlob) {
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
  const handleAudioprocess = useCallback((currentTime: number) => {
    console.log("wavesurfer event fired", "audioprocess");
    setPlayheadPosition(currentTime);
  }, []);

  // seeking: When the user seeks to a new position
  // when the user seeks to a new position, update playhead position
  const handleSeeking = useCallback((currentTime: number) => {
    console.log("wavesurfer event fired", "seeking");
    setPlayheadPosition(currentTime);
  }, []);

  // interaction: When the user interacts with the waveform (i.g. clicks or drags on it)
  // when the user clicks on the waveform, update the in/out point
  const handleInteraction = useCallback((newTime: number) => {
    // TODO: can we remove this?
    console.log("wavesurfer event fired", "interaction", "newTime", newTime);
  }, []);

  // when the audio starts playing, set isPlaying state
  const handlePlay = useCallback(() => {
    console.log("wavesurfer event fired", "play");
    setIsPlaying(true);
  }, []);

  // when the audio playing is paused, set isPlaying state
  const handlePause = useCallback(() => {
    console.log("wavesurfer event fired", "pause");
    setIsPlaying(false);
  }, []);

  // when the audio is finished playing, set isPlaying state
  const handleFinish = useCallback(() => {
    console.log("wavesurfer event fired", "finish");
    setIsPlaying(false);
  }, []);

  // error: When source file is unable to be fetched, decoded, or an error is thrown by media element
  // when an error occurs, inform the user
  const handleError = useCallback((error: Error) => {
    console.log("wavesurfer event fired", "error");
    alert("An error occurred when creating the waveform.");
    console.error("Error emitted in wavesurfer", error);
  }, []);

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
    // interaction: When the user interacts with the waveform (i.g. clicks or drags on it)
    wavesurfer.on("interaction", handleInteraction);
    // seeking: When the user seeks to a new position
    wavesurfer.on("seeking", handleSeeking);

    return () => {
      wavesurfer.un("error", handleError);
      wavesurfer.un("play", handlePlay);
      wavesurfer.un("pause", handlePause);
      wavesurfer.un("finish", handleFinish);
      wavesurfer.un("audioprocess", handleAudioprocess);
      wavesurfer.un("interaction", handleInteraction);
      wavesurfer.un("seeking", handleSeeking);
    };

    // TODO: implement event handlers for these events:
    // dblClick: When the user double-clicks on the waveform
    // drag: When the user drags the cursor
    // dragstart: When the user starts dragging the cursor
    // dragend: When the user ends dragging the cursor
  }, [
    handleAudioprocess,
    handleError,
    handleFinish,
    handleInteraction,
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
    console.log("clicked backwards");
    // when the user clicks on the backwards button,
    // it should go to the start of the subclip
    const time = inPoint || 0;
    wavesurfer?.seekTo(time);
  }, [inPoint, wavesurfer]);

  const handleClickPlay = useCallback(() => {
    console.log("clicked play");
    wavesurfer?.play();
  }, [wavesurfer]);

  const handleClickPause = useCallback(() => {
    console.log("clicked pause");
    wavesurfer?.pause();
  }, [wavesurfer]);

  const handleClickForwards = useCallback(() => {
    console.log("clicked forwards");
    // when the user clicks on the forwards button,
    // it should go to the end of the subclip
    const time = outPoint || duration;

    if (time !== null) wavesurfer?.seekTo(time);
  }, [duration, outPoint, wavesurfer]);

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

  /*************************
   * IN/OUT POINT HANDLERS *
   *************************/
  // update the state and move the playhead to the new position
  const handleClickSkip = useCallback(
    (val: number) => {
      // calculate new point
      const newPoint = getNewVal(val, duration, {
        prev: playheadPosition,
        defaultValue: 0,
      });

      console.log("newPoint", newPoint, Number.isFinite(newPoint));

      // set playhead
      wavesurfer?.setTime(newPoint);
    },
    [duration, playheadPosition, wavesurfer]
  );

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

  const playheadValue = useMemo(
    () =>
      playheadPosition !== null
        ? formatSecondsToTime(playheadPosition, 2)
        : null,
    [playheadPosition]
  );

  return (
    <>
      <Card className={styles.parent} withBorder>
        <div className={styles.container}>
          {/* song info */}
          <SongCard
            title={title}
            artist={artist || undefined}
            duration={
              subclipDuration ? formatSecondsToTime(subclipDuration) : undefined
            }
          />
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
            <InOutPoint
              value={playheadValue}
              onClickSkip={(val) => handleClickSkip(val)}
              style={{ alignSelf: "flex-end" }}
              iconProps={{ color: colorScheme === "light" ? "dark" : "white" }}
              actionIconGroupSectionProps={{
                c: colorScheme === "light" ? theme.colors.dark[9] : theme.white,
              }}
              onClickLeftPipe={() => handleClickSet(PointType.IN)}
              onClickRightPipe={() => handleClickSet(PointType.OUT)}
            />
            {/* zoom */}
            <ZoomControls zoom={zoom} onClickZoom={handleClickZoom} />
          </div>
          {/* waveform */}
          <div ref={waveformRef} className={styles.waveform} />
          {/* in/out point */}
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
          {/* subclip metadata */}
          <div className={styles.metadata}>
            <TextInput
              className={styles.name}
              label="Name"
              value={name ?? ""}
              onChange={(evt) => setName(evt.target.value)}
              rightSection={
                name && (
                  <ActionIcon
                    size="input-sm"
                    variant="transparent"
                    color={colorScheme === "light" ? "black" : "gray"}
                    onClick={() => setName(null)}
                    tabIndex={-1}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                )
              }
            />
            <ColorInput
              className={styles.colorInput}
              label="Color"
              value={color ?? ""}
              onChange={(val) => setColor(val)}
              swatches={SWATCHES}
              withPicker={false}
              withEyeDropper={false}
              closeOnColorSwatchClick={true}
              rightSection={
                color && (
                  <ActionIcon
                    size="input-sm"
                    variant="transparent"
                    color={colorScheme === "light" ? "black" : "gray"}
                    onClick={() => setColor(null)}
                    tabIndex={-1}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                )
              }
            />
          </div>
        </div>
      </Card>
      <LoadingOverlay visible={loadingAudio} />
    </>
  );
}

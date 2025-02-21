import { AudioEnginePlayMetadata, PlaybackChannelStatus } from "../../types";

type PlaybackChannelOpts = {
  onPlaybackUpdate?: (args: PlaybackChannelStatus) => void;
  allowNull?: boolean;
  crossfadeDuration?: number;
  volume?: number;
};

/**
 * A class to handle the properties & functions for a specific output
 */
export default class PlaybackChannel {
  constructor(
    private _audioContext: AudioContext,
    private _audioContextCreationTime: number,
    opts: PlaybackChannelOpts = {}
  ) {
    const allowNull = opts?.allowNull ?? false;
    const crossfadeDuration = opts?.crossfadeDuration;
    const volume = opts?.volume;

    this.allowNull = allowNull;

    if (crossfadeDuration !== undefined) {
      this.crossfadeDuration = crossfadeDuration;
    }

    if (volume !== undefined) {
      this.volume = volume;
    }

    if (opts?.onPlaybackUpdate) {
      this.onPlaybackUpdate = opts.onPlaybackUpdate;
    }

    this.masterGain = this.audioContext.createGain();
    this.currentGain = this.audioContext.createGain();
    this.nextGain = this.audioContext.createGain();

    // connect gains to the destination
    this.currentGain.connect(this.masterGain);
    this.nextGain.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);
  }

  private get audioContext() {
    return this._audioContext;
  }

  private get audioContextCreationTime() {
    return this._audioContextCreationTime;
  }

  /**
   * When false, the user must explicitly set the device ID.
   * Only Program A should allow default output devices
   */
  private _allowNull = false;

  get allowNull() {
    return this._allowNull;
  }

  private set allowNull(value) {
    this._allowNull = value;
  }

  /**
   * Device to output.
   * If none is provided, will use the default
   */
  private _deviceId: string | null = null;

  get deviceId() {
    return this._deviceId;
  }

  set deviceId(value) {
    this._deviceId = value;
  }

  /**
   * Volume from 0 to 1 to play on this output
   */
  private _volume = 1;

  get volume() {
    return this._volume;
  }

  set volume(value) {
    if (value < 0 || value > 1) throw new Error("Volume must be between 0-1.");

    this._volume = value;

    // update master gain node
    this.masterGain.gain.setValueAtTime(value, 0);

    // update subscribed
    this.handleRAFUpdateCallback();
  }

  public isRunning(): boolean {
    return !!this.currentSource && this.audioContext.state === "running";
  }

  /**
   * Content management
   */
  private _currentSource: AudioBufferSourceNode | null = null; // audio file currently playing
  private _nextSource: AudioBufferSourceNode | null = null; // audio file being used in a cross-fade
  private _cuedSource: AudioBufferSourceNode | null = null; // audio file to play once current has ended

  private get currentSource() {
    return this._currentSource;
  }

  private set currentSource(value) {
    this._currentSource = value;
  }

  private get nextSource() {
    return this._nextSource;
  }

  private set nextSource(value) {
    this._nextSource = value;
  }

  private get cuedSource() {
    return this._cuedSource;
  }

  private set cuedSource(value) {
    this._cuedSource = value;
  }

  private _currentBuffer: AudioBuffer | null = null;
  private _nextBuffer: AudioBuffer | null = null;
  private _cuedBuffer: AudioBuffer | null = null;

  get currentBuffer() {
    return this._currentBuffer;
  }

  set currentBuffer(value) {
    this._currentBuffer = value;
  }

  get nextBuffer() {
    return this._nextBuffer;
  }

  set nextBuffer(value) {
    this._nextBuffer = value;
  }

  get cuedBuffer() {
    return this._cuedBuffer;
  }

  set cuedBuffer(value) {
    this._cuedBuffer = value;
  }

  /**
   * Volume management
   */
  private _masterGain: GainNode | null = null;
  private _currentGain: GainNode | null = null;
  private _nextGain: GainNode | null = null;

  private get masterGain() {
    if (this._masterGain === null)
      throw new Error("Master gain not private set");
    return this._masterGain;
  }

  private set masterGain(value: GainNode) {
    this._masterGain = value;
  }

  private get currentGain() {
    if (this._currentGain === null) throw new Error("Current Gain not set");
    return this._currentGain;
  }

  private set currentGain(value) {
    this._currentGain = value;
  }

  private get nextGain() {
    if (this._nextGain === null) throw new Error("Next Gain not set");
    return this._nextGain;
  }

  private set nextGain(value) {
    this._nextGain = value;
  }

  /**
   * Status for transitions
   */
  private _crossfadeDuration = 0.5;
  private _crossfadeActive = false;
  private _isPlaying = false;

  get crossfadeDuration() {
    return this._crossfadeDuration;
  }

  set crossfadeDuration(value) {
    if (value < 0) throw new Error("Duration must be above 0");

    this._crossfadeDuration = value;

    // update subscribed
    this.handleRAFUpdateCallback();
  }

  get crossfadeActive() {
    return this._crossfadeActive;
  }

  private set crossfadeActive(value) {
    this._crossfadeActive = value;

    // update subscribed
    this.handleRAFUpdateCallback();
  }

  get isPlaying() {
    return this._isPlaying;
  }

  private set isPlaying(value) {
    this._isPlaying = value;

    // update subscribed
    this.handleRAFUpdateCallback();
  }

  /**
   * Status for the file playing
   */
  private _currentElapsed: number | null = null;
  private _currentRemaining: number | null = null;
  private _currentDuration: number | null = null;
  private _currentStartTime: number | null = null;

  get currentElapsed() {
    return this._currentElapsed;
  }

  private set currentElapsed(value) {
    this._currentElapsed = value;
  }

  get currentRemaining() {
    return this._currentRemaining;
  }

  private set currentRemaining(value) {
    this._currentRemaining = value;
  }

  get currentDuration() {
    return this._currentDuration;
  }

  private set currentDuration(value) {
    this._currentDuration = value;
  }

  get currentStartTime() {
    return this._currentStartTime;
  }

  private set currentStartTime(value) {
    this._currentStartTime = value;
  }

  private _nextElapsed: number | null = null;
  private _nextRemaining: number | null = null;
  private _nextDuration: number | null = null;
  private _nextStartTime: number | null = null;

  get nextElapsed() {
    return this._nextElapsed;
  }

  private set nextElapsed(value) {
    this._nextElapsed = value;
  }

  get nextRemaining() {
    return this._nextRemaining;
  }

  private set nextRemaining(value) {
    this._nextRemaining = value;
  }

  get nextDuration() {
    return this._nextDuration;
  }

  private set nextDuration(value) {
    this._nextDuration = value;
  }

  get nextStartTime() {
    return this._nextStartTime;
  }

  private set nextStartTime(value) {
    this._nextStartTime = value;
  }

  private _currentMetadata: AudioEnginePlayMetadata | null = null;
  private _nextMetadata: AudioEnginePlayMetadata | null = null;
  private _cuedMetadata: AudioEnginePlayMetadata | null = null;

  get currentMetadata() {
    return this._currentMetadata;
  }

  private set currentMetadata(value) {
    this._currentMetadata = value;
  }

  get nextMetadata() {
    return this._nextMetadata;
  }

  private set nextMetadata(value) {
    this._nextMetadata = value;
  }

  get cuedMetadata() {
    return this._cuedMetadata;
  }

  private set cuedMetadata(value) {
    this._cuedMetadata = value;
  }

  /**
   * RAF Update
   */
  private _onPlaybackUpdate: ((args: PlaybackChannelStatus) => void) | null =
    null;
  private _rafId: NodeJS.Timeout | null = null;

  get onPlaybackUpdate() {
    return this._onPlaybackUpdate;
  }

  public set onPlaybackUpdate(value) {
    this._onPlaybackUpdate = value;
  }

  private get rafId() {
    return this._rafId;
  }

  private set rafId(value) {
    this._rafId = value;
  }

  /**
   * Methods
   */

  /**
   * Get all the status for this playback channel
   */
  public getStatus(): PlaybackChannelStatus {
    return {
      current: {
        elapsed: this.currentElapsed,
        remaining: this.currentRemaining,
        duration: this.currentDuration,
        metadata: this.currentMetadata,
      },
      next: {
        elapsed: this.nextElapsed,
        remaining: this.nextRemaining,
        duration: this.nextDuration,
        metadata: this.nextMetadata,
      },
      cued: {
        metadata: this.cuedMetadata,
      },
      crossfadeDuration: this.crossfadeDuration,
      crossfadeActive: this.crossfadeActive,
      isPlaying: this.isPlaying,
      volume: this.volume,
      deviceId: this.deviceId,
    };
  }

  /**
   * Update subscribed updates
   */
  private handleRAFUpdateCallback() {
    if (this.onPlaybackUpdate) {
      this.onPlaybackUpdate({
        ...this.getStatus(),
      });
    }
  }

  private startRAFUpdate() {
    // if there's an interval already running, don't start this
    if (this.rafId) return;

    const INTERVAL = 100;
    const update = () => {
      if (this.isRunning()) {
        const t = new Date().getTime();

        if (this.currentStartTime !== null && this.currentDuration !== null) {
          // if this is running, calculate the elapsed
          const timeItStarted =
            this.currentStartTime * 1000 + this.audioContextCreationTime;
          const elapsed = (t - timeItStarted) / 1000;

          // if elapsed is past the duration, assume it has ended
          if (elapsed >= this.currentDuration) {
            this.currentElapsed = this.currentDuration;
            this.currentRemaining = 0;
          } else {
            this.currentElapsed = elapsed;

            if (this.currentDuration !== null) {
              this.currentRemaining = this.currentDuration - elapsed;
            }
          }
        }

        if (this.nextStartTime !== null && this.nextDuration !== null) {
          // if this is running, calculate the elapsed
          const timeItStarted =
            this.nextStartTime * 1000 + this.audioContextCreationTime;
          const elapsed = (t - timeItStarted) / 1000;

          // if elapsed is past the duration, assume it has ended
          if (elapsed >= this.nextDuration) {
            this.nextElapsed = this.nextDuration;
            this.nextRemaining = 0;
          } else {
            this.nextElapsed = elapsed;

            if (this.nextDuration !== null) {
              this.nextRemaining = this.nextDuration - elapsed;
            }
          }
        }
      }

      // update subscribed
      this.handleRAFUpdateCallback();

      this.rafId = setTimeout(update, INTERVAL);
    };

    this.rafId = setTimeout(update, INTERVAL);
  }

  private stopRAFUpdate() {
    if (this.rafId) {
      clearTimeout(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Handle when the current source naturally ends
   */
  private handleSourceEnded() {
    // TODO: handle cued track here
    // only handle if this is the current source ending naturally
    if (this.isPlaying && !this.crossfadeActive) {
      console.log("Audio playback ended naturally");

      // update playing state
      this.isPlaying = false;

      // update timing information
      if (this.currentDuration !== null) {
        this.currentElapsed = this.currentDuration;
        this.currentRemaining = 0;
      }

      // stop RAF updates
      this.stopRAFUpdate();

      // notify subscribers of the state change
      this.handleRAFUpdateCallback();
    }
  }

  /**
   * Create a file and make it ready to play
   * @param buffer Audio file to play
   * @param gainNode Destination to output
   */
  private createSource(
    buffer: AudioBuffer,
    gainNode: GainNode
  ): AudioBufferSourceNode {
    const source = this.audioContext.createBufferSource();

    source.buffer = buffer;
    source.connect(gainNode);

    // listen for track end
    source.onended = () => {
      this.handleSourceEnded();
    };

    return source;
  }

  /**
   * Transition from one file to another
   * @param nextBuffer Audio file to play
   * @param crossfadeDuration Time in seconds to fade out the old file and fade in the new one
   * @param nextMetadata Metadata for the next file
   */
  private crossfade(
    nextBuffer: AudioBuffer,
    crossfadeDuration: number,
    nextMetadata?: AudioEnginePlayMetadata
  ) {
    let cleanupTimeout: NodeJS.Timeout | null = null;

    try {
      const currentTime = this.audioContext.currentTime;

      this.crossfadeActive = true;

      // set up the next source
      this.nextSource = this.createSource(nextBuffer, this.nextGain);
      this.nextSource.start();
      this.nextBuffer = nextBuffer;

      this.nextMetadata = nextMetadata || null;
      this.nextDuration = nextBuffer.duration;
      this.nextStartTime = currentTime;
      this.nextElapsed = 0;

      // crossfade the sources
      const crossFadeTime = currentTime + crossfadeDuration;

      this.currentGain.gain.setValueAtTime(1, currentTime);
      this.currentGain.gain.linearRampToValueAtTime(0, crossFadeTime);

      this.nextGain.gain.setValueAtTime(0, currentTime);
      this.nextGain.gain.linearRampToValueAtTime(1, crossFadeTime);

      // ensure the outgoing source stops
      this.currentSource?.stop(crossFadeTime + 0.1);

      this.startRAFUpdate();

      // cleanup after the crossfade
      cleanupTimeout = setTimeout(() => {
        try {
          if (this.currentSource) this.currentSource.stop();

          this.currentSource = this.nextSource;
          this.currentGain = this.nextGain;

          // state
          this.currentBuffer = this.nextBuffer;
          this.currentMetadata = this.nextMetadata;
          this.currentDuration = this.nextDuration;
          this.currentStartTime = this.nextStartTime;
          this.currentElapsed = this.nextElapsed;

          // reset next
          this.nextBuffer = null;
          this.nextMetadata = null;
          this.nextDuration = null;
          this.nextStartTime = null;
          this.nextElapsed = null;
        } catch (err) {
          alert("Error cleaning up crossfade");
          console.error("Error cleaning up crossfade", err);
        } finally {
          // clear timeout
          cleanupTimeout = null;
          this.crossfadeActive = false;
        }
      }, crossfadeDuration * 1000);
    } catch (err) {
      this.crossfadeActive = false;

      alert("Error performing crossfade");
      console.error("Error performing crossfade", err);

      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
        this.crossfadeActive = false;
      }
    }
  }

  /**
   * Play a file out the destination
   * @param buffer Audio file to play
   * @param metadata Metadata for the file
   */
  public play(buffer: AudioBuffer, metadata?: AudioEnginePlayMetadata) {
    const crossfadeDuration = this.crossfadeDuration;

    // if there's a source already playing, and there's a crossfade duration,
    // perform a crossfade
    if (this.currentSource && crossfadeDuration > 0) {
      this.crossfade(buffer, crossfadeDuration, metadata);
    } else {
      // if there's a file, stop it
      if (this.currentSource) {
        this.currentSource.onended = null; // remove previous listener
        this.currentSource.stop();
      }

      // otherwise, setup the source and start playing immediately
      const currentTime = this.audioContext.currentTime;

      this.currentSource = this.createSource(buffer, this.currentGain);
      this.currentSource.start();
      this.currentBuffer = buffer;

      this.currentMetadata = metadata || null;
      this.currentDuration = buffer.duration;
      this.currentStartTime = currentTime;
      this.currentElapsed = 0;
    }

    this.isPlaying = true;

    // TODO: setup a timeout for when the file finishes to check for a cued file

    // start updates
    this.startRAFUpdate();
  }

  /**
   * Pause the file currently playing
   */
  public pause() {
    // only perform the pause if a crossfade isn't in progress
    if (!this.crossfadeActive && this.isRunning() && this.currentSource) {
      // stop updates
      this.stopRAFUpdate();

      // save the current elapsed time
      this.currentElapsed =
        this.audioContext.currentTime - (this.currentStartTime ?? 0);

      // pause the source
      this.currentSource.stop();

      // clear the source
      this.currentSource = null;
      this.isPlaying = false;
    }
  }

  /**
   * Resume the previously paused file
   */
  public resume() {
    if (
      !this.crossfadeActive &&
      this.currentBuffer &&
      this.currentElapsed !== null &&
      this.currentDuration !== null
    ) {
      // start the new source from the pause point
      this.currentSource = this.createSource(
        this.currentBuffer,
        this.currentGain
      );
      this.currentSource.start(0, this.currentElapsed);

      // update the state
      this.isPlaying = true;
      this.currentStartTime =
        this.audioContext.currentTime - this.currentElapsed;

      // resume updates
      this.startRAFUpdate();
    }
  }

  /**
   * Set the current time in the file, regardless if its playing
   */
  public reRack(startPoint = 0) {
    if (
      !this.crossfadeActive &&
      this.isRunning() &&
      this.currentSource &&
      this.currentBuffer
    ) {
      // re-rack while its playing
      // stop updates
      this.stopRAFUpdate();

      // pause the source
      this.currentSource.stop();
      this.currentSource = null;

      // create a new source to play
      const newSource = this.createSource(this.currentBuffer, this.currentGain);

      // start the new source from the pause point
      newSource.start(0, startPoint);

      // set states
      this.currentSource = newSource;
      this.currentDuration = this.currentBuffer.duration;
      this.currentStartTime = this.audioContext.currentTime;
      this.currentElapsed = startPoint;
      this.isPlaying = true;

      // start updates
      this.startRAFUpdate();
    } else if (this.currentBuffer && this.currentElapsed !== null) {
      // edit the time elapsed (used when resumed)
      this.currentElapsed = startPoint;
    }
  }

  /**
   * Stop all files and remove them from the state
   */
  public stop() {
    if (this.currentSource) {
      this.currentSource.onended = null;
      this.currentSource.stop();
      this.currentSource = null;
      this.currentBuffer = null;
      this.currentMetadata = null;
      this.currentDuration = null;
      this.currentStartTime = null;
      this.currentElapsed = null;
      this.currentRemaining = null;
    }

    if (this.nextSource) {
      this.nextSource.onended = null;
      this.nextSource.stop();
      this.nextSource = null;
      this.nextBuffer = null;
      this.nextMetadata = null;
      this.nextDuration = null;
      this.nextStartTime = null;
      this.nextElapsed = null;
      this.nextRemaining = null;
    }

    this.isPlaying = false;
    this.crossfadeActive = false;

    this.stopRAFUpdate();
  }

  public async setDestination(newDeviceId: string | null) {
    try {
      // stop all audio files
      this.stop();

      // disconnect the master gain node
      this.masterGain.disconnect();

      // stop all audio files
      this.stop();

      // disconnect the master gain node
      this.masterGain.disconnect();

      // create a new MediaStreamAudioDestinationNode
      const destinationNode = this.audioContext.createMediaStreamDestination();

      // connect the master gain to the new destination node
      this.masterGain.connect(destinationNode);

      // create an HTMLAudioElement and attach the destination stream
      const audioElement = new Audio();
      audioElement.srcObject = destinationNode.stream;

      // set the sink ID (output device)
      if (newDeviceId) {
        await audioElement.setSinkId(newDeviceId);
      } else {
        if (this.allowNull) {
          alert(
            "This destination will use the default destination for the operating system."
          );
        } else {
          alert("This output cannot be set to default. It will be disabled.");
        }
      }

      if (newDeviceId || this.allowNull) {
        // start the audio element to route the audio
        await audioElement.play();
      }

      // update the device ID
      this.deviceId = newDeviceId;

      console.log(
        `Output device successfully changed to device ID "${newDeviceId}".`,
        audioElement.readyState
      );

      // update metadata
      this.handleRAFUpdateCallback();
    } catch (err) {
      alert("Unable to change output destination");
      console.error("Unable to change output destination", err);
    }
  }
}

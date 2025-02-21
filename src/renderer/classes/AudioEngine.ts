import { SongCardProps } from "../components/SongCard";

type AudioFileMetadata = Pick<SongCardProps, "artist" | "title" | "image">;

/**
 * TODO: add sound effect to test chime
 * use this sfx: https://pixabay.com/sound-effects/chime-and-chomp-84419/
 * under this license: https://pixabay.com/service/license-summary/
 */

export default class AudioEngine {
  private _audioContext: AudioContext | null = null;
  private _audioContextCreationTime: number | null = null;

  private _currentSource: AudioBufferSourceNode | null = null;
  private _nextSource: AudioBufferSourceNode | null = null;
  private _currentBuffer: AudioBuffer | null = null;
  private _nextBuffer: AudioBuffer | null = null;

  private _masterGain: GainNode | null = null;
  private _currentGain: GainNode | null = null;
  private _nextGain: GainNode | null = null;

  private _crossfadeDuration = 0.5;
  private _crossfadeActive = false;

  private _currentMetadata: AudioFileMetadata | null = null;
  private _currentStartTime: number | null = null;
  private _currentDuration: number | null = null;
  private _currentElapsed: number | null = null;
  private _currentRemaining: number | null = null;

  private _nextMetadata: AudioFileMetadata | null = null;
  private _nextStartTime: number | null = null;
  private _nextDuration: number | null = null;
  private _nextElapsed: number | null = null;
  private _nextRemaining: number | null = null;

  private _rafId: NodeJS.Timeout | null = null;
  private _hasMedia = false;
  private _isPlaying = false;
  private _deviceIdProgramA: string | null = null;

  private _volume = 1;

  public onMetadataChange?: (() => void) | null;
  public onRAFUpdate?: (() => void) | null;
  public onVolumeUpdate?: (() => void) | null;

  private get audioContext(): AudioContext {
    if (!this._audioContext) throw new Error("Audio context not initialized");
    return this._audioContext;
  }

  private set audioContext(value: AudioContext) {
    this._audioContext = value;
  }

  public get audioContextCreationTime() {
    if (this._audioContextCreationTime === null) {
      throw new Error("Audio context not initialized.");
    }

    return this._audioContextCreationTime;
  }

  private set audioContextCreationTime(value: number) {
    this._audioContextCreationTime = value;
  }

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

  private get currentBuffer() {
    return this._currentBuffer;
  }

  private set currentBuffer(value) {
    this._currentBuffer = value;
  }

  private get nextBuffer() {
    return this._nextBuffer;
  }

  private set nextBuffer(value) {
    this._nextBuffer = value;
  }

  private get currentGain() {
    if (this._currentGain === null)
      throw new Error("Current gain not private set");
    return this._currentGain;
  }

  private set currentGain(value: GainNode) {
    this._currentGain = value;
  }

  private get nextGain() {
    if (this._nextGain === null) throw new Error("Next gain not private set");
    return this._nextGain;
  }

  private set nextGain(value: GainNode) {
    this._nextGain = value;
  }

  private get masterGain() {
    if (this._masterGain === null)
      throw new Error("Master gain not private set");
    return this._masterGain;
  }

  private set masterGain(value: GainNode) {
    this._masterGain = value;
  }

  public get crossfadeDuration() {
    return this._crossfadeDuration;
  }

  public set crossfadeDuration(value: number) {
    if (value < 0) {
      throw new Error("Crossfade duration must be greater than 0.");
    }

    this._crossfadeDuration = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  public get crossfadeActive() {
    return this._crossfadeActive;
  }

  private set crossfadeActive(value) {
    this._crossfadeActive = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  // metadata / state
  public get currentMetadata() {
    return this._currentMetadata;
  }

  private set currentMetadata(value) {
    this._currentMetadata = value;

    if (this.onMetadataChange) {
      this.onMetadataChange();
    }
  }

  public get currentStartTime() {
    return this._currentStartTime;
  }

  private set currentStartTime(value) {
    this._currentStartTime = value;

    if (this.onMetadataChange) {
      this.onMetadataChange();
    }
  }

  public get currentDuration() {
    return this._currentDuration;
  }

  private set currentDuration(value) {
    this._currentDuration = value;

    if (this.onMetadataChange) {
      this.onMetadataChange();
    }
  }

  public get currentElapsed() {
    return this._currentElapsed;
  }

  private set currentElapsed(value) {
    this._currentElapsed = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  public get currentRemaining() {
    return this._currentRemaining;
  }

  private set currentRemaining(value) {
    this._currentRemaining = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  public get nextMetadata() {
    return this._nextMetadata;
  }

  private set nextMetadata(value) {
    this._nextMetadata = value;

    if (this.onMetadataChange) {
      this.onMetadataChange();
    }
  }

  public get nextStartTime() {
    return this._nextStartTime;
  }

  private set nextStartTime(value) {
    this._nextStartTime = value;

    if (this.onMetadataChange) {
      this.onMetadataChange();
    }
  }

  public get nextDuration() {
    return this._nextDuration;
  }

  private set nextDuration(value) {
    this._nextDuration = value;

    if (this.onMetadataChange) {
      this.onMetadataChange();
    }
  }

  public get nextElapsed() {
    return this._nextElapsed;
  }

  private set nextElapsed(value) {
    this._nextElapsed = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  public get nextRemaining() {
    return this._nextRemaining;
  }

  private set nextRemaining(value) {
    this._nextRemaining = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  // global status
  private get rafId() {
    return this._rafId;
  }

  private set rafId(value) {
    this._rafId = value;
  }

  public get hasMedia() {
    return this._hasMedia;
  }

  private set hasMedia(value) {
    this._hasMedia = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  public get isPlaying() {
    return this._isPlaying;
  }

  private set isPlaying(value) {
    this._isPlaying = value;

    if (this.onRAFUpdate) {
      this.onRAFUpdate();
    }
  }

  public get deviceIdProgramA() {
    return this._deviceIdProgramA;
  }

  public set deviceIdProgramA(value) {
    this._deviceIdProgramA = value;
  }

  public get volume() {
    return this._volume;
  }

  public set volume(value) {
    if (value < 0 || value > 1) {
      throw new Error("Volume must be between 0 and 1.");
    }

    this.masterGain.gain.setValueAtTime(value, 0);
  }

  public isRunning(): boolean {
    return !!this.currentSource && this.audioContext.state === "running";
  }

  private startRAFUpdate() {
    const update = () => {
      if (this.isRunning()) {
        const t = new Date().getTime();

        if (this.currentStartTime !== null && this.currentDuration !== null) {
          // if this is running, calculate
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
          // if this is running, calculate
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

      this.rafId = setTimeout(update, 100);
    };

    this.rafId = setTimeout(update, 100);
  }

  private stopRAFUpdate() {
    if (this.rafId !== null) {
      clearTimeout(this.rafId);
      this.rafId = null;
    }
  }

  constructor() {
    this.audioContext = new AudioContext();
    this.audioContextCreationTime = new Date().getTime();

    this.currentSource = null;
    this.nextSource = null;
    this.currentGain = this.audioContext.createGain();
    this.nextGain = this.audioContext.createGain();
    this.masterGain = this.audioContext.createGain();
    this.crossfadeDuration = 3; // Seconds

    // Connect gains to the destination
    this.currentGain.connect(this.masterGain);
    this.nextGain.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);
  }

  async loadAudio(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  private createSource(
    buffer: AudioBuffer,
    gainNode: GainNode
  ): AudioBufferSourceNode {
    const source = this.audioContext.createBufferSource();

    source.buffer = buffer;
    source.connect(gainNode);

    return source;
  }

  private crossfade(nextBuffer: AudioBuffer, nextMetadata?: AudioFileMetadata) {
    let cleanupTimeout: NodeJS.Timeout | null = null;

    try {
      this.crossfadeActive = true;

      // set up the next source
      this.nextSource = this.createSource(nextBuffer, this.nextGain);
      this.nextSource.start();
      this.nextBuffer = nextBuffer;

      this.nextMetadata = nextMetadata || null;
      this.nextDuration = nextBuffer.duration;
      this.nextStartTime = this.audioContext.currentTime;
      this.nextElapsed = 0; // Reset elapsed time

      // crossfade the volumes
      const currentTime = this.audioContext.currentTime;
      const crossFadeTime = currentTime + this.crossfadeDuration;

      this.currentGain.gain.setValueAtTime(1, currentTime);
      this.currentGain.gain.linearRampToValueAtTime(0, crossFadeTime);

      this.nextGain.gain.setValueAtTime(0, currentTime);
      this.nextGain.gain.linearRampToValueAtTime(1, crossFadeTime);

      this.startRAFUpdate(); // Start RAF updates

      // clean up after the crossfade
      cleanupTimeout = setTimeout(() => {
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
        this.nextSource = null;
        this.nextGain = this.audioContext.createGain();
        this.nextGain.connect(this.masterGain);

        this.nextBuffer = null;
        this.nextMetadata = null;
        this.nextDuration = null;
        this.nextStartTime = null;
        this.nextElapsed = null;

        // clear timeout
        cleanupTimeout = null;
        this.crossfadeActive = false;
      }, this.crossfadeDuration * 1000);
    } catch (err) {
      console.error("Error performing crossfade", err);
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
        this.crossfadeActive = false;
      }
    }
  }

  play(buffer: AudioBuffer, metadata?: AudioFileMetadata) {
    if (this.currentSource) {
      this.crossfade(buffer, metadata);
    } else {
      this.currentSource = this.createSource(buffer, this.currentGain);
      this.currentSource.start();
      this.currentBuffer = buffer;

      this.currentMetadata = metadata || null;
      this.currentDuration = buffer.duration;
      this.currentStartTime = this.audioContext.currentTime;
      this.currentElapsed = 0; // Reset elapsed time
      this.startRAFUpdate(); // Start RAF updates
    }

    console.log("AudioContext state:", this.audioContext.state);
    console.log("Master gain connected:", this.masterGain.numberOfOutputs);
    console.log(
      "Destination channel count:",
      this.audioContext.destination.channelCount
    );
    console.log(
      "Number of outputs for masterGain:",
      this.masterGain.numberOfOutputs
    );

    this.isPlaying = true;
    this.hasMedia = true;
  }

  public pause() {
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
      this.hasMedia = true;
    }
  }

  public resume() {
    if (
      !this.crossfadeActive &&
      this.currentBuffer &&
      this.currentElapsed !== null &&
      this.currentDuration !== null
    ) {
      // create a new source
      const newSource = this.createSource(this.currentBuffer, this.currentGain);

      // start the new source from the pause point
      newSource.start(0, this.currentElapsed);

      // update the state
      this.currentSource = newSource;
      this.isPlaying = true;
      this.hasMedia = true;
      this.currentStartTime =
        this.audioContext.currentTime - this.currentElapsed;

      // resume updated
      this.startRAFUpdate();
    }
  }

  public reRack(startPoint = 0) {
    if (
      !this.crossfadeActive &&
      this.isRunning() &&
      this.currentSource &&
      this.currentBuffer
    ) {
      // re-rack while it's on air
      // stop updates
      this.stopRAFUpdate();

      // pause the source
      this.currentSource.stop();
      this.currentSource = null;

      // create a new source
      this.currentSource = this.createSource(
        this.currentBuffer,
        this.currentGain
      );
      this.currentSource.start();

      // set states
      this.currentDuration = this.currentBuffer.duration;
      this.currentStartTime = this.audioContext.currentTime;
      this.currentElapsed = 0;
      this.isPlaying = true;
      this.hasMedia = true;

      // start updates
      this.startRAFUpdate();
    } else if (this.currentBuffer && this.currentElapsed !== null) {
      // edit the time elapsed
      this.currentElapsed = startPoint;
    }
  }

  public stop() {
    if (this.currentSource) {
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
    this.hasMedia = false;
    this.crossfadeActive = false;

    this.stopRAFUpdate(); // Stop RAF updates
  }

  public async setDestinationProgramA(newDeviceId: string | null) {
    try {
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
        console.warn("Not setting device ID. Will resolve to default.");
      }

      // start the audio element to route the audio
      await audioElement.play();

      // update the device ID
      this.deviceIdProgramA = newDeviceId;

      console.log(
        `Output device successfully changed to device ID "${newDeviceId}"`,
        audioElement.readyState
      );
    } catch (err) {
      console.error("Failed to update audio destination", err);
    }
  }
}

import { SongCardProps } from "../components/SongCard";

type AudioFileMetadata = Pick<SongCardProps, "artist" | "title" | "image">;

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

  private _currentMetadata: AudioFileMetadata | null = null;
  private _currentStartTime: number | null = null;
  private _currentDuration: number | null = null;
  private _currentElapsed: number | null = null;
  private _currentRemaining: number | null = null;

  private _rafId: number | null = null;
  private _hasMedia = false;
  private _isPlaying = false;

  public onMetadataChange?: (() => void) | null;
  public onRAFUpdate?: (() => void) | null;

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
    console.log("setting audio-context-creation-time", value);
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

  private get crossfadeDuration() {
    return this._crossfadeDuration;
  }

  private set crossfadeDuration(value: number) {
    this._crossfadeDuration = value;
  }

  public get currentMetadata() {
    return this._currentMetadata;
  }

  private set currentMetadata(value) {
    console.log("setting current metadata", value);
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

  public isRunning(): boolean {
    return !!this.currentSource && this.audioContext.state === "running";
  }

  private startRAFUpdate() {
    const update = () => {
      if (this.isRunning() && this.currentStartTime !== null) {
        const currentTime = new Date().getTime();
        const timeItStarted =
          this.currentStartTime * 1000 + this.audioContextCreationTime;
        const elapsed = (currentTime - timeItStarted) / 1000;

        this.currentElapsed = elapsed;

        if (this.currentDuration !== null) {
          this.currentRemaining = this.currentDuration - elapsed;
        }
      }

      this.rafId = requestAnimationFrame(update);
    };

    this.rafId = requestAnimationFrame(update);
  }

  private stopRAFUpdate() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
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

  private crossfade(nextBuffer: AudioBuffer) {
    // set up the next source
    this.nextSource = this.createSource(nextBuffer, this.nextGain);
    this.nextSource.start();

    // crossfade the volumes
    const currentTime = this.audioContext.currentTime;
    const crossFadeTime = currentTime + this.crossfadeDuration;

    this.currentGain.gain.setValueAtTime(1, currentTime);
    this.currentGain.gain.linearRampToValueAtTime(0, crossFadeTime);

    this.nextGain.gain.setValueAtTime(0, currentTime);
    this.nextGain.gain.linearRampToValueAtTime(1, crossFadeTime);

    // clean up after the crossfade
    setTimeout(() => {
      if (this.currentSource) this.currentSource.stop();

      this.currentSource = this.nextSource;
      this.currentGain = this.nextGain;

      this.nextSource = null;
      this.nextGain = this.audioContext.createGain();
      this.nextGain.connect(this.masterGain);
    }, this.crossfadeDuration * 1000);
  }

  play(buffer: AudioBuffer, metadata?: AudioFileMetadata) {
    if (this.currentSource) {
      this.crossfade(buffer);
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

    this.isPlaying = true;
    this.hasMedia = true;
  }

  public pause() {
    if (this.isRunning() && this.currentSource) {
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

      // resume updated
      this.startRAFUpdate();
    }
  }

  stop() {
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
    }

    this.isPlaying = false;
    this.hasMedia = false;

    this.stopRAFUpdate(); // Stop RAF updates
  }
}

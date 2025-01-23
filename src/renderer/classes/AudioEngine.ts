export default class AudioEngine {
  private _audioContext: AudioContext | null = null;
  private _currentSource: AudioBufferSourceNode | null = null;
  private _nextSource: AudioBufferSourceNode | null = null;
  private _currentGain: GainNode | null = null;
  private _nextGain: GainNode | null = null;
  private _masterGain: GainNode | null = null;
  private _crossfadeDuration = 1;

  private get audioContext(): AudioContext {
    if (!this._audioContext) throw new Error("Audio context not initialized");
    return this._audioContext;
  }

  private set audioContext(value: AudioContext) {
    this._audioContext = value;
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

  constructor() {
    this.audioContext = new AudioContext();
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

  play(buffer: AudioBuffer) {
    if (this.currentSource) {
      this.crossfade(buffer);
    } else {
      this.currentSource = this.createSource(buffer, this.currentGain);
      this.currentSource.start();
    }
  }

  stop() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }

    if (this.nextSource) {
      this.nextSource.stop();
      this.nextSource = null;
    }
  }
}

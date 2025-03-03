import {
  AudioEnginePlayMetadata,
  AudioEnginePlayPgmOpts,
  Output,
  PlaybackChannelStatus,
} from "../../types";
import PlaybackChannel from "./PlaybackChannel";

export default class AudioEngine {
  constructor() {
    this.audioContext = new AudioContext();
    this.audioContextCreationTime = new Date().getTime();

    this.channels = {
      [Output.PGM_A]: new PlaybackChannel(
        this.audioContext,
        this.audioContextCreationTime,
        { allowNull: true }
      ),
      [Output.PGM_B]: new PlaybackChannel(
        this.audioContext,
        this.audioContextCreationTime,
        { allowNull: false }
      ),
      [Output.PFL]: new PlaybackChannel(
        this.audioContext,
        this.audioContextCreationTime,
        { allowNull: false, crossfadeDuration: 0 }
      ),
    };
  }

  /**
   * Audio Context
   */
  // shared audio context playing all audio
  private _audioContext: AudioContext | null = null;

  private get audioContext(): AudioContext {
    if (!this._audioContext) throw new Error("Audio context not initialized");
    return this._audioContext;
  }

  private set audioContext(value: AudioContext) {
    this._audioContext = value;
  }

  // the time the audio context was created
  // needed for calculating time remaining in a track
  private _audioContextCreationTime: number | null = null;

  public get audioContextCreationTime() {
    if (this._audioContextCreationTime === null) {
      throw new Error("Audio context not initialized.");
    }

    return this._audioContextCreationTime;
  }

  private set audioContextCreationTime(value: number) {
    this._audioContextCreationTime = value;
  }

  /**
   * Output channels
   */
  private _channels: Record<Output, PlaybackChannel | null> = {
    [Output.PGM_A]: null,
    [Output.PGM_B]: null,
    [Output.PFL]: null,
  };

  private get channels() {
    return this._channels;
  }

  private set channels(value) {
    this._channels = value;
  }

  /**
   * Convert the file to a buffer for output
   */
  public async loadAudio(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  /**
   * Play a test file on the specified buffer
   */
  public async testOutput(output: Output, buffer: AudioBuffer, delay = 250) {
    const channel = this.channels[output];

    if (channel) {
      // confirm it's allowed
      if (channel.allowNull || channel.deviceId) {
        // stop the current content
        channel.stop();

        // play the test file
        setTimeout(() => channel.play(buffer, { crossfadeDuration: 0 }), delay);
      }
    }
  }

  /**
   * Get the current device ID
   * @param output The output channel to get a device ID for
   * @returns The device ID assigned to this output.
   * If `null`, it will use the OS's default device
   */
  public async getDevice(output: Output) {
    return this.channels[output]?.deviceId;
  }

  /**
   * Set a new device
   * @param output The output channel to assign a new ID
   * @param newDeviceId The corresponding device ID to use as an output.
   * If `null`, it will use the OS's default device
   */
  public async setDevice(output: Output, newDeviceId: string | null) {
    const channel = this.channels[output];

    if (channel) {
      await channel.setDestination(newDeviceId);
    }
  }

  /**
   * The current volume from 0-1 for the given output
   * @param output The output channel to get the volume for
   * @returns The current volume level
   */
  public getVolume(output: Output) {
    return this.channels[output]?.volume;
  }

  /**
   * Adjust the volume for a specific output
   */
  public setVolume(output: Output, newVolume: number) {
    if (newVolume < 0 || newVolume > 1) {
      alert("Volume must be between 0% - 100%.");
    }

    const channel = this.channels[output];

    if (channel) {
      channel.volume = newVolume;
    }
  }

  /**
   * Adjust the waveform for the oscillator
   */
  public setOscillatorWaveform(output: Output, waveform: OscillatorType) {
    const channel = this.channels[output];

    if (channel) {
      channel.oscillatorWaveform = waveform;
    }
  }

  /**
   * Adjust the frequency for the oscillator
   */
  public setOscillatorFrequency(output: Output, frequency: number) {
    const channel = this.channels[output];

    if (channel) {
      channel.oscillatorFrequency = frequency;
    }
  }

  /**
   * Adjust the detune for the oscillator
   */
  public setOscillatorDetune(output: Output, detune: number) {
    const channel = this.channels[output];

    if (channel) {
      channel.oscillatorDetune = detune;
    }
  }

  /**
   * Start the oscillator
   */
  public startOscillator(output: Output) {
    this.channels[output]?.startOscillator();
  }

  /**
   * Stop the oscillator
   */
  public stopOscillator(output: Output) {
    this.channels[output]?.stopOscillator();
  }

  /**
   * Get the current crossfade duration for program outputs
   */
  public getCrossfadeDurationPgm() {
    return this.channels[Output.PGM_A]?.crossfadeDuration;
  }

  /**
   * Set the crossfade duration for the program outputs
   */
  public setCrossfadeDurationPgm(newCrossfadeDuration: number) {
    const channelA = this.channels[Output.PGM_A];
    const channelB = this.channels[Output.PGM_B];

    if (channelA && channelB) {
      channelA.crossfadeDuration = newCrossfadeDuration;
      channelB.crossfadeDuration = newCrossfadeDuration;
    }
  }

  /**
   * Get the status for a playback channel.
   * If no playback channel is defined, all will be returned
   * @param output The output channel to get the status for
   */
  public getStatus(output: Output): PlaybackChannelStatus | null;
  public getStatus(): Record<Output, PlaybackChannelStatus> | null;
  public getStatus(
    output?: Output
  ): PlaybackChannelStatus | Record<Output, PlaybackChannelStatus> | null {
    if (output) {
      const channel = this.channels[output];

      if (channel) {
        return {
          ...channel.getStatus(),
        };
      }

      return null;
    }

    const channelPgmA = this.channels[Output.PGM_A];
    const channelPgmB = this.channels[Output.PGM_B];
    const channelPfl = this.channels[Output.PFL];

    if (channelPgmA && channelPgmB && channelPfl) {
      return {
        [Output.PGM_A]: { ...channelPgmA.getStatus() },
        [Output.PGM_B]: { ...channelPgmB.getStatus() },
        [Output.PFL]: { ...channelPfl.getStatus() },
      };
    }

    return null;
  }

  /**
   * Allow the user to change the playback update handler
   */
  public setOnChangeUpdate(
    output: Output,
    callback: ((args: PlaybackChannelStatus) => void) | null
  ) {
    const channel = this.channels[output];

    if (channel) {
      channel.onPlaybackUpdate = callback;
    }
  }

  /**
   * returns current sample rate (useful for frequency calculations)
   */
  public get sampleRate(): number {
    return this.audioContext.sampleRate;
  }

  /**
   * get frequency data (e.g. for spectrum visualization) for a
   * specific output destination
   */
  public getFrequencyData(output: Output) {
    const channel = this.channels[output];

    if (channel) {
      return channel.getFrequencyData();
    }
  }

  /**
   * get time domain data (e.g. for volume or waveform) for a
   * specific output destination
   */
  public getTimeDomainData(output: Output) {
    const channel = this.channels[output];

    if (channel) {
      return channel.getTimeDomainData();
    }
  }

  /**
   * Take the audio buffer and send it out the main output
   * @param bufferA Buffer to play
   * @param opts Optional properties & metadata for the file
   */
  public play(bufferA: AudioBuffer, opts: AudioEnginePlayPgmOpts = {}) {
    const optArgs: AudioEnginePlayMetadata = {
      crossfadeDuration: opts?.crossfadeDuration,
      audioFile: opts?.audioFile,
      subclipID: opts?.subclipID,
      button: opts?.button,
    };

    this.channels[Output.PGM_A]?.play(bufferA, optArgs);

    // if there's a pgm b output, activate that source
    if (this.channels[Output.PGM_B]?.deviceId) {
      const bufferB = opts?.bufferB ?? bufferA;
      this.channels[Output.PGM_B]?.play(bufferB, optArgs);
    }
  }

  /**
   * Stop the audio playing on program
   */
  public stop() {
    this.channels[Output.PGM_A]?.stop();
    this.channels[Output.PGM_B]?.stop();
  }

  /**
   * Pause the audio currently playing on program
   */
  public pause() {
    this.channels[Output.PGM_A]?.pause();
    this.channels[Output.PGM_B]?.pause();
  }

  /**
   * Resume the audio currently paused on program
   */
  public resume() {
    this.channels[Output.PGM_A]?.resume();
    this.channels[Output.PGM_B]?.resume();
  }

  /**
   * Set the current time in the audio file, regardless if it's playing
   */
  public reRack(startPoint?: number) {
    this.channels[Output.PGM_A]?.reRack(startPoint);
    this.channels[Output.PGM_B]?.reRack(startPoint);
  }

  /*
  // play the file in pre-fade listen
  public preFadeListen(
    buffer: AudioBuffer,
    opts: AudioEnginePlayMetadata = {}
  ) {}

  // duck the program audio, then play the sound effect
  public playSoundEffect(
    buffer: AudioBuffer,
    opts: AudioEnginePlaySfxOpts = {}
  ) {}

  // cue the file to play when the current file ends
  public cue(bufferA: AudioBuffer, opts: AudioEnginePlayPgmOpts = {}) {
    const bufferB = opts?.bufferB ?? bufferA;
  }
    */
}

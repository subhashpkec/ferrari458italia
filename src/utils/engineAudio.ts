/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari Tipo F136 FB 4.5L 90° Flat-Plane V8 Audio Synthesizer
 * Built using native Web Audio API - zero external audio dependencies.
 * Flat-plane crankshaft firing characteristic (180° crank pins = 4 evenly spaced firing pulses per rev).
 */

class EngineSoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentRPM: number = 1000; // Idle RPM
  private targetRPM: number = 1000;
  private driveMode: "WET" | "SPORT" | "RACE" | "CT_OFF" | "CST_OFF" = "RACE";

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private oscFundamental: OscillatorNode | null = null;
  private oscHarmonic2: OscillatorNode | null = null;
  private oscHarmonic3: OscillatorNode | null = null;
  private oscHarmonic4: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private noiseGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private distortion: WaveShaperNode | null = null;

  private animFrameId: number | null = null;
  private onRpmUpdateCallback?: (rpm: number) => void;

  public setRpmCallback(cb: (rpm: number) => void) {
    this.onRpmUpdateCallback = cb;
  }

  private makeDistortionCurve(amount: number = 20): Float32Array {
    const k = amount;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public async start(): Promise<boolean> {
    if (this.isRunning) return true;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      if (this.ctx.state === "suspended") {
        await this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.42, now + 0.3);
      this.masterGain.connect(this.ctx.destination);

      // Resonant bandpass filter (simulates intake manifold & exhaust acoustics)
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(800, now);
      this.filter.Q.setValueAtTime(2.5, now);

      // Waveshaper for throaty Italian exhaust rasp
      this.distortion = this.ctx.createWaveShaper();
      this.distortion.curve = this.makeDistortionCurve(18) as unknown as Float32Array<ArrayBuffer>;
      this.distortion.oversample = "2x";

      // Flat-plane V8 Fundamental pulse (4 power strokes per revolution)
      // At 1,000 RPM: 1000/60 * 4 = 66.67 Hz
      const baseFreq = (this.currentRPM / 60) * 4;

      this.oscFundamental = this.ctx.createOscillator();
      this.oscFundamental.type = "sawtooth";
      this.oscFundamental.frequency.setValueAtTime(baseFreq, now);

      // 2nd harmonic (octave)
      this.oscHarmonic2 = this.ctx.createOscillator();
      this.oscHarmonic2.type = "triangle";
      this.oscHarmonic2.frequency.setValueAtTime(baseFreq * 2, now);

      // 3rd harmonic (nasal, screaming Maranello overtone)
      this.oscHarmonic3 = this.ctx.createOscillator();
      this.oscHarmonic3.type = "sawtooth";
      this.oscHarmonic3.frequency.setValueAtTime(baseFreq * 3, now);

      // 4th harmonic
      this.oscHarmonic4 = this.ctx.createOscillator();
      this.oscHarmonic4.type = "sine";
      this.oscHarmonic4.frequency.setValueAtTime(baseFreq * 4, now);

      // Sub-bass rumble (gives visceral presence at low RPM)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = "sine";
      this.subOsc.frequency.setValueAtTime(baseFreq * 0.5, now);

      // Gains for harmonics
      const g1 = this.ctx.createGain(); g1.gain.value = 0.5;
      const g2 = this.ctx.createGain(); g2.gain.value = 0.35;
      const g3 = this.ctx.createGain(); g3.gain.value = 0.25;
      const g4 = this.ctx.createGain(); g4.gain.value = 0.15;
      const gSub = this.ctx.createGain(); gSub.gain.value = 0.3;

      this.oscFundamental.connect(g1);
      this.oscHarmonic2.connect(g2);
      this.oscHarmonic3.connect(g3);
      this.oscHarmonic4.connect(g4);
      this.subOsc.connect(gSub);

      const mix = this.ctx.createGain();
      g1.connect(mix);
      g2.connect(mix);
      g3.connect(mix);
      g4.connect(mix);
      gSub.connect(mix);

      mix.connect(this.distortion);
      this.distortion.connect(this.filter);
      this.filter.connect(this.masterGain);

      // Start all oscillators
      this.oscFundamental.start(now);
      this.oscHarmonic2.start(now);
      this.oscHarmonic3.start(now);
      this.oscHarmonic4.start(now);
      this.subOsc.start(now);

      this.isRunning = true;
      this.startRpmLoop();
      return true;
    } catch (err) {
      console.warn("Web Audio engine failed to initialize:", err);
      return false;
    }
  }

  public stop(): void {
    if (!this.isRunning || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      }
      setTimeout(() => {
        try {
          this.oscFundamental?.stop();
          this.oscHarmonic2?.stop();
          this.oscHarmonic3?.stop();
          this.oscHarmonic4?.stop();
          this.subOsc?.stop();
          this.ctx?.close();
        } catch {
          // ignore
        }
        this.isRunning = false;
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.currentRPM = 1000;
        this.targetRPM = 1000;
        if (this.onRpmUpdateCallback) this.onRpmUpdateCallback(1000);
      }, 400);
    } catch {
      this.isRunning = false;
    }
  }

  public setThrottle(pressed: boolean): void {
    if (!this.isRunning) return;
    // Redline on Ferrari 458 Italia is 9,000 RPM!
    this.targetRPM = pressed ? 9000 : 1000;
  }

  public setSpecificRpm(rpm: number): void {
    if (!this.isRunning) return;
    this.targetRPM = Math.max(1000, Math.min(9000, rpm));
  }

  public setDriveMode(mode: "WET" | "SPORT" | "RACE" | "CT_OFF" | "CST_OFF"): void {
    this.driveMode = mode;
    if (!this.ctx || !this.masterGain || !this.filter) return;

    // RACE / CT_OFF opens exhaust bypass valves for maximum volume and aggressive acoustic rasp
    const now = this.ctx.currentTime;
    if (mode === "RACE" || mode === "CT_OFF" || mode === "CST_OFF") {
      this.masterGain.gain.setTargetAtTime(0.55, now, 0.1);
      this.filter.Q.setTargetAtTime(3.5, now, 0.1);
    } else if (mode === "SPORT") {
      this.masterGain.gain.setTargetAtTime(0.45, now, 0.1);
      this.filter.Q.setTargetAtTime(2.8, now, 0.1);
    } else {
      // WET - muted exhaust
      this.masterGain.gain.setTargetAtTime(0.32, now, 0.1);
      this.filter.Q.setTargetAtTime(1.8, now, 0.1);
    }
  }

  private startRpmLoop(): void {
    const update = () => {
      if (!this.isRunning || !this.ctx) return;

      // Rate of RPM climb/decay (faster throttle response in RACE mode)
      const lerpSpeed = this.targetRPM > this.currentRPM 
        ? (this.driveMode === "RACE" || this.driveMode === "CT_OFF" ? 0.09 : 0.065)
        : 0.055;

      this.currentRPM += (this.targetRPM - this.currentRPM) * lerpSpeed;

      // Rev limiter bounce near 9,000 RPM!
      if (this.currentRPM > 8850 && this.targetRPM >= 8900) {
        this.currentRPM -= Math.random() * 220;
      }

      const now = this.ctx.currentTime;
      const baseFreq = (this.currentRPM / 60) * 4;

      if (this.oscFundamental) this.oscFundamental.frequency.setValueAtTime(baseFreq, now);
      if (this.oscHarmonic2) this.oscHarmonic2.frequency.setValueAtTime(baseFreq * 2, now);
      if (this.oscHarmonic3) this.oscHarmonic3.frequency.setValueAtTime(baseFreq * 3, now);
      if (this.oscHarmonic4) this.oscHarmonic4.frequency.setValueAtTime(baseFreq * 4, now);
      if (this.subOsc) this.subOsc.frequency.setValueAtTime(baseFreq * 0.5, now);

      // Dynamic filter cutoff: opens wide as RPM climbs to let the high-frequency 9,000 RPM scream through!
      if (this.filter) {
        const cutoff = 600 + (this.currentRPM / 9000) * 3800;
        this.filter.frequency.setValueAtTime(cutoff, now);
      }

      if (this.onRpmUpdateCallback) {
        this.onRpmUpdateCallback(Math.round(this.currentRPM));
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getCurrentRPM(): number {
    return this.currentRPM;
  }
}

export const engineAudio = new EngineSoundEngine();

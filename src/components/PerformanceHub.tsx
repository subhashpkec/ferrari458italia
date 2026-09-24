/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Performance Hub
 * Featuring:
 * - Real Tipo F136 FB V8 Dyno power & torque curves (570 CV @ 9,000 RPM, 540 Nm @ 6,000 RPM)
 * - Interactive F1 Launch Control Simulator with adjustable Launch Parameters:
 *   - Staging Launch RPM (3,000 to 5,000 RPM)
 *   - Track Surface (Fiorano Asphalt, Wet Track, Drag Strip)
 *   - Tire Compounds (Michelin Cup 2 R, Pilot Super Sport, Cold Street)
 *   - Target Sprint (0-100 km/h, 0-200 km/h, 1/4 Mile)
 *   - Hold-to-Stage Drag Tree Launch Pedal with live wheel slip & G-meter
 */

import { useState, useEffect, useRef } from "react";
import { Zap, Play, RotateCcw, Activity, Sliders, ShieldCheck, AlertCircle, Award, Volume2, VolumeX } from "lucide-react";
import { engineAudio } from "../utils/engineAudio";

export default function PerformanceHub() {
  const [manettinoMode, setManettinoMode] = useState<"SPORT" | "RACE" | "CT_OFF">("RACE");
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Interactive Launch Parameters
  const [stagingRPM, setStagingRPM] = useState(3800);
  const [trackSurface, setTrackSurface] = useState<"FIORANO" | "WET" | "DRAG_STRIP">("FIORANO");
  const [tireCompound, setTireCompound] = useState<"CUP_2" | "SUPER_SPORT" | "COLD_STREET">("CUP_2");
  const [targetSprint, setTargetSprint] = useState<"0-100" | "0-200" | "QUARTER_MILE">("0-100");

  // Launch Running State
  const [launchStatus, setLaunchStatus] = useState<"IDLE" | "STAGING" | "LAUNCHING" | "COMPLETED">("IDLE");
  const [launchSpeed, setLaunchSpeed] = useState(0);
  const [launchTime, setLaunchTime] = useState(0.0);
  const [launchGForce, setLaunchGForce] = useState(0.0);
  const [launchGear, setLaunchGear] = useState("N");
  const [wheelSlip, setWheelSlip] = useState(0);
  const [isPedalHeld, setIsPedalHeld] = useState(false);
  const [stagingLights, setStagingLights] = useState([false, false, false, false]); // Amber 1, 2, 3, Green
  const [launchResult, setLaunchResult] = useState<{
    time: number;
    peakG: number;
    efficiency: number;
    diagnosis: string;
  } | null>(null);

  const stagingTimerRef = useRef<number | null>(null);

  // Dynamic stat counter
  const [counters, setCounters] = useState({
    cv: 570,
    torque: 540,
    speed: 325,
    accel: 3.4,
  });

  useEffect(() => {
    const limits = {
      cv: 570,
      torque: 540,
      speed: 325,
      accel: manettinoMode === "CT_OFF" ? 3.3 : manettinoMode === "RACE" ? 3.4 : 3.5,
    };

    let start: number | null = null;
    const duration = 600;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      setCounters({
        cv: Math.floor(progress * limits.cv),
        torque: Math.floor(progress * limits.torque),
        speed: Math.floor(progress * limits.speed),
        accel: parseFloat((progress * limits.accel).toFixed(1)),
      });

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [manettinoMode]);

  // Compute Physics-based Expected Result from User Parameters
  const calculatePhysicsProfile = () => {
    // Surface coefficient
    const surfaceGrip = trackSurface === "FIORANO" ? 1.0 : trackSurface === "WET" ? 0.68 : 1.12;
    // Tire coefficient
    const tireGrip = tireCompound === "CUP_2" ? 1.05 : tireCompound === "SUPER_SPORT" ? 1.0 : 0.88;
    // Manettino bonus
    const manettinoBonus = manettinoMode === "RACE" ? 1.02 : manettinoMode === "CT_OFF" ? 1.04 : 0.98;

    const totalGrip = surfaceGrip * tireGrip * manettinoBonus;

    // RPM efficiency: optimal is 3,800 RPM
    // Too low (<3,400): engine bogs down
    // Too high (>4,300): excessive wheel spin unless on high grip drag strip
    let rpmPenalty = 0;
    let slipPercent = 4;

    if (stagingRPM < 3400) {
      rpmPenalty = (3400 - stagingRPM) * 0.0008; // bog down
      slipPercent = 2;
    } else if (stagingRPM > 4200) {
      const overRev = stagingRPM - 4200;
      if (totalGrip < 1.05) {
        rpmPenalty = overRev * 0.0012; // severe wheel spin
        slipPercent = Math.min(38, Math.round(10 + overRev * 0.035));
      } else {
        rpmPenalty = overRev * 0.0003; // slight spin on drag strip
        slipPercent = 12;
      }
    } else {
      slipPercent = 5; // optimal bite
    }

    // Benchmark target speed and base duration
    let targetSpeed = 100;
    let baseTime = 3.40;

    if (targetSprint === "0-200") {
      targetSpeed = 200;
      baseTime = 10.40;
    } else if (targetSprint === "QUARTER_MILE") {
      targetSpeed = 209;
      baseTime = 11.00;
    }

    const calculatedTime = parseFloat((baseTime / totalGrip + rpmPenalty).toFixed(2));
    const peakG = parseFloat((1.28 * totalGrip * (1 - rpmPenalty * 0.3)).toFixed(2));
    const efficiency = Math.max(70, Math.min(99.5, parseFloat((100 - Math.abs(calculatedTime - baseTime) * 15 - slipPercent * 0.3).toFixed(1))));

    let diagnosis = "";
    if (trackSurface === "WET") {
      diagnosis = `Wet surface reduced lateral grip (${Math.round(surfaceGrip * 100)}%). Electronic F1-Trac modulated torque to prevent spin.`;
    } else if (stagingRPM > 4400 && totalGrip < 1.05) {
      diagnosis = `Over-rev staging at ${stagingRPM} RPM caused excessive rear wheel slip (${slipPercent}%). Lower RPM to 3,800 for optimal bite.`;
    } else if (stagingRPM < 3400) {
      diagnosis = `Staging at ${stagingRPM} RPM fell below the flat-plane V8 torque sweet spot. Rev higher to 3,800 RPM.`;
    } else if (efficiency > 95) {
      diagnosis = `Flawless launch execution! Optimal 3,800 RPM clutch release with ${tireCompound === "CUP_2" ? "Cup 2 R" : "Michelin"} grip.`;
    } else {
      diagnosis = `Strong launch with minimal wheel spin (${slipPercent}%). Near-perfect mechanical coupling.`;
    }

    return { calculatedTime, peakG, efficiency, diagnosis, targetSpeed, slipPercent };
  };

  // Launch Sequence Execution
  const executeLaunch = () => {
    setLaunchStatus("LAUNCHING");
    setStagingLights([true, true, true, true]); // Green light!

    const { calculatedTime, peakG, efficiency, diagnosis, targetSpeed, slipPercent } = calculatePhysicsProfile();

    const startTime = performance.now();
    const durationMs = calculatedTime * 1000;

    const run = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Speed progression with realistic non-linear acceleration curve
      const currentSpeed = Math.round(Math.pow(progress, 0.88) * targetSpeed);
      const currentTime = parseFloat((elapsed / 1000).toFixed(2));

      // Realistic Getrag 7-Speed Dual-Clutch Gear Progression
      let gear = "1";
      if (currentSpeed >= 165) gear = "4";
      else if (currentSpeed >= 118) gear = "3";
      else if (currentSpeed >= 72) gear = "2";
      else gear = "1";

      // Calculate realistic engine RPM for flat-plane V8 screaming to 9,000 RPM
      let engineRev = 1000;
      if (currentSpeed < 72) {
        engineRev = stagingRPM + (currentSpeed / 72) * (9000 - stagingRPM);
      } else if (currentSpeed < 118) {
        engineRev = 6400 + ((currentSpeed - 72) / (118 - 72)) * (9000 - 6400);
      } else if (currentSpeed < 165) {
        engineRev = 6600 + ((currentSpeed - 118) / (165 - 118)) * (9000 - 6600);
      } else {
        engineRev = 6800 + (Math.min(currentSpeed - 165, 44) / 44) * (8800 - 6800);
      }

      if (audioEnabled) {
        engineAudio.setSpecificRpm(Math.round(engineRev));
      }

      // Dynamic G-force curve: peaks on initial clutch drop, tapers slightly
      let currentG = 0;
      if (progress < 0.25) currentG = peakG;
      else currentG = parseFloat((peakG - progress * 0.45).toFixed(2));

      setLaunchSpeed(currentSpeed);
      setLaunchTime(currentTime);
      setLaunchGear(gear);
      setLaunchGForce(Math.max(0.3, currentG));
      setWheelSlip(progress < 0.2 ? slipPercent : Math.max(1, Math.round(slipPercent * (1 - progress))));

      if (progress < 1) {
        requestAnimationFrame(run);
      } else {
        setLaunchSpeed(targetSpeed);
        setLaunchTime(calculatedTime);
        setLaunchStatus("COMPLETED");
        setWheelSlip(0);
        if (audioEnabled) {
          engineAudio.setSpecificRpm(1200);
          setTimeout(() => {
            if (engineAudio.getIsRunning()) {
              engineAudio.setSpecificRpm(1000);
            }
          }, 700);
        }
        setLaunchResult({
          time: calculatedTime,
          peakG,
          efficiency,
          diagnosis
        });
      }
    };

    requestAnimationFrame(run);
  };

  // Pedal Hold Down Staging Handlers
  const handlePedalDown = () => {
    if (launchStatus === "LAUNCHING") return;
    setIsPedalHeld(true);
    setLaunchStatus("STAGING");
    setLaunchSpeed(0);
    setLaunchTime(0);
    setLaunchGear("1");
    setLaunchGForce(0.35);
    setLaunchResult(null);

    // Progressive Drag Tree Staging Sequence (Amber 1 -> Amber 2 -> Amber 3 -> Ready)
    setStagingLights([true, false, false, false]);

    if (audioEnabled) {
      engineAudio.start().then(() => {
        engineAudio.setDriveMode(manettinoMode as any);
        engineAudio.setSpecificRpm(stagingRPM);
      });
    }

    const t1 = window.setTimeout(() => setStagingLights([true, true, false, false]), 300);
    const t2 = window.setTimeout(() => setStagingLights([true, true, true, false]), 600);
    const t3 = window.setTimeout(() => setStagingLights([true, true, true, true]), 900);

    stagingTimerRef.current = t3;
  };

  const handlePedalUp = () => {
    if (!isPedalHeld) return;
    setIsPedalHeld(false);
    if (launchStatus === "STAGING") {
      executeLaunch();
    }
  };

  const resetAll = () => {
    setLaunchStatus("IDLE");
    setLaunchSpeed(0);
    setLaunchTime(0);
    setLaunchGForce(0);
    setLaunchGear("N");
    setWheelSlip(0);
    setStagingLights([false, false, false, false]);
    setLaunchResult(null);
    if (audioEnabled && engineAudio.getIsRunning()) {
      engineAudio.setSpecificRpm(1000);
    }
  };

  const physicsPreview = calculatePhysicsProfile();

  return (
    <section id="perf-section" className="relative py-24 bg-black border-y border-zinc-900/60 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-2">
            // FIORANO TELEMETRY & LAUNCH LAB
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight">
            Ferrari 458 Launch Control Lab
          </h2>
          <p className="text-zinc-400 font-display text-sm md:text-base mt-3 font-light leading-relaxed">
            Test and calibrate authentic launch control parameters: tweak staging RPM, track surface grip, tire compounds, and launch benchmarks. Experience real-time Ferrari dual-clutch staging, wheel-slip telemetry, and G-force measurements.
          </p>
        </div>

        {/* Live Controls & Interactive Suite Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* LEFT: Interactive Launch Control Configurator & Simulator */}
          <div className="lg:col-span-7 bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-2xl">
            
            <div className="flex flex-col gap-6">
              
              {/* Header with Title & Staging Drag Tree + Audio Toggle */}
              <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-2">
                <span className="font-mono text-[10px] text-zinc-300 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-red-500" />
                  Ferrari 458 Launch Control Calibration Suite
                </span>
                
                <div className="flex items-center gap-2">
                  {/* V8 Sound Toggle Button */}
                  <button
                    onClick={() => {
                      const next = !audioEnabled;
                      setAudioEnabled(next);
                      if (!next && engineAudio.getIsRunning()) {
                        engineAudio.stop();
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-mono cursor-pointer transition-colors ${
                      audioEnabled
                        ? "bg-red-950/50 text-red-400 border-red-700/80 hover:bg-red-900/60"
                        : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                    }`}
                    title={audioEnabled ? "Mute V8 Audio" : "Enable Tipo F136 FB Audio"}
                  >
                    {audioEnabled ? <Volume2 className="w-3 h-3 text-red-400 animate-pulse" /> : <VolumeX className="w-3 h-3" />}
                    <span>{audioEnabled ? "V8 SOUND ON" : "V8 MUTED"}</span>
                  </button>

                  {/* Drag Tree Staging Indicator */}
                  <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 rounded-lg border border-zinc-800">
                    <span className="text-[9px] font-mono text-zinc-500 mr-1">TREE:</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${stagingLights[0] ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "bg-zinc-800"}`} />
                    <div className={`w-2.5 h-2.5 rounded-full ${stagingLights[1] ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "bg-zinc-800"}`} />
                    <div className={`w-2.5 h-2.5 rounded-full ${stagingLights[2] ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "bg-zinc-800"}`} />
                    <div className={`w-2.5 h-2.5 rounded-full ${stagingLights[3] ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-zinc-800"}`} />
                  </div>
                </div>
              </div>

              {/* Step 1: Interactive Parameter Sliders & Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Staging RPM Slider */}
                <div className="bg-black/80 p-3.5 rounded-xl border border-zinc-900 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10.5px] font-mono">
                    <span className="text-zinc-400">STAGING CLUTCH RPM</span>
                    <span className={`font-bold ${stagingRPM >= 4300 ? "text-amber-400" : stagingRPM <= 3300 ? "text-zinc-400" : "text-red-500"}`}>
                      {stagingRPM.toLocaleString()} RPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="5000"
                    step="100"
                    value={stagingRPM}
                    onChange={(e) => setStagingRPM(parseInt(e.target.value))}
                    disabled={launchStatus === "LAUNCHING"}
                    className="w-full accent-red-600 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                    <span>3,000 (Safe)</span>
                    <span className="text-gold font-bold">3,800 (Optimal)</span>
                    <span>5,000 (Wheel Spin)</span>
                  </div>
                </div>

                {/* 2. Target Sprint Mode */}
                <div className="bg-black/80 p-3.5 rounded-xl border border-zinc-900 flex flex-col gap-2">
                  <span className="text-[10.5px] font-mono text-zinc-400">BENCHMARK TEST</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "0-100", label: "0-100 km/h" },
                      { id: "0-200", label: "0-200 km/h" },
                      { id: "QUARTER_MILE", label: "1/4 Mile" },
                    ].map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setTargetSprint(b.id as any)}
                        disabled={launchStatus === "LAUNCHING"}
                        className={`py-1.5 text-[9px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                          targetSprint === b.id
                            ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-950/30"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">
                    Target: {targetSprint === "0-100" ? "Factory 3.4s" : targetSprint === "0-200" ? "10.4s @ Fiorano" : "11.0s @ 209 km/h"}
                  </span>
                </div>

                {/* 3. Track Surface Grip */}
                <div className="bg-black/80 p-3.5 rounded-xl border border-zinc-900 flex flex-col gap-2">
                  <span className="text-[10.5px] font-mono text-zinc-400">TRACK SURFACE</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "FIORANO", label: "Fiorano (Dry)" },
                      { id: "WET", label: "Wet Rain" },
                      { id: "DRAG_STRIP", label: "Drag Strip" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setTrackSurface(s.id as any)}
                        disabled={launchStatus === "LAUNCHING"}
                        className={`py-1.5 text-[9px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                          trackSurface === s.id
                            ? "bg-gold text-black border-yellow-400 shadow-md shadow-gold/20"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">
                    Grip Coeff: {trackSurface === "FIORANO" ? "1.00 (100%)" : trackSurface === "WET" ? "0.68 (68% - Low)" : "1.12 (High Grip)"}
                  </span>
                </div>

                {/* 4. Tire Compound */}
                <div className="bg-black/80 p-3.5 rounded-xl border border-zinc-900 flex flex-col gap-2">
                  <span className="text-[10.5px] font-mono text-zinc-400">TIRE SPEC</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: "CUP_2", label: "Cup 2 R" },
                      { id: "SUPER_SPORT", label: "Super Sport" },
                      { id: "COLD_STREET", label: "Cold Street" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTireCompound(t.id as any)}
                        disabled={launchStatus === "LAUNCHING"}
                        className={`py-1.5 text-[9px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                          tireCompound === t.id
                            ? "bg-zinc-200 text-black border-white shadow-md"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">
                    Predicted: ~{physicsPreview.calculatedTime}s sprint
                  </span>
                </div>

              </div>

              {/* Step 2: Live Digital Speedometer, Gear, G-Force & Slip Readouts */}
              <div className="bg-black p-5 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-inner">
                {/* Speedometer */}
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">VELOCITY</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl md:text-5xl font-black text-white">
                      {launchSpeed}
                    </span>
                    <span className="text-xs font-mono text-red-500 font-bold">KM/H</span>
                  </div>
                </div>

                {/* Stopwatch Time */}
                <div className="text-center">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">TIME</span>
                  <span className="font-mono text-3xl font-black text-gold">
                    {launchTime.toFixed(2)}s
                  </span>
                </div>

                {/* Dual-Clutch Gear Box */}
                <div className="text-center">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">DUAL-CLUTCH GEAR</span>
                  <span className="font-mono text-3xl font-black text-red-400">
                    {launchGear}
                  </span>
                </div>

                {/* Longitudinal G-Force */}
                <div className="text-center">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">LONGITUDINAL G</span>
                  <span className="font-mono text-2xl font-bold text-emerald-400">
                    {launchGForce} G
                  </span>
                </div>

                {/* Wheel Slip Indicator */}
                <div className="text-right">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">TIRE SLIP</span>
                  <span className={`font-mono text-xl font-bold ${wheelSlip > 15 ? "text-amber-400 animate-pulse" : "text-zinc-300"}`}>
                    {wheelSlip}%
                  </span>
                </div>
              </div>

              {/* Step 3: Interactive Launch Pedal (Hold down to stage, release to launch!) */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                
                {/* Primary Interactive Hold & Release Pedal */}
                <button
                  onMouseDown={handlePedalDown}
                  onMouseUp={handlePedalUp}
                  onMouseLeave={handlePedalUp}
                  onTouchStart={handlePedalDown}
                  onTouchEnd={handlePedalUp}
                  className={`flex-1 py-4 px-6 rounded-2xl font-mono text-xs font-black tracking-widest uppercase transition-all select-none flex items-center justify-center gap-3 border shadow-xl cursor-pointer ${
                    isPedalHeld
                      ? "bg-amber-500 text-black border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.8)] scale-95"
                      : launchStatus === "COMPLETED"
                      ? "bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-red-950/40"
                      : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-red-400 shadow-red-950/50"
                  }`}
                >
                  <Play className={`w-4 h-4 ${isPedalHeld ? "animate-spin" : ""}`} />
                  <span>
                    {isPedalHeld
                      ? `STAGING AT ${stagingRPM} RPM // RELEASE TO LAUNCH!`
                      : launchStatus === "COMPLETED"
                      ? "PRESS & HOLD TO LAUNCH AGAIN"
                      : "PRESS & HOLD BRAKE+GAS TO LAUNCH"}
                  </span>
                </button>

                {/* Instant Launch Action Button */}
                <button
                  onClick={executeLaunch}
                  disabled={launchStatus === "LAUNCHING" || isPedalHeld}
                  className="px-5 py-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-200 hover:text-white rounded-2xl border border-zinc-700 font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  title="Quick Launch with current parameters"
                >
                  Quick Launch
                </button>

                {/* Reset Button */}
                {launchStatus !== "IDLE" && (
                  <button
                    onClick={resetAll}
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-2xl border border-zinc-800 cursor-pointer transition-colors"
                    title="Reset Simulator"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Step 4: Comprehensive Launch Performance Report Card (Shown after launch) */}
              {launchResult && (
                <div className="bg-zinc-900/90 border border-gold/40 p-4 rounded-xl flex flex-col gap-2.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-mono text-[10px] text-gold uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-gold" />
                      OFFICIAL FIORANO LAUNCH TELEMETRY VERDICT
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-400">
                      {launchResult.efficiency}% EFFICIENCY
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-black/60 p-2 rounded-lg border border-zinc-800">
                      <span className="text-[9px] text-zinc-500 block">RECORD TIME</span>
                      <span className="text-white font-bold text-sm">{launchResult.time}s</span>
                    </div>
                    <div className="bg-black/60 p-2 rounded-lg border border-zinc-800">
                      <span className="text-[9px] text-zinc-500 block">PEAK ACCEL</span>
                      <span className="text-emerald-400 font-bold text-sm">{launchResult.peakG} G</span>
                    </div>
                    <div className="bg-black/60 p-2 rounded-lg border border-zinc-800">
                      <span className="text-[9px] text-zinc-500 block">VS FACTORY SPEC</span>
                      <span className={`font-bold text-sm ${launchResult.time <= 3.4 ? "text-emerald-400" : "text-amber-400"}`}>
                        {(launchResult.time - 3.4) > 0 ? `+${(launchResult.time - 3.4).toFixed(2)}s` : `${(launchResult.time - 3.4).toFixed(2)}s`}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-300 font-light leading-relaxed bg-black/40 p-2.5 rounded-lg border border-zinc-800/80">
                    💡 <span className="text-gold font-semibold">Diagnosis:</span> {launchResult.diagnosis}
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT: Real Ferrari Tipo F136 FB V8 Dyno Chart & Specs */}
          <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Tipo F136 FB 4.5L V8 Dyno
                </span>
                
                {/* Manettino Mode Selector */}
                <div className="flex gap-1">
                  {(["SPORT", "RACE", "CT_OFF"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setManettinoMode(m)}
                      className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                        manettinoMode === m
                          ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                          : "bg-zinc-900 text-zinc-500 hover:text-white"
                      }`}
                    >
                      {m.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Dyno Curve Chart */}
              <div className="relative w-full aspect-[16/10] bg-black border border-zinc-900 rounded-xl p-3 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 500 270">
                  <defs>
                    <linearGradient id="dynoPowerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="dynoTorqueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffd000" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffd000" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="45" y1="40" x2="470" y2="40" stroke="#1f242d" strokeDasharray="3 3" />
                  <line x1="45" y1="95" x2="470" y2="95" stroke="#1f242d" strokeDasharray="3 3" />
                  <line x1="45" y1="150" x2="470" y2="150" stroke="#1f242d" strokeDasharray="3 3" />
                  <line x1="45" y1="205" x2="470" y2="205" stroke="#1f242d" strokeDasharray="3 3" />
                  <line x1="45" y1="235" x2="470" y2="235" stroke="#333" />

                  {/* RPM Ticks */}
                  <text x="45" y="252" fill="#555" fontSize="9" fontFamily="monospace">1,000</text>
                  <text x="130" y="252" fill="#555" fontSize="9" fontFamily="monospace">3,000</text>
                  <text x="235" y="252" fill="#555" fontSize="9" fontFamily="monospace">5,000</text>
                  <text x="340" y="252" fill="#555" fontSize="9" fontFamily="monospace">7,000</text>
                  <text x="430" y="252" fill="#dc2626" fontSize="9" fontFamily="monospace" fontWeight="bold">9,000 RPM</text>

                  {/* Torque Curve */}
                  <path
                    d="M 45,200 C 95,145 175,98 265,92 C 345,95 410,115 450,140"
                    fill="none"
                    stroke="#ffd000"
                    strokeWidth="3"
                  />
                  <path
                    d="M 45,200 C 95,145 175,98 265,92 C 345,95 410,115 450,140 L 450,235 L 45,235 Z"
                    fill="url(#dynoTorqueGrad)"
                  />

                  {/* Power Curve */}
                  <path
                    d="M 45,225 C 135,195 235,150 335,90 C 385,60 425,44 450,38"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M 45,225 C 135,195 235,150 335,90 C 385,60 425,44 450,38 L 450,235 L 45,235 Z"
                    fill="url(#dynoPowerGrad)"
                  />

                  {/* Highlight Circles */}
                  <circle cx="450" cy="38" r="5" fill="#dc2626" />
                  <text x="365" y="30" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">570 CV @ 9k</text>

                  <circle cx="265" cy="92" r="4.5" fill="#ffd000" />
                  <text x="210" y="80" fill="#ffd000" fontSize="10" fontFamily="monospace" fontWeight="bold">540 N⋅m @ 6k</text>
                </svg>
              </div>

              {/* Legend & Factory Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono">
                <div className="bg-black/60 p-2.5 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500 block text-[9px]">MAX OUTPUT</span>
                  <span className="text-red-400 font-bold">570 CV @ 9,000 RPM</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500 block text-[9px]">PEAK TORQUE</span>
                  <span className="text-gold font-bold">540 N⋅m @ 6,000 RPM</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-[10.5px] text-zinc-400 font-light flex items-center justify-between">
              <span>Naturally Aspirated Record // 127 CV/Litre</span>
              <span className="text-zinc-500 font-mono">FIORANO: 1:25.00</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

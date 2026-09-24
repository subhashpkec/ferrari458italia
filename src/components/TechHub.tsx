/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Engineering & Technology Hub
 */

import { useState } from "react";
import { TECH_FEATURES } from "../data";
import { Cpu, Gauge, Shield, Wind, Sparkles } from "lucide-react";

export default function TechHub() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [bumpyRoadMode, setBumpyRoadMode] = useState(false);
  const [aeroDeflection, setAeroDeflection] = useState<"NEUTRAL" | "HIGH_SPEED">("NEUTRAL");
  const [damperViscosity, setDamperViscosity] = useState("OPTIMAL // 1.2 ms");

  const activeFeature = TECH_FEATURES[activeFeatureIndex];

  const toggleBumpyRoad = () => {
    setBumpyRoadMode(!bumpyRoadMode);
    setDamperViscosity(!bumpyRoadMode ? "COMPLIANT // BUMPY ROAD MODE" : "TRACK FIRM // SCM2 SPORT");
  };

  const toggleAeroDeflection = () => {
    setAeroDeflection(aeroDeflection === "NEUTRAL" ? "HIGH_SPEED" : "NEUTRAL");
  };

  return (
    <section id="tech-section" className="relative py-24 bg-black border-b border-zinc-900/60 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-2">
            // SCUDERIA MARANELLO INNOVATION
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight">
            Formula 1 Transfer Technology
          </h2>
          <p className="text-zinc-400 font-display text-sm md:text-base mt-2 font-light">
            Every breakthrough in the Ferrari 458 Italia was forged in Formula 1 racing: E-Diff 3 integrated with F1-Trac, aeroelastic deformable wings, and high-frequency magnetorheological damping.
          </p>
        </div>

        {/* Split-Screen Interactive Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Left Block: Dynamic Content Selector Tabs & Text Readout */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-950/80 p-6 lg:p-10 border border-zinc-900 rounded-2xl shadow-xl" id="tech-details-panel">
            
            <div className="flex flex-col gap-6">
              {/* Feature Navigator Row */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold block">
                  Select Engineering Innovation
                </span>
                <div className="flex flex-col gap-2" id="tech-tabs-vertical">
                  {TECH_FEATURES.map((feat, index) => (
                    <button
                      key={feat.id}
                      id={`tech-button-${feat.id}`}
                      onClick={() => setActiveFeatureIndex(index)}
                      className={`w-full py-3.5 px-4 rounded-xl text-left font-display text-xs tracking-wider transition-all flex items-center justify-between border cursor-pointer ${
                        index === activeFeatureIndex
                          ? "bg-zinc-900 text-white border-red-600/60 shadow-lg shadow-red-950/20"
                          : "bg-black text-zinc-400 border-zinc-900 hover:bg-zinc-900 hover:text-white"
                      }`}
                    >
                      <span className="font-bold">{feat.title}</span>
                      <span className="font-mono text-[9px] text-red-500 font-bold">0{index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Feature Text Readout */}
              <div className="flex flex-col gap-3 pt-4 border-t border-zinc-900 animate-fadeIn" key={activeFeature.id}>
                <span className="font-mono text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  {activeFeature.subtitle}
                </span>
                <p className="text-zinc-300 text-sm leading-relaxed font-light">
                  {activeFeature.description}
                </p>
              </div>

            </div>

            {/* Specification labels linked to chosen assembly */}
            <div className="mt-8 pt-6 border-t border-zinc-900 grid grid-cols-1 gap-3">
              {activeFeature.specs.map((item, id) => (
                <div key={id} className="flex justify-between items-center text-xs border-b border-zinc-900/80 pb-2">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className="font-mono text-gold font-bold">{item.value}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Block: Dynamic Spec Visualizer & SCM2 / Aeroelastic Simulator */}
          <div className="lg:col-span-7 flex flex-col gap-6" id="tech-viewer-panel">
            
            {/* Visualizer Frame */}
            <div className="relative rounded-2xl overflow-hidden h-[340px] md:h-[400px] border border-zinc-900 flex-grow shadow-2xl">
              <img
                src={activeFeature.imageSrc}
                alt={activeFeature.title}
                className="w-full h-full object-cover filter brightness-70 select-none animate-scaleIn"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
              
              <div className="absolute top-4 right-4 bg-black/80 px-3 py-1.5 rounded-lg border border-zinc-800 font-mono text-[9px] text-red-400 font-bold">
                MARANELLO CAD // CERTIFIED
              </div>

              {/* Dynamic HUD indicator */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2.5 bg-black/80 px-4 py-3 rounded-xl border border-zinc-800 backdrop-blur-md">
                <Gauge className="w-5 h-5 text-red-500" />
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase leading-none">Subassembly Status</span>
                  <span className="font-display font-medium text-white text-xs mt-1 uppercase">ACTIVE // FIORANO HOMOLOGATED</span>
                </div>
              </div>
            </div>

            {/* Interactive SCM2 Damper & Aeroelastic Winglet Control */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="font-mono text-[10px] text-zinc-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-red-500" /> F1 CHASSIS DYNAMICS CONTROLLER
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  SCM2 LATENCY: <span className="text-gold font-bold">1.0 MS</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SCM2 Bumpy Road Button (Iconic Ferrari steering wheel feature) */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>SCM2 Damper Calibration</span>
                    <span className={bumpyRoadMode ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {bumpyRoadMode ? "BUMPY ROAD ON" : "SPORT FIRM"}
                    </span>
                  </div>
                  <button
                    onClick={toggleBumpyRoad}
                    className={`w-full py-2.5 px-3 border rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      bumpyRoadMode
                        ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40"
                        : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-red-600 hover:text-white"
                    }`}
                  >
                    TOGGLE BUMPY ROAD MODE
                  </button>
                </div>

                {/* Front Aeroelastic Winglet Deflection Simulator */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>Front Aeroelastic Winglets</span>
                    <span className={aeroDeflection === "HIGH_SPEED" ? "text-gold font-bold" : "text-zinc-400"}>
                      {aeroDeflection === "HIGH_SPEED" ? "DEFLECTED (-12mm)" : "NEUTRAL (0mm)"}
                    </span>
                  </div>
                  <button
                    onClick={toggleAeroDeflection}
                    className={`w-full py-2.5 px-3 border rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      aeroDeflection === "HIGH_SPEED"
                        ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                        : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-gold hover:text-white"
                    }`}
                  >
                    SIMULATE V-MAX DEFLECTION
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 border-t border-zinc-900 pt-2 flex items-center justify-between">
                <span>DAMPING PROFILE: {damperViscosity}</span>
                <span>DOWNFORCE: {aeroDeflection === "HIGH_SPEED" ? "360 KG @ 325 KM/H" : "140 KG @ 200 KM/H"}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

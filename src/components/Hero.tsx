/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Hero Section
 */

import { Eye, Sliders, ChevronDown } from "lucide-react";
import { CAR_IMAGES } from "../data";

interface HeroProps {
  onExplore: () => void;
  onOpenConfigurator: () => void;
}

export default function Hero({ onExplore, onOpenConfigurator }: HeroProps) {
  return (
    <section 
      id="home-hero" 
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
    >
      {/* Background Image / Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src={CAR_IMAGES.driving}
          alt="Ferrari 458 Italia carving curves at high speed"
          className="w-full h-full object-cover object-center filter brightness-65 scale-105 select-none transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/75" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Grid Pattern Accent overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none z-1" />

      {/* Top spacer for navbar */}
      <div className="h-28" />

      {/* Main Hero Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex-grow flex flex-col justify-center text-center md:text-left">
        
        {/* Maranello Tagline */}
        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
          <span className="h-[1px] w-8 bg-red-600" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-red-500 uppercase font-bold">
            SCUDERIA FERRARI // MARANELLO, ITALY
          </span>
          <span className="h-[1px] w-8 bg-red-600" />
        </div>

        {/* Display Typography */}
        <h1 
          className="font-display font-black text-6xl md:text-8xl xl:text-9xl tracking-tight text-white mb-2 leading-none uppercase select-none relative"
          id="hero-car-title"
        >
          FERRARI <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 font-light">458 ITALIA</span>
        </h1>

        {/* Authentic Engineering Statement */}
        <p className="max-w-xl text-zinc-300 font-light font-display text-base md:text-lg tracking-wide md:leading-relaxed mb-10 mx-auto md:mx-0">
          The crown of naturally aspirated V8 performance. 570 CV revving to an operatic 9,000 RPM, flat-plane crankshaft harmonics, and sculpted Pininfarina aeroelastic architecture.
        </p>

        {/* Action Button Deck */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          id="hero-actions"
        >
          <button
            id="hero-explore-btn"
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-red-600 hover:text-white rounded-lg font-mono text-[11px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl shadow-white/5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" /> 3D SHOWROOM & V8 SOUND
          </button>
          
          <button
            id="hero-config-btn"
            onClick={onOpenConfigurator}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-950/80 hover:bg-zinc-900 text-white rounded-lg font-mono text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border border-zinc-800 hover:border-red-600 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-gold" /> ATELIER CONFIGURATOR
          </button>
        </div>

      </div>

      {/* Real Statistics Ribbon */}
      <div className="relative z-10 w-full bg-black/60 border-t border-zinc-900/80 backdrop-blur-md py-7 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8 md:gap-12 justify-around text-center">
          
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Max Naturally Aspirated Power</span>
            <span className="font-display font-light text-2xl lg:text-3xl text-white">
              570 <span className="text-red-500 text-xs font-mono font-bold">CV @ 9,000 RPM</span>
            </span>
          </div>

          <div className="h-10 w-[1px] bg-zinc-900 hidden sm:block self-center" />

          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Acceleration 0-100 km/h</span>
            <span className="font-display font-light text-2xl lg:text-3xl text-white">
              3.4s <span className="text-zinc-500 text-xs font-mono">LAUNCH CONTROL</span>
            </span>
          </div>

          <div className="h-10 w-[1px] bg-zinc-900 hidden sm:block self-center" />

          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Top Speed</span>
            <span className="font-display font-light text-2xl lg:text-3xl text-white">
              325 <span className="text-gold text-xs font-mono font-bold">KM/H (202 MPH)</span>
            </span>
          </div>

          <div className="h-10 w-[1px] bg-zinc-900 hidden sm:block self-center" />

          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Pista di Fiorano Lap</span>
            <span className="font-display font-light text-2xl lg:text-3xl text-white">
              1:25.00 <span className="text-emerald-400 text-xs font-mono font-bold">CIRCUIT RECORD</span>
            </span>
          </div>

        </div>

        {/* Scroll prompt */}
        <div 
          onClick={onExplore}
          className="absolute -top-14 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer select-none group"
          id="hero-scroll-prompt"
        >
          <span className="font-mono text-[8px] text-zinc-500 group-hover:text-red-400 uppercase tracking-widest transition-colors duration-300">
            ENTER 3D SHOWROOM
          </span>
          <div className="w-8 h-8 rounded-full bg-zinc-950/80 border border-zinc-800 group-hover:border-red-600 flex items-center justify-center transition-all duration-300">
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-red-400 transition-colors" />
          </div>
        </div>

      </div>

    </section>
  );
}

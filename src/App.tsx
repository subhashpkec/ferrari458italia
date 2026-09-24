/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Showcase Application
 */

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ThreeCarViewer from "./components/ThreeCarViewer";
import PerformanceHub from "./components/PerformanceHub";
import TechHub from "./components/TechHub";
import GallerySection from "./components/GallerySection";
import SpecificationsSection from "./components/SpecificationsSection";
import VideoShowcase from "./components/VideoShowcase";
import ConfiguratorModal from "./components/ConfiguratorModal";
import FerrariLogo from "./components/FerrariLogo";
import { Hotspot } from "./types";
import { 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Volume2, 
  Send,
  Linkedin,
  Instagram,
  Twitter,
  Youtube
} from "lucide-react";

export default function App() {
  // Preloading states
  const [loading, setLoading] = useState(true);
  const [loadPercentage, setLoadPercentage] = useState(0);
  
  // Custom states
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Preloader Counter Animation loop
  useEffect(() => {
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 8) + 2;
      if (currentPercent >= 100) {
        currentPercent = 100;
        setLoadPercentage(currentPercent);
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 700);
      } else {
        setLoadPercentage(currentPercent);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleHotspotSelect = (hotspot: Hotspot) => {
    setActiveHotspotId(hotspot.id);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      
      {/* 1. CINEMATIC MARANELLO BOOT SCREEN */}
      {loading && (
        <div id="preloader-overlay" className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-8 md:p-12">
          
          {/* Top layout */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <span className="font-mono text-[9px] tracking-widest text-zinc-500">// FIORANO BOOT DIAGNOSTICS</span>
            <span className="font-mono text-[9px] text-red-500 uppercase tracking-widest leading-none font-bold">
              PISTA DI FIORANO // MARANELLO, ITALY
            </span>
          </div>

          {/* Central high resolution telemetry boot screen */}
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center gap-8 text-center flex-grow">
            
            {/* Authentic Scuderia Ferrari Shield Logo */}
            <div className="flex flex-col items-center justify-center animate-pulse">
              <FerrariLogo size="lg" />
            </div>

            {/* Simulated revving visuals */}
            <div className="flex flex-col gap-2 w-full max-w-2xl">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase">
                <span>Tipo F136 FB 4.5L V8 Ignition</span>
                <span className="text-red-500 tracking-widest font-semibold font-mono">{loadPercentage}% TELEMETRY</span>
              </div>
              <div className="w-full bg-zinc-900 h-[2px] rounded overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 h-full transition-all duration-75"
                  style={{ width: `${loadPercentage}%` }}
                />
              </div>
              
              {/* Animated wave graph */}
              <div className="flex justify-center gap-0.5 mt-2 h-4 items-end">
                {Array.from({ length: 24 }).map((_, waveIdx) => {
                  const animatedHeight = Math.max(2, Math.sin((loadPercentage + waveIdx * 10) * 0.15) * 12 + 6);
                  return (
                    <div 
                      key={waveIdx}
                      className="w-[1.5px] bg-red-600/60"
                      style={{ height: `${animatedHeight}px` }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-center font-display">
              <h2 className="font-black text-2xl md:text-3xl tracking-[0.25em] text-white uppercase leading-none">
                FERRARI 458 ITALIA
              </h2>
              <span className="font-mono text-[8px] text-zinc-500 tracking-widest mt-1">
                9,000 RPM FLAT-PLANE V8 ACOUSTICS READY
              </span>
            </div>

          </div>

          {/* Bottom telemetry readings */}
          <div className="flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-500 gap-4 mt-8 pt-4 border-t border-zinc-900">
            <span>ECU FIRMWARE: BOSCH MED 9.6.1 // OK</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Volume2 className="w-3.5 h-3.5 text-red-500" /> Web Audio V8 flat-plane synthesizer calibrated
            </span>
            <span>DIFFERENTIAL: E-DIFF 3 + F1-TRAC // ENGAGED</span>
          </div>

        </div>
      )}

      {/* 2. DYNAMIC AUTO-ALIGNED NAVBAR */}
      <Navbar 
        onOpenConfigurator={() => setConfiguratorOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* 3. CINEMATIC HERO SLIDERS */}
      <Hero 
        onExplore={() => handleNavigateSection("inter-viewer")}
        onOpenConfigurator={() => setConfiguratorOpen(true)}
      />

      {/* 4. THREE.JS INTERACTIVE MODEL LAB (Showcase) */}
      <section id="inter-viewer" className="relative py-24 bg-gradient-to-b from-black via-zinc-950/40 to-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-2">
              // 3D INTERACTIVE SHOWROOM
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight">
              Interactive Ferrari Laboratory
            </h2>
            <p className="text-zinc-400 font-display text-sm md:text-base mt-4 font-light">
              Toggle headlights & real spotlight projection, start the Tipo F136 FB V8 engine sound simulator, select Manettino modes, rev to 9,000 RPM with F1 steering wheel shift LEDs, switch cinematic camera presets, and double-click to explode all parts into detailed Ferrari engineering dossiers.
            </p>
          </div>

          {/* WebGL Canvas Component injection */}
          <ThreeCarViewer 
            onHotspotSelect={handleHotspotSelect}
            activeHotspotId={activeHotspotId}
          />

          {/* Static Hotspot information layout sync details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10" id="viewer-sync-checklists">
            
            <div 
              onClick={() => setActiveHotspotId("engine")}
              className={`p-6 rounded-2xl border bg-zinc-950/60 cursor-pointer transition-all ${
                activeHotspotId === "engine" ? "border-red-600 bg-zinc-950 shadow-lg shadow-red-950/20" : "border-zinc-900 hover:border-zinc-800"
              }`}
            >
              <span className="font-mono text-[9px] text-red-400 font-semibold uppercase block">POWERTRAIN // Flat-Plane V8</span>
              <h4 className="font-display font-black text-base text-white mt-1">Tipo F136 FB 4.5L V8</h4>
              <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed">
                570 CV @ 9,000 RPM with 180° flat-plane crankshaft and dry-sump lubrication. Production naturally aspirated record holder (127 CV/L).
              </p>
            </div>

            <div 
              onClick={() => setActiveHotspotId("brakes")}
              className={`p-6 rounded-2xl border bg-zinc-950/60 cursor-pointer transition-all ${
                activeHotspotId === "brakes" ? "border-red-600 bg-zinc-950 shadow-lg shadow-red-950/20" : "border-zinc-900 hover:border-zinc-800"
              }`}
            >
              <span className="font-mono text-[9px] text-gold font-semibold uppercase block">CHASSIS // Brembo CCM</span>
              <h4 className="font-display font-black text-base text-white mt-1">Brembo Carbon-Ceramic Brakes</h4>
              <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed">
                398mm front discs with 6-piston calipers and Ferrari Pre-Fill system. Stops from 100 to 0 km/h in 32.5 meters.
              </p>
            </div>

            <div 
              onClick={() => setActiveHotspotId("cockpit")}
              className={`p-6 rounded-2xl border bg-zinc-950/60 cursor-pointer transition-all ${
                activeHotspotId === "cockpit" ? "border-red-600 bg-zinc-950 shadow-lg shadow-red-950/20" : "border-zinc-900 hover:border-zinc-800"
              }`}
            >
              <span className="font-mono text-[9px] text-zinc-400 font-semibold uppercase block">CONTROLS // F1 Cockpit</span>
              <h4 className="font-display font-black text-base text-white mt-1">Manettino & F1 Shift LEDs</h4>
              <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed">
                Integrated steering wheel with 5-position Manettino dial (WET, SPORT, RACE, CT OFF, CST OFF) and progressive upper-rim shift LEDs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* DUAL-VIDEO CINEMATIC SHOWCASE */}
      <section id="video-showcase">
        <VideoShowcase />
      </section>

      {/* 5. PERFORMANCE HISTORIC CURVES */}
      <PerformanceHub />

      {/* 6. HYDRAULIC ACTIVE SYSTEMS & TRANSMISSIONS */}
      <TechHub />

      {/* 7. CINEMATIC GALLERY GRID */}
      <GallerySection />

      {/* 8. DEEP TECHNICAL COMPILATIONS */}
      <SpecificationsSection />

      {/* 9. ELITE BRAND FOOTER SECTION */}
      <footer className="relative bg-black border-t border-zinc-900 select-none py-16" id="site-footer">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-zinc-900 pb-12">
            
            {/* Part A: Maranello factory summary */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <FerrariLogo size="md" showText />
              <p className="text-zinc-400 font-display text-xs font-light leading-relaxed max-w-sm">
                Engineered and hand-crafted at the Ferrari factory in Maranello, Italy. Developed with test driver Michael Schumacher on the Pista di Fiorano.
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-zinc-400 mt-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Via Abetone Inferiore n. 4, 41053 Maranello (MO), Italy
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-red-500" /> atelier@ferrari-458italia.com
                </span>
              </div>
            </div>

            {/* Part B: Newsletter collection */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-zinc-950/80 p-6 rounded-2xl border border-zinc-900 shadow-lg">
              <span className="font-mono text-[9px] text-red-500 font-bold uppercase tracking-wider block">
                // MARANELLO ATELIER DISPATCH
              </span>
              <h4 className="font-display font-bold text-white text-sm uppercase">Join the Scuderia Private Circle</h4>
              <p className="text-zinc-400 font-display text-xs leading-relaxed font-light">
                Receive confidential technical bulletins, historic track archives, and exclusive event invitations directly from Maranello.
              </p>

              {!newsletterSubscribed ? (
                <form 
                  onSubmit={handleNewsletterSubmit} 
                  className="flex items-stretch gap-2.5 mt-2"
                  id="newsletter-form"
                >
                  <input
                    id="newsletter-input-email"
                    type="email"
                    required
                    placeholder="Enter confidential client email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-grow bg-black border border-zinc-800 hover:border-zinc-700 focus:border-red-600 focus:outline-none p-3 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 font-mono"
                  />
                  <button
                    id="newsletter-newsletter-submit"
                    type="submit"
                    className="p-3 bg-red-600 text-white rounded-xl transition-colors hover:bg-red-700 cursor-pointer flex items-center justify-center border border-red-500"
                    aria-label="Submit Newsletter"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div 
                  className="p-3 bg-red-600/10 border border-red-600/30 rounded-xl flex items-center gap-2 text-xs text-red-400 mt-2"
                  id="newsletter-subscribed-box"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-mono">REGISTRATION CONFIRMED // Dispatched to Maranello.</span>
                </div>
              )}
            </div>

            {/* Part C: Navigation link maps */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-4 text-xs font-display">
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[9px] text-zinc-600 uppercase">Maranello</span>
                <button onClick={() => handleNavigateSection("home-hero")} className="text-zinc-400 hover:text-white text-left transition-colors cursor-pointer block leading-none">458 Italia</button>
                <button onClick={() => handleNavigateSection("perf-section")} className="text-zinc-400 hover:text-white text-left transition-colors cursor-pointer block leading-none">V8 Dyno</button>
                <button onClick={() => setConfiguratorOpen(true)} className="text-zinc-400 hover:text-white text-left transition-colors cursor-pointer block leading-none">Atelier Build</button>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[9px] text-zinc-600 uppercase">Corse Clienti</span>
                <span className="text-zinc-400 block leading-none">Pista di Fiorano</span>
                <span className="text-zinc-400 block leading-none">Ferrari Challenge</span>
                <span className="text-zinc-400 block leading-none">Scuderia Club</span>
              </div>
            </div>

          </div>

          {/* Social media connections and copyright footer */}
          <div className="flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-500 gap-6">
            <div className="flex items-center gap-6" id="footer-social-links">
              <button className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Link to Instagram">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Link to Twitter">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Link to Youtube">
                <Youtube className="w-4 h-4" />
              </button>
              <button className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Link to LinkedIn">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
            
            <span>
              Ferrari 458 Italia Showcase // Scuderia Ferrari // Maranello, Italy
            </span>
          </div>

        </div>
      </footer>

      {/* 10. BESPOKE CONFIGURATION MODAL DIALOG */}
      <ConfiguratorModal 
        isOpen={configuratorOpen}
        onClose={() => setConfiguratorOpen(false)}
      />

    </div>
  );
}

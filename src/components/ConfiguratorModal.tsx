/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Atelier Configurator
 */

import React, { useState } from "react";
import { CONFIG_OPTIONS } from "../data";
import { BuildState } from "../types";
import { X, Check, ShieldCheck, Mail, MapPin } from "lucide-react";

interface ConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfiguratorModal({ isOpen, onClose }: ConfiguratorModalProps) {
  // Config state
  const [build, setBuild] = useState<BuildState>({
    paint: CONFIG_OPTIONS.paintColors[0].name,
    interior: CONFIG_OPTIONS.interiorStyles[0].name,
    wheel: CONFIG_OPTIONS.wheelOptions[0].name,
    calipers: CONFIG_OPTIONS.caliperColors[0].name,
  });

  // Booking states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("Maranello Factory Delivery (Fiorano Track Experience)");
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Selected object references
  const currentPaint = CONFIG_OPTIONS.paintColors.find((p) => p.name === build.paint) || CONFIG_OPTIONS.paintColors[0];
  const currentInterior = CONFIG_OPTIONS.interiorStyles.find((i) => i.name === build.interior) || CONFIG_OPTIONS.interiorStyles[0];
  const currentWheel = CONFIG_OPTIONS.wheelOptions.find((w) => w.name === build.wheel) || CONFIG_OPTIONS.wheelOptions[0];
  const currentCaliper = CONFIG_OPTIONS.caliperColors.find((c) => c.name === build.calipers) || CONFIG_OPTIONS.caliperColors[0];

  // Genuine Ferrari 458 Italia MSRP
  const baselinePrice = 239340; 
  const optionCosts = currentPaint.price + currentInterior.price + currentWheel.price + currentCaliper.price;
  const totalPrice = baselinePrice + optionCosts;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert("Please provide required contact info.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setBooked(true);
    }, 1200);
  };

  const handleReset = () => {
    setBooked(false);
    setClientName("");
    setClientEmail("");
  };

  return (
    <div id="config-overlay" className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 lg:p-10 overflow-y-auto">
      
      {/* Main modal frame */}
      <div 
        className="relative w-full max-w-6xl bg-black border border-zinc-900 rounded-2xl overflow-hidden flex flex-col lg:flex-row h-auto max-h-[92vh] shadow-2xl"
        id="config-dashboard-box"
      >
        
        {/* Close button */}
        <button
          id="config-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-white bg-zinc-950 hover:bg-zinc-900 rounded-full border border-zinc-900 transition-colors cursor-pointer"
          title="Exit Atelier"
        >
          <X className="w-5 h-5" />
        </button>

        {!booked ? (
          <>
            {/* LEFT COLUMN: LIVE BUILD PREVIEW & RECKONING LEDGER */}
            <div className="lg:w-[45%] bg-zinc-950/90 p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-900 overflow-y-auto">
              <div>
                <span className="font-mono text-[9px] text-red-500 font-bold uppercase tracking-widest block mb-1">
                  // ATELIER MARANELLO MANIFEST
                </span>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight mb-6">
                  Ferrari 458 Italia Bespoke
                </h3>

                {/* Live Build Breakdown Cards */}
                <div className="flex flex-col gap-3" id="config-spec-breakdown">
                  
                  <div className="p-3.5 bg-black border border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-mono">Exterior Paintwork</span>
                      <span className="font-display font-bold text-zinc-200 mt-0.5 block">{currentPaint.name}</span>
                    </div>
                    <span className="font-mono text-zinc-300 font-semibold">
                      {currentPaint.price === 0 ? "Standard" : `+$${currentPaint.price.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="p-3.5 bg-black border border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-mono">Cockpit Upholstery</span>
                      <span className="font-display font-bold text-zinc-200 mt-0.5 block">{currentInterior.name}</span>
                    </div>
                    <span className="font-mono text-zinc-300 font-semibold">
                      {currentInterior.price === 0 ? "Standard" : `+$${currentInterior.price.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="p-3.5 bg-black border border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-mono">Forged Wheel Design</span>
                      <span className="font-display font-bold text-zinc-200 mt-0.5 block">{currentWheel.name}</span>
                    </div>
                    <span className="font-mono text-zinc-300 font-semibold">
                      {currentWheel.price === 0 ? "Standard" : `+$${currentWheel.price.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="p-3.5 bg-black border border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-mono">Brembo CCM Caliper Finish</span>
                      <span className="font-display font-bold text-zinc-200 mt-0.5 block">{currentCaliper.name}</span>
                    </div>
                    <span className="font-mono text-zinc-300 font-semibold">
                      {currentCaliper.price === 0 ? "Standard" : `+$${currentCaliper.price.toLocaleString()}`}
                    </span>
                  </div>

                </div>
              </div>

              {/* Price Calculation Bottom Bar */}
              <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Base MSRP</span>
                  <span className="font-mono text-sm text-zinc-400">${baselinePrice.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Atelier Options</span>
                  <span className="font-mono text-sm text-zinc-400">+${optionCosts.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-zinc-900 pt-3">
                  <span className="font-display font-bold text-sm text-white uppercase tracking-wider">Total Commission</span>
                  <span className="font-mono font-black text-2xl text-red-500">
                    ${totalPrice.toLocaleString()} <span className="text-xs font-normal text-zinc-400">USD</span>
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONFIGURATION PICKERS & FORM */}
            <div className="lg:w-[55%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-black">
              
              <div className="flex flex-col gap-6">
                <h4 className="font-display font-black text-lg text-white uppercase tracking-wide">
                  Atelier Personalization Program
                </h4>

                {/* Paint Picker */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    Exterior Paint // {build.paint}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {CONFIG_OPTIONS.paintColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setBuild({ ...build, paint: color.name })}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          build.paint === color.name
                            ? "bg-zinc-900 border-red-600 shadow-md"
                            : "bg-zinc-950 border-zinc-900 hover:border-zinc-700"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: color.hex }} />
                        <span className="text-[11px] font-display font-semibold text-zinc-200 truncate">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interior Picker */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    Cockpit Trim // {build.interior}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {CONFIG_OPTIONS.interiorStyles.map((interior) => (
                      <button
                        key={interior.name}
                        onClick={() => setBuild({ ...build, interior: interior.name })}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          build.interior === interior.name
                            ? "bg-zinc-900 border-red-600 shadow-md"
                            : "bg-zinc-950 border-zinc-900 hover:border-zinc-700"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: interior.hex }} />
                        <div className="truncate">
                          <span className="text-[11px] font-display font-semibold text-zinc-200 block truncate">{interior.name}</span>
                          <span className="text-[9px] text-zinc-500 block truncate">{interior.material}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wheels Picker */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    Forged Wheels // {build.wheel}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {CONFIG_OPTIONS.wheelOptions.map((wheel) => (
                      <button
                        key={wheel.name}
                        onClick={() => setBuild({ ...build, wheel: wheel.name })}
                        className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                          build.wheel === wheel.name
                            ? "bg-zinc-900 border-red-600 shadow-md"
                            : "bg-zinc-950 border-zinc-900 hover:border-zinc-700"
                        }`}
                      >
                        <div>
                          <span className="text-[11px] font-display font-semibold text-zinc-200 block">{wheel.name}</span>
                          <span className="text-[9px] text-zinc-500 block">{wheel.text}</span>
                        </div>
                        <span className="font-mono text-[11px] text-zinc-400 font-bold shrink-0 ml-2">
                          {wheel.price === 0 ? "Included" : `+$${wheel.price.toLocaleString()}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caliper Picker */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    Brembo CCM Caliper Color // {build.calipers}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {CONFIG_OPTIONS.caliperColors.map((caliper) => (
                      <button
                        key={caliper.name}
                        onClick={() => setBuild({ ...build, calipers: caliper.name })}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          build.calipers === caliper.name
                            ? "bg-zinc-900 border-red-600 shadow-md"
                            : "bg-zinc-950 border-zinc-900 hover:border-zinc-700"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: caliper.hex }} />
                        <span className="text-[9.5px] font-display font-semibold text-zinc-200 truncate w-full">{caliper.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Commission Submission Form */}
              <form onSubmit={handleSubmitBooking} className="mt-8 pt-6 border-t border-zinc-900 flex flex-col gap-3">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">
                  CLIENT REGISTRATION // MARANELLO FACTORY ALLOCATION
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Full Legal Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                  <input
                    type="email"
                    placeholder="Client Official Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-950/40 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? "TRANSMITTING TO MARANELLO..." : "SUBMIT ATELIER COMMISSION"}
                </button>
              </form>

            </div>
          </>
        ) : (
          /* Booked Confirmation Screen */
          <div className="w-full p-12 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center text-red-500">
              <Check className="w-8 h-8" />
            </div>
            
            <div className="max-w-md flex flex-col gap-2">
              <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold">
                COMMISSION ALLOCATED // CHASSIS FER-458
              </span>
              <h3 className="font-display font-black text-3xl text-white uppercase">
                Welcome to the Scuderia Family
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light mt-2">
                Thank you, <span className="text-white font-bold">{clientName}</span>. Your bespoke Ferrari 458 Italia commission dossier has been registered. A Maranello Private Client liaison has dispatched your allocation packet to <span className="text-red-400">{clientEmail}</span>.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 text-left w-full max-w-sm text-xs flex flex-col gap-2 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Exterior:</span>
                <span className="text-white font-bold">{build.paint}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Interior:</span>
                <span className="text-white font-bold">{build.interior}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Wheels:</span>
                <span className="text-white font-bold">{build.wheel}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Calipers:</span>
                <span className="text-white font-bold">{build.calipers}</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-t border-zinc-900 pt-2">
                <span>Commission Total:</span>
                <span className="text-red-500 font-bold">${totalPrice.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-mono text-xs uppercase cursor-pointer"
              >
                Configure Another
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs uppercase font-bold cursor-pointer"
              >
                Close Atelier
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

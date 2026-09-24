/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Technical Manifest
 */

import { useState } from "react";
import { CAR_SPECIFICATIONS } from "../data";
import { FileText, ChevronRight } from "lucide-react";

export default function SpecificationsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("Powertrain");

  const currentCategorySpecs = CAR_SPECIFICATIONS.find(
    (spec) => spec.category === activeCategory
  );

  return (
    <section id="spec-details" className="relative py-24 bg-black border-b border-zinc-900/60 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-2">
            // OFFICIAL HOMOLOGATION LOG
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight flex items-center gap-2.5">
            Maranello Factory Specifications
          </h2>
          <p className="text-zinc-400 font-display text-sm md:text-base mt-2 font-light">
            Every millimeter and component of the Ferrari 458 Italia has been audited and certified at Fiorano. Explore the comprehensive technical database below.
          </p>
        </div>

        {/* Tab Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left vertical tab selectors */}
          <div className="lg:col-span-4 flex flex-col gap-2" id="spec-tab-selectors">
            {CAR_SPECIFICATIONS.map((spec) => (
              <button
                key={spec.category}
                id={`spec-tab-btn-${spec.category.toLowerCase().replace(/[^a-z]/g, "")}`}
                onClick={() => setActiveCategory(spec.category)}
                className={`py-4 px-6 rounded-xl text-left font-display text-xs tracking-widest uppercase transition-all flex items-center justify-between border cursor-pointer ${
                  spec.category === activeCategory
                    ? "bg-zinc-950 text-red-500 border-red-600/40 shadow-lg shadow-red-950/20 font-bold"
                    : "bg-black text-zinc-500 border-zinc-900 hover:bg-zinc-950 hover:text-white"
                }`}
              >
                <span>{spec.category}</span>
                <ChevronRight className={`w-4 h-4 transition-transform leading-none ${
                  spec.category === activeCategory ? "translate-x-1" : "opacity-0"
                }`} />
              </button>
            ))}
          </div>

          {/* Right details content lists */}
          <div className="lg:col-span-8 bg-zinc-950/80 p-6 lg:p-10 border border-zinc-900 rounded-2xl shadow-xl" id="spec-content-sheet">
            <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-8">
              <FileText className="w-5 h-5 text-red-500" />
              <h3 className="font-display font-black text-white text-lg uppercase tracking-wider">
                {activeCategory} Specifications
              </h3>
            </div>

            <div className="flex flex-col gap-6" id="spec-list">
              {currentCategorySpecs?.items.map((item, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-4 last:border-b-0 animate-fadeIn"
                >
                  <div className="max-w-md">
                    <h4 className="font-display font-bold text-white text-sm tracking-wide">
                      {item.label}
                    </h4>
                    {item.detail && (
                      <p className="text-zinc-500 font-display text-xs mt-1 font-light leading-relaxed">
                        {item.detail}
                      </p>
                    )}
                  </div>
                  <div className="text-left md:text-right">
                    <span className="font-mono text-sm md:text-base font-bold text-red-400">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-600">
              <span>HOMOLOGATION: ECE / FIA GT3 BASE ARCHITECTURE</span>
              <span>SCUDERIA FERRARI</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

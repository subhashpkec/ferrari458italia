/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { GALLERY_ITEMS } from "../data";
import { GalleryItem } from "../types";
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = [
    { label: "ALL PRESS COATINGS", value: "all" },
    { label: "EXTERIOR", value: "exterior" },
    { label: "INTERIOR", value: "interior" },
    { label: "ENGINEERING", value: "engineering" },
    { label: "TRACK ATMOSPHERE", value: "track" },
  ];

  const filteredItems = activeFilter === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (id: string) => {
    const originalIndex = GALLERY_ITEMS.findIndex((item) => item.id === id);
    if (originalIndex !== -1) {
      setLightboxIndex(originalIndex);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  const prevSlide = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  return (
    <section id="gallery-section" className="relative py-24 bg-black border-b border-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-2">// MARANELLO ARCHIVE</span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight">
              Ferrari 458 Italia Gallery
            </h2>
            <p className="text-zinc-400 font-display text-sm mt-2 font-light">
              Captured at the Pista di Fiorano, Maranello atelier, and global circuits. Explore the Pininfarina design, F1 driver cockpit, and Tipo F136 FB V8 architecture.
            </p>
          </div>

          {/* Filtering row */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-2 md:pb-0" id="gallery-filters">
            {filters.map((filt) => (
              <button
                key={filt.value}
                id={`gallery-filter-${filt.value}`}
                onClick={() => setActiveFilter(filt.value)}
                className={`px-3 py-1.5 font-mono text-[9px] tracking-widest uppercase transition-colors cursor-pointer ${
                  activeFilter === filt.value
                    ? "text-gold border-b-2 border-gold font-bold"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {filt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              onClick={() => openLightbox(item.id)}
              className="group relative h-72 rounded-lg overflow-hidden border border-zinc-900/60 bg-zinc-950 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-gold/30"
            >
              {/* Image element with required referrerPolicy */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover filter brightness-85 group-hover:brightness-60 group-hover:scale-105 transition-all duration-700 select-none"
                referrerPolicy="no-referrer"
              />

              {/* Carbon overlay weave that fades in */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 carbon-weave" />

              {/* Interactive Hover HUD Details */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div className="flex justify-between items-start">
                  <span className="bg-gold/10 text-gold border border-gold/20 font-mono text-[8px] px-2 py-0.5 rounded leading-none">
                    {item.category.toUpperCase()}
                  </span>
                  <Maximize2 className="w-4 h-4 text-zinc-400 group-hover:text-gold transition-colors" />
                </div>
                <div>
                  <h4 className="font-display font-black text-white text-base tracking-wide uppercase">
                    {item.title}
                  </h4>
                  <span className="font-mono text-[9px] text-zinc-500 mt-1 select-none flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Full-screen inspection
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex flex-col justify-between p-6 animate-fadeIn"
          id="gallery-lightbox-modal"
        >
          {/* Top Panel */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-4">
              <span className="font-display font-semibold text-xs tracking-widest text-gold uppercase">// AETHERIS PORTFOLIO</span>
              <span className="font-mono text-[10px] text-zinc-600">
                IMAGE {lightboxIndex + 1} OF {GALLERY_ITEMS.length}
              </span>
            </div>
            
            <button
              id="lightbox-close-btn"
              onClick={closeLightbox}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-full transition-all cursor-pointer"
              title="Close Inspection View"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Active Slider Image Container */}
          <div className="relative flex-grow flex items-center justify-center max-h-[75vh]">
            {/* Left selector */}
            <button
              id="lightbox-prev-btn"
              onClick={prevSlide}
              className="absolute left-4 p-3 bg-zinc-950/80 border border-zinc-900 hover:border-gold hover:text-gold text-white rounded-full transition-all cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main high fidelity photo rendering */}
            <img
              src={GALLERY_ITEMS[lightboxIndex].src}
              alt={GALLERY_ITEMS[lightboxIndex].alt}
              className="max-w-full max-h-full object-contain object-center rounded border border-zinc-900 shadow-2xl animate-scaleIn select-none"
              referrerPolicy="no-referrer"
            />

            {/* Right selector */}
            <button
              id="lightbox-next-btn"
              onClick={nextSlide}
              className="absolute right-4 p-3 bg-zinc-950/80 border border-zinc-900 hover:border-gold hover:text-gold text-white rounded-full transition-all cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Panel Descriptions */}
          <div className="max-w-4xl mx-auto text-center pb-6">
            <h3 className="font-display font-black text-xl text-white uppercase tracking-wide">
              {GALLERY_ITEMS[lightboxIndex].title}
            </h3>
            <p className="text-zinc-500 font-display text-xs mt-1 leading-relaxed">
              {GALLERY_ITEMS[lightboxIndex].alt}
            </p>
            <div className="flex justify-center gap-1.5 mt-4">
              {GALLERY_ITEMS.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setLightboxIndex(dotIndex)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    dotIndex === lightboxIndex ? "bg-gold w-6" : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      )}

    </section>
  );
}

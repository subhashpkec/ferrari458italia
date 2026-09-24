/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Navbar
 */

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import FerrariLogo from "./FerrariLogo";

interface NavbarProps {
  onOpenConfigurator: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export default function Navbar({ onOpenConfigurator, onNavigateSection }: NavbarProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Overview", id: "home-hero" },
    { label: "3D Showroom", id: "inter-viewer" },
    { label: "Performance", id: "perf-section" },
    { label: "Engineering", id: "tech-section" },
    { label: "Gallery", id: "gallery-section" },
    { label: "Specifications", id: "spec-details" },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        hasScrolled
          ? "bg-black/90 border-b border-zinc-900/80 py-4 backdrop-blur-md shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Authentic Scuderia Ferrari Logo */}
        <div 
          onClick={() => handleNavClick("home-hero")}
          className="cursor-pointer select-none group"
          id="navbar-logo"
        >
          <FerrariLogo showText size="md" />
        </div>

        {/* Mid Navigation Links */}
        <div className="hidden lg:flex items-center gap-8" id="desktop-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.label.toLowerCase()}`}
              onClick={() => handleNavClick(item.id)}
              className="font-display text-xs tracking-widest text-zinc-400 hover:text-white uppercase transition-colors duration-300 cursor-pointer font-medium relative py-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-red-600 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Call to action & Mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            id="nav-trigger-reserve-btn"
            onClick={onOpenConfigurator}
            className="hidden sm:inline-block px-5 py-2 border border-red-600/60 text-red-400 hover:text-white hover:bg-red-600 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all duration-300 shadow-md shadow-red-950/20 cursor-pointer font-semibold"
          >
            ATELIER COMMISSION
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-black/98 border-l border-zinc-900/60 p-6 z-40 backdrop-blur-xl flex flex-col justify-between"
          id="mobile-menu-drawer"
        >
          <div className="flex flex-col gap-6 mt-12">
            <span className="font-mono text-[9px] text-zinc-500 tracking-wider">MARANELLO NAVIGATION</span>
            <div className="flex flex-col gap-5">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left font-display text-base tracking-widest text-zinc-300 hover:text-red-500 uppercase transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConfigurator();
              }}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-mono text-xs uppercase tracking-widest font-bold"
            >
              ATELIER CONFIGURATOR
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

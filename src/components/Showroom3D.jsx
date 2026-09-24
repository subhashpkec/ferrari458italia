import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Showroom3D — An immersive, cinematic 3D-styled showroom section
 * featuring a rotating car silhouette with ambient lighting,
 * interactive camera presets, and Ferrari-inspired telemetry UI.
 */

const CAMERA_PRESETS = [
  { id: 'front', label: 'Front Profile', angle: 0 },
  { id: 'quarter', label: '3/4 View', angle: 45 },
  { id: 'side', label: 'Side Profile', angle: 90 },
  { id: 'rear', label: 'Rear View', angle: 180 },
  { id: 'top', label: 'Top Down', angle: 270 },
];

const SPEC_CARDS = [
  {
    title: 'Tipo F136 FB V8',
    stat: '570 CV',
    detail: '4,497 cc naturally-aspirated 180° flat-plane crankshaft',
    accent: '#dc2626',
  },
  {
    title: 'Lightning Acceleration',
    stat: '3.4s',
    detail: '0-100 km/h with launch control engaged',
    accent: '#f59e0b',
  },
  {
    title: 'Maximum Velocity',
    stat: '325 km/h',
    detail: 'Aerodynamic Cd 0.33 with active flaps deployed',
    accent: '#ef4444',
  },
  {
    title: 'Dry Weight',
    stat: '1,380 kg',
    detail: 'Aluminium space-frame with carbon-fibre panels',
    accent: '#a3a3a3',
  },
];

const Showroom3D = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activePreset, setActivePreset] = useState('quarter');
  const [rotationAngle, setRotationAngle] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [ambientHue, setAmbientHue] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Ambient hue cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbientHue((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Show details with delay for entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Canvas-based 3D-style showroom rendering
  const drawShowroom = useCallback(
    (ctx, width, height, angle) => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Dark gradient background with subtle ambient glow
      const bgGrad = ctx.createRadialGradient(
        width / 2, height * 0.6, 0,
        width / 2, height * 0.6, width * 0.7
      );
      bgGrad.addColorStop(0, `hsla(${ambientHue}, 80%, 8%, 1)`);
      bgGrad.addColorStop(0.5, 'rgba(10, 10, 10, 1)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Floor reflection grid
      const centerX = width / 2;
      const centerY = height * 0.65;

      // Draw reflective floor
      const floorGrad = ctx.createLinearGradient(0, centerY, 0, height);
      floorGrad.addColorStop(0, 'rgba(220, 38, 38, 0.06)');
      floorGrad.addColorStop(0.3, 'rgba(30, 30, 30, 0.03)');
      floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, centerY, width, height - centerY);

      // Grid lines on floor (perspective)
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.07)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 20; i++) {
        const yOff = centerY + i * 12;
        const spread = (i / 20) * width * 0.8;
        ctx.beginPath();
        ctx.moveTo(centerX - spread, yOff);
        ctx.lineTo(centerX + spread, yOff);
        ctx.stroke();
      }
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + i * width * 0.08, height);
        ctx.stroke();
      }

      // Rotating car silhouette
      const rad = (angle * Math.PI) / 180;
      const carWidth = width * 0.45;
      const carHeight = height * 0.18;
      const scaleX = Math.cos(rad);
      const perspectiveStretch = 1 + Math.abs(Math.sin(rad)) * 0.15;

      ctx.save();
      ctx.translate(centerX, centerY - carHeight * 0.5);
      ctx.scale(scaleX || 0.15, perspectiveStretch);

      // Car body shadow
      const shadowGrad = ctx.createRadialGradient(0, carHeight * 0.8, 0, 0, carHeight * 0.8, carWidth * 0.6);
      shadowGrad.addColorStop(0, 'rgba(220, 38, 38, 0.12)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, carHeight * 0.8, carWidth * 0.55, carHeight * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car body
      const bodyGrad = ctx.createLinearGradient(0, -carHeight, 0, carHeight * 0.5);
      bodyGrad.addColorStop(0, '#8b0000');
      bodyGrad.addColorStop(0.3, '#dc2626');
      bodyGrad.addColorStop(0.5, '#b91c1c');
      bodyGrad.addColorStop(0.8, '#7f1d1d');
      bodyGrad.addColorStop(1, '#450a0a');

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      // Sleek hypercar shape
      ctx.moveTo(-carWidth * 0.5, carHeight * 0.1);
      ctx.bezierCurveTo(-carWidth * 0.48, -carHeight * 0.15, -carWidth * 0.4, -carHeight * 0.4, -carWidth * 0.25, -carHeight * 0.5);
      ctx.bezierCurveTo(-carWidth * 0.15, -carHeight * 0.55, -carWidth * 0.05, -carHeight * 0.7, 0, -carHeight * 0.72);
      ctx.bezierCurveTo(carWidth * 0.1, -carHeight * 0.7, carWidth * 0.2, -carHeight * 0.55, carWidth * 0.25, -carHeight * 0.48);
      ctx.bezierCurveTo(carWidth * 0.35, -carHeight * 0.35, carWidth * 0.45, -carHeight * 0.1, carWidth * 0.5, carHeight * 0.1);
      ctx.bezierCurveTo(carWidth * 0.48, carHeight * 0.25, carWidth * 0.3, carHeight * 0.35, 0, carHeight * 0.38);
      ctx.bezierCurveTo(-carWidth * 0.3, carHeight * 0.35, -carWidth * 0.48, carHeight * 0.25, -carWidth * 0.5, carHeight * 0.1);
      ctx.closePath();
      ctx.fill();

      // Windshield highlight
      const windshieldGrad = ctx.createLinearGradient(0, -carHeight * 0.65, 0, -carHeight * 0.3);
      windshieldGrad.addColorStop(0, 'rgba(100, 180, 255, 0.15)');
      windshieldGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = windshieldGrad;
      ctx.beginPath();
      ctx.moveTo(-carWidth * 0.18, -carHeight * 0.48);
      ctx.bezierCurveTo(-carWidth * 0.1, -carHeight * 0.62, carWidth * 0.05, -carHeight * 0.65, carWidth * 0.12, -carHeight * 0.55);
      ctx.bezierCurveTo(carWidth * 0.18, -carHeight * 0.42, carWidth * 0.15, -carHeight * 0.32, 0, -carHeight * 0.3);
      ctx.bezierCurveTo(-carWidth * 0.12, -carHeight * 0.32, -carWidth * 0.18, -carHeight * 0.4, -carWidth * 0.18, -carHeight * 0.48);
      ctx.closePath();
      ctx.fill();

      // Specular highlight strip on body
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.ellipse(carWidth * 0.05, -carHeight * 0.2, carWidth * 0.35, carHeight * 0.04, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Headlights glow
      if (Math.abs(scaleX) > 0.3) {
        const headlightGlow = ctx.createRadialGradient(
          -carWidth * 0.45, -carHeight * 0.05, 0,
          -carWidth * 0.45, -carHeight * 0.05, carWidth * 0.12
        );
        headlightGlow.addColorStop(0, 'rgba(255, 230, 180, 0.5)');
        headlightGlow.addColorStop(0.3, 'rgba(255, 200, 100, 0.15)');
        headlightGlow.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = headlightGlow;
        ctx.beginPath();
        ctx.ellipse(-carWidth * 0.45, -carHeight * 0.05, carWidth * 0.12, carWidth * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tail lights glow
      if (Math.abs(scaleX) > 0.3) {
        const tailGlow = ctx.createRadialGradient(
          carWidth * 0.46, 0, 0,
          carWidth * 0.46, 0, carWidth * 0.08
        );
        tailGlow.addColorStop(0, 'rgba(255, 0, 0, 0.6)');
        tailGlow.addColorStop(0.5, 'rgba(255, 0, 0, 0.15)');
        tailGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = tailGlow;
        ctx.beginPath();
        ctx.ellipse(carWidth * 0.46, 0, carWidth * 0.08, carWidth * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wheels
      const wheelRadius = carHeight * 0.18;
      const wheelPositions = [
        { x: -carWidth * 0.32, y: carHeight * 0.28 },
        { x: carWidth * 0.28, y: carHeight * 0.28 },
      ];
      wheelPositions.forEach((wp) => {
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(wp.x, wp.y, wheelRadius, wheelRadius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Wheel rim detail
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        ctx.ellipse(wp.x, wp.y, wheelRadius * 0.5, wheelRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Center cap
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(wp.x, wp.y, wheelRadius * 0.15, wheelRadius * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Ambient light beams from above
      for (let i = 0; i < 3; i++) {
        const beamX = centerX + (i - 1) * width * 0.25;
        const beamGrad = ctx.createLinearGradient(beamX, 0, beamX, centerY);
        beamGrad.addColorStop(0, `rgba(220, 38, 38, ${0.04 + Math.sin(ambientHue * 0.05 + i) * 0.02})`);
        beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(beamX - 30, 0);
        ctx.lineTo(beamX - 80, centerY);
        ctx.lineTo(beamX + 80, centerY);
        ctx.lineTo(beamX + 30, 0);
        ctx.closePath();
        ctx.fill();
      }

      // Corner vignette
      const vignetteGrad = ctx.createRadialGradient(centerX, height / 2, width * 0.3, centerX, height / 2, width * 0.75);
      vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);
    },
    [ambientHue]
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      drawShowroom(ctx, rect.width, rect.height, rotationAngle);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [rotationAngle, drawShowroom]);

  // Mouse drag rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - lastX;
    setRotationAngle((prev) => (prev + delta * 0.5) % 360);
    setLastX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag rotation
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setLastX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - lastX;
    setRotationAngle((prev) => (prev + delta * 0.5) % 360);
    setLastX(e.touches[0].clientX);
  };

  const handlePresetClick = (preset) => {
    setActivePreset(preset.id);
    setRotationAngle(preset.angle);
  };

  return (
    <section
      className="relative w-full bg-black overflow-hidden select-none"
      style={{ minHeight: '100vh' }}
      id="showroom-3d"
    >
      {/* Section Header */}
      <div className="relative z-10 pt-20 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <span
          className="font-mono text-red-500 uppercase tracking-widest font-bold block mb-2"
          style={{ fontSize: '10px' }}
        >
          // 3D SHOWROOM EXPERIENCE
        </span>
        <h2 className="font-black text-4xl md:text-5xl text-white uppercase tracking-tight"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
          Cinematic Showroom
        </h2>
        <p className="text-zinc-400 text-sm md:text-base mt-4 font-light max-w-2xl">
          Drag to rotate the Ferrari 458 Italia in our virtual Maranello showroom.
          Select camera presets to explore every sculpted curve and aerodynamic surface.
        </p>
      </div>

      {/* Interactive Canvas */}
      <div
        className="relative w-full"
        style={{ height: '60vh', minHeight: '400px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />

        {/* Drag hint overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="px-5 py-2.5 rounded-full border border-zinc-800 bg-black/50 backdrop-blur-sm transition-opacity duration-1000"
            style={{ opacity: showDetails ? 0 : 0.8 }}
          >
            <span className="font-mono text-zinc-400" style={{ fontSize: '11px' }}>
              ← DRAG TO ROTATE →
            </span>
          </div>
        </div>

        {/* Rotation telemetry */}
        <div className="absolute bottom-4 left-6 font-mono text-zinc-500 z-10" style={{ fontSize: '10px' }}>
          <span>ROTATION: </span>
          <span className="text-red-500 font-semibold">{Math.round(rotationAngle)}°</span>
          <span className="ml-3">PRESET: </span>
          <span className="text-zinc-300 uppercase">{activePreset}</span>
        </div>
      </div>

      {/* Camera Preset Controls */}
      <div className="relative z-10 px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {CAMERA_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
                activePreset === preset.id
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/30'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spec Cards Grid */}
      <div className="relative z-10 px-6 md:px-12 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {SPEC_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/60 hover:border-zinc-800 transition-all duration-300 group"
              style={{
                opacity: showDetails ? 1 : 0,
                transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1 + 0.3}s`,
              }}
            >
              <span
                className="font-mono font-semibold uppercase block mb-1"
                style={{ fontSize: '9px', color: card.accent }}
              >
                {card.title}
              </span>
              <span className="text-3xl font-black text-white block tracking-tight">
                {card.stat}
              </span>
              <p className="text-zinc-500 text-xs mt-2 font-light leading-relaxed group-hover:text-zinc-400 transition-colors">
                {card.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient corner glow */}
      <div
        className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, rgba(220, 38, 38, 0.04) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 100% 100%, rgba(220, 38, 38, 0.03) 0%, transparent 60%)`,
        }}
      />
    </section>
  );
};

export default Showroom3D;

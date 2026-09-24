/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari Scuderia Prancing Horse (Cavallino Rampante) SVG Logo
 */

interface FerrariLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export default function FerrariLogo({ className = "", size = "md", showText = false }: FerrariLogoProps) {
  const dimensions = {
    sm: { w: 24, h: 32 },
    md: { w: 32, h: 42 },
    lg: { w: 48, h: 64 },
    xl: { w: 64, h: 86 },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Authentic Scuderia Ferrari Shield */}
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 100 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_2px_8px_rgba(255,208,0,0.3)]"
      >
        {/* Shield Outer Border */}
        <path
          d="M 6 4 L 94 4 L 94 88 C 94 116 50 132 50 132 C 50 132 6 116 6 88 Z"
          fill="#ffd000"
          stroke="#111111"
          strokeWidth="3.5"
        />

        {/* Italian Tricolor Top Banner */}
        {/* Green */}
        <rect x="7" y="5" width="28.6" height="11" fill="#009246" />
        {/* White */}
        <rect x="35.6" y="5" width="28.8" height="11" fill="#ffffff" />
        {/* Red */}
        <rect x="64.4" y="5" width="28.6" height="11" fill="#ce2b37" />
        
        {/* Horizontal Divider Line beneath Tricolor */}
        <line x1="7" y1="16" x2="93" y2="16" stroke="#111111" strokeWidth="2" />

        {/* Cavallino Rampante - Prancing Horse Silhouette */}
        <g fill="#111111" transform="translate(18, 22) scale(0.64)">
          {/* Detailed Prancing Stallion Path */}
          <path d="M 68 18 C 66 12 60 7 53 5 C 50 4 48 5 47 7 C 46 9 47 11 49 13 C 47 13 44 14 43 16 C 41 18 41 21 44 23 C 42 24 39 26 38 29 C 37 32 38 35 41 37 C 39 39 37 42 36 45 C 35 50 38 54 42 56 C 41 58 39 61 38 64 C 36 70 38 76 43 80 L 41 94 C 40 98 42 102 46 103 C 48 104 51 103 52 100 L 55 86 C 58 87 61 88 65 87 L 68 102 C 69 106 72 108 76 107 C 79 106 81 103 80 99 L 76 83 C 82 78 85 71 84 64 C 84 57 80 52 75 48 C 76 44 76 39 74 35 C 72 31 68 28 64 26 C 65 23 66 20 68 18 Z M 35 34 C 31 35 27 37 25 41 C 23 45 24 50 27 53 L 34 49 C 32 46 32 42 34 39 Z M 20 60 C 16 63 14 68 15 73 C 16 78 20 81 25 81 L 28 73 C 25 72 23 69 23 65 Z" />
          {/* Raised Front Left Leg */}
          <path d="M 44 26 C 38 23 30 22 24 25 C 19 28 17 33 18 39 C 19 43 23 46 27 45 C 29 44 30 42 29 39 C 28 36 29 33 32 31 C 36 29 41 30 45 32 Z" />
          {/* Raised Front Right Leg */}
          <path d="M 49 19 C 45 14 39 10 33 9 C 27 8 23 11 21 16 C 20 20 22 24 26 25 C 29 25 31 23 31 20 C 31 17 34 14 38 14 C 42 14 46 16 48 20 Z" />
          {/* Stallion Mane & Head Details */}
          <path d="M 54 6 C 56 4 60 4 63 6 C 66 8 67 12 65 15 C 63 16 61 15 60 13 C 59 11 57 9 55 9 C 53 9 52 8 54 6 Z" />
          {/* Flamboyant Flowing Tail */}
          <path d="M 77 52 C 84 48 90 42 92 34 C 93 28 90 22 85 19 C 81 17 77 19 76 23 C 75 26 77 29 80 30 C 83 31 84 34 83 37 C 82 41 78 45 73 48 Z" />
        </g>

        {/* Traditional 'S F' (Scuderia Ferrari) Initials */}
        <text
          x="23"
          y="114"
          fill="#111111"
          fontSize="17"
          fontFamily="serif"
          fontWeight="900"
          letterSpacing="0"
        >
          S
        </text>
        <text
          x="65"
          y="114"
          fill="#111111"
          fontSize="17"
          fontFamily="serif"
          fontWeight="900"
          letterSpacing="0"
        >
          F
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-black text-sm tracking-[0.25em] text-white leading-none">
            FERRARI
          </span>
          <span className="font-mono text-[8px] text-red-500 tracking-widest leading-none mt-1 uppercase font-bold">
            Scuderia // Maranello
          </span>
        </div>
      )}
    </div>
  );
}

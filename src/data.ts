/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia Technical Manifest & Specifications
 * Scuderia Ferrari / Maranello, Italy
 */

import { CarSpecification, Hotspot, GalleryItem, TechFeature, ConfigOptions } from "./types";

export interface FerrariPartDetail {
  name: string;
  code: string;
  category: string;
  material: string;
  specs: string;
  weight: string;
  engineeringNotes: string;
}

// Import Ferrari 458 Italia Assets so Vite bundles them properly in production
import ferrariHeroImg from "./assets/images/ferrari_hero.jpg";
import ferrariCockpitImg from "./assets/images/ferrari_cockpit.jpg";
import ferrariEngineImg from "./assets/images/ferrari_engine.jpg";
import ferrariRearImg from "./assets/images/ferrari_rear.jpg";
import ferrariTrackImg from "./assets/images/ferrari_track.jpg";

// Authentic Ferrari 458 Italia Images
export const CAR_IMAGES = {
  hero: ferrariHeroImg,
  cockpit: ferrariCockpitImg,
  engine: ferrariEngineImg,
  wing: ferrariRearImg,
  driving: ferrariTrackImg,
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "engine",
    label: "Tipo F136 FB 4.5L V8",
    shortDesc: "570 CV @ 9,000 RPM Naturally Aspirated",
    detailedDesc: "The engineering crown of Maranello. A 4,497 cc 90° naturally aspirated V8 with a 180° flat-plane crankshaft, dry-sump lubrication, and direct fuel injection at 200 bar. Produces a world-record 127 CV/litre output with an intoxicating 9,000 RPM redline.",
    position: [0, 0.35, -0.65],
    specKey: "powertrain",
  },
  {
    id: "aero",
    label: "Aeroelastic Front Winglets",
    shortDesc: "Deformable High-Speed Downforce",
    detailedDesc: "Pininfarina-sculpted aeroelastic winglets in the front nose grille. At high speed, aerodynamic pressure causes these flexible composite whiskers to deflect downward, reducing the radiator intake section and cutting aerodynamic drag while stabilizing front axle downforce.",
    position: [0, -0.05, 1.85],
    specKey: "aerodynamics",
  },
  {
    id: "cockpit",
    label: "F1 Driver Cockpit & Manettino",
    shortDesc: "Formula 1 Ergonomics & Shift LEDs",
    detailedDesc: "Eliminates conventional steering column stalks by relocating indicators, high beams, wiper controls, engine start button, and the iconic 5-position Manettino dial directly onto the carbon-fiber steering wheel with upper rim shift indicator LEDs.",
    position: [0, 0.28, 0.15],
    specKey: "equipment",
  },
  {
    id: "brakes",
    label: "Brembo Carbon-Ceramic Matrix (CCM)",
    shortDesc: "398mm Front Rotors & Pre-Fill System",
    detailedDesc: "Co-developed with Brembo, utilizing 398 x 36 mm carbon-ceramic front discs with 6-piston aluminum calipers. Integrated with Ferrari's Pre-Fill system that pre-tensions pads against the discs on throttle lift-off, achieving 100 to 0 km/h in just 32.5 meters.",
    position: [0.82, -0.15, 0.95],
    specKey: "chassis",
  },
  {
    id: "transmission",
    label: "7-Speed Dual-Clutch F1 & E-Diff 3",
    shortDesc: "Zero Gear Shift Interruption",
    detailedDesc: "Getrag 7-speed dual-clutch transmission with electronic E-Diff 3 differential. Seamlessly pre-selects consecutive gears for instantaneous shifts without torque loss, integrated into the F1-Trac stability management computer.",
    position: [0, 0.05, -1.35],
    specKey: "powertrain",
  }
];

export const TECH_FEATURES: TechFeature[] = [
  {
    id: "flat-plane-v8",
    title: "180° Flat-Plane Crankshaft V8",
    subtitle: "Naturally Aspirated Purity up to 9,000 RPM",
    description: "The Tipo F136 FB represents the pinnacle of high-revving naturally aspirated internal combustion. With crank pins arranged at 180° intervals, exhaust pulses alternate evenly between cylinder banks into equal-length 4-into-1 hydroformed exhaust headers, producing the unmistakable piercing Ferrari acoustic signature.",
    imageSrc: CAR_IMAGES.engine,
    specs: [
      { label: "Specific Power Density", value: "127 CV / Litre (Record NA)" },
      { label: "Compression Ratio", value: "12.5 : 1 High-Combustion" },
      { label: "Max Engine Speed", value: "9,000 RPM Redline" },
    ]
  },
  {
    id: "e-diff-f1-trac",
    title: "E-Diff 3 & F1-Trac Integration",
    subtitle: "Cornering Acceleration Boosted by 32%",
    description: "For the first time in a mid-rear V8 Ferrari, the electronic differential (E-Diff 3) is directly integrated into the same ECU as the F1-Trac traction control system. By continuously measuring tire grip and yaw rates, it modulates hydraulic clutch pressure between rear wheels in milliseconds.",
    imageSrc: CAR_IMAGES.cockpit,
    specs: [
      { label: "Response Latency", value: "Under 10 milliseconds" },
      { label: "Corner-Exit Grip Improvement", value: "+32% longitudinal acceleration" },
      { label: "Integration Standard", value: "E-Diff 3 + F1-Trac + SCM2 Magneto" },
    ]
  },
  {
    id: "aerodynamics",
    title: "Pininfarina Aeroelastic Design",
    subtitle: "Active Downforce Without Heavy Spoilers",
    description: "Rather than relying on oversized fixed rear wings, the 458 Italia uses aeroelastic winglets in the front grille and active underbody vortex generators with a triple-tunnel rear diffuser. The result is 140 kg of clean downforce at 200 km/h, scaling to 360 kg at maximum velocity (325 km/h).",
    imageSrc: CAR_IMAGES.wing,
    specs: [
      { label: "Downforce @ 200 km/h", value: "140 kg (309 lbs)" },
      { label: "Downforce @ V-Max (325 km/h)", value: "360 kg (794 lbs)" },
      { label: "Drag Coefficient", value: "0.33 Cd in low-drag attitude" },
    ]
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Pininfarina Aerodynamic Stance",
    category: "exterior",
    src: CAR_IMAGES.hero,
    alt: "Sculpted body lines of the Ferrari 458 Italia"
  },
  {
    id: "gal-2",
    title: "Driver-Centric F1 Cockpit",
    category: "interior",
    src: CAR_IMAGES.cockpit,
    alt: "Ferrari 458 Italia steering wheel with Manettino and shift LEDs"
  },
  {
    id: "gal-3",
    title: "Tipo F136 FB 4.5L Flat-Plane V8",
    category: "engineering",
    src: CAR_IMAGES.engine,
    alt: "Red wrinkle-finish intake plenums of the 9,000 RPM V8"
  },
  {
    id: "gal-4",
    title: "Rear Diffuser & Triple Exhaust",
    category: "exterior",
    src: CAR_IMAGES.wing,
    alt: "Aerodynamic rear diffuser and central triple exhaust outlets"
  },
  {
    id: "gal-5",
    title: "High-G Cornering at Fiorano",
    category: "track",
    src: CAR_IMAGES.driving,
    alt: "Ferrari 458 Italia carving apexes at the Fiorano test circuit"
  }
];

export const CAR_SPECIFICATIONS: CarSpecification[] = [
  {
    category: "Powertrain",
    items: [
      { label: "Engine Code & Layout", value: "Tipo F136 FB // 90° Mid-Rear V8", detail: "Dry-sump lubrication with 4 scavenge pumps" },
      { label: "Total Displacement", value: "4,497 cc (4.5 Litres)", detail: "Bore: 94 mm x Stroke: 81 mm" },
      { label: "Maximum Power Output", value: "570 CV (562 hp / 419 kW) @ 9,000 RPM", detail: "127 CV/L specific output (production NA record)" },
      { label: "Maximum Torque", value: "540 N⋅m (398 lb⋅ft) @ 6,000 RPM", detail: "Over 80% available from 3,250 RPM" },
      { label: "Crankshaft Architecture", value: "180° Flat-Plane Crankshaft", detail: "Equal-spaced exhaust pulses for pure high-pitch acoustics" },
      { label: "Compression Ratio", value: "12.5 : 1", detail: "Gasoline direct injection (GDI) at 200 bar" },
    ]
  },
  {
    category: "Transmission & Drivetrain",
    items: [
      { label: "Gearbox Type", value: "7-Speed Dual-Clutch F1", detail: "Manufactured by Getrag with 0 ms torque cut" },
      { label: "Differential", value: "E-Diff 3 Electronic Differential", detail: "Active torque vectoring across rear wheels" },
      { label: "Clutch System", value: "Dual Wet Multi-Plate Clutches", detail: "Independent clutches for odd and even gears" },
      { label: "Drive Configuration", value: "Rear-Wheel Drive (RWD)", detail: "Integrated with F1-Trac traction management" },
    ]
  },
  {
    category: "Chassis, Dimensions & Weight",
    items: [
      { label: "Chassis Architecture", value: "Modular Alcoa Extruded Aluminum", detail: "Bonded & welded aerospace aluminum extrusions" },
      { label: "Overall Length / Width / Height", value: "4,527 mm / 1,937 mm / 1,213 mm", detail: "Low center of gravity profile" },
      { label: "Wheelbase", value: "2,650 mm (104.3 in)", detail: "Front track: 1,672 mm / Rear track: 1,606 mm" },
      { label: "Dry Weight", value: "1,380 kg (3,042 lb)", detail: "Weight-to-power ratio: 2.42 kg/CV" },
      { label: "Curb Weight", value: "1,485 kg (3,274 lb)", detail: "With optional lightweight carbon components" },
      { label: "Weight Distribution", value: "42% Front / 58% Rear", detail: "Optimal mid-rear polar moment of inertia" },
      { label: "Fuel Tank Capacity", value: "86 Liters (22.7 US gal)", detail: "98 RON unleaded fuel recommendation" },
    ]
  },
  {
    category: "Suspension & Brakes",
    items: [
      { label: "Front Suspension", value: "Double Wishbone Architecture", detail: "L-shaped lower wishbone for superior longitudinal compliance" },
      { label: "Rear Suspension", value: "Multi-Link Rear Setup", detail: "Optimized camber and toe curves under extreme lateral Gs" },
      { label: "Damper System", value: "SCM2 Magnetorheological Suspension", detail: "Fluid viscosity adjusts every 1 millisecond" },
      { label: "Front Brakes", value: "Brembo CCM 398 x 36 mm // 6-Piston", detail: "Carbon-ceramic matrix with internal vane cooling" },
      { label: "Rear Brakes", value: "Brembo CCM 360 x 32 mm // 4-Piston", detail: "Carbon-ceramic matrix with integrated parking caliper" },
      { label: "Tires Front & Rear", value: "235/35 ZR20 Front // 295/35 ZR20 Rear", detail: "Michelin Pilot Super Sport / Cup 2 compounds" },
    ]
  },
  {
    category: "Performance Benchmarks",
    items: [
      { label: "Acceleration (0-100 km/h)", value: "3.4 Seconds", detail: "Official factory rating with Launch Control" },
      { label: "Acceleration (0-200 km/h)", value: "10.4 Seconds", detail: "Sustained flat-plane V8 acceleration" },
      { label: "Quarter Mile (400 m)", value: "11.0 Seconds @ 209 km/h", detail: "F1 dual-clutch rapid shift performance" },
      { label: "Top Vehicle Speed", value: "325 km/h (202 mph)", detail: "In low-drag aeroelastic configuration" },
      { label: "Braking Distance (100-0 km/h)", value: "32.5 Meters (106.6 ft)", detail: "Enhanced with Ferrari Pre-Fill brake technology" },
      { label: "Fiorano Test Track Lap", value: "1:25.00", detail: "Faster than the Ferrari Enzo around Fiorano" },
    ]
  }
];

export const CONFIG_OPTIONS: ConfigOptions = {
  paintColors: [
    { name: "Rosso Corsa", hex: "#D40000", price: 0 },
    { name: "Giallo Modena", hex: "#FFD000", price: 12000 },
    { name: "Nero Daytona", hex: "#111113", price: 14500 },
    { name: "Grigio Silverstone", hex: "#5C636E", price: 15000 },
    { name: "Blu Tour de France", hex: "#153A6B", price: 18000 },
    { name: "Bianco Avus", hex: "#F0F2F5", price: 9500 },
  ],
  interiorStyles: [
    { name: "Nero Leather // Rosso Stitching", material: "Full-Grain Italian Poltrona Frau Leather", hex: "#171717", price: 0 },
    { name: "Cuoio Naturale (Tan)", material: "Supple Semi-Aniline Tuscan Tan Leather", hex: "#A76527", price: 8500 },
    { name: "Rosso Ferrari Nappa", material: "Heritage Italian Red Leather with Carbon Trim", hex: "#8A1C1C", price: 11000 },
    { name: "Alcantara Nera // Carbon Shells", material: "Lightweight Alcantara with Carbon Racing Seats", hex: "#222225", price: 18500 },
  ],
  wheelOptions: [
    { name: "20\" 5-Spoke Forged Painted", text: "Standard 5-spoke monoblock forged alloy in silver finish", price: 0 },
    { name: "20\" Sport Forged Grigio Corsa", text: "Matte dark grey forged racing alloys (-6 kg rotational mass)", price: 7200 },
    { name: "20\" Diamond-Cut Forged Alloys", text: "High-contrast diamond-turned finish with Scuderia caps", price: 9800 },
  ],
  caliperColors: [
    { name: "Giallo Modena (Yellow)", hex: "#FFD000", price: 0 },
    { name: "Rosso Corsa (Red)", hex: "#D40000", price: 2500 },
    { name: "Alluminio (Silver)", hex: "#D1D5DB", price: 1800 },
    { name: "Nero (Black)", hex: "#1F2937", price: 1800 },
  ],
};

// ── Complete & Exhaustive Ferrari 458 Italia Part Dossier Dictionary ───────────────
export const FERRARI_PARTS_DOSSIER: Record<string, FerrariPartDetail> = {
  // 1. Body & Exterior
  body: {
    name: "Alcoa Extruded Aluminum Spaceframe & Body Shell",
    code: "FER-458-SF01",
    category: "Chassis & Bodywork",
    material: "Multi-alloy extruded and cast aluminum with aerospace bonding",
    specs: "Torsional stiffness: 29,800 N⋅m/deg (+15% vs F430) | Beam stiffness: +5%",
    weight: "260 kg complete spaceframe",
    engineeringNotes: "Engineered in collaboration with Alcoa, utilizing modular aluminum profiles and hollow-section extrusions. Maximizes occupant safety and chassis rigidity while keeping dry vehicle mass at just 1,380 kg."
  },
  hood: {
    name: "Front Luggage Bonnet (Cofano Anteriore)",
    code: "FER-458-BD04",
    category: "Aerodynamics & Bodywork",
    material: "Stamped lightweight aluminum alloy",
    specs: "Volume: 230 Liters | Dual radiator exit extraction louvers",
    weight: "8.4 kg",
    engineeringNotes: "In addition to luggage storage, the hood's sculpted top surface accelerates air emerging from front radiators, channelling it smoothly over the windshield to suppress aerodynamic lift."
  },
  door: {
    name: "Lightweight Aluminum Door Assembly",
    code: "FER-458-BD12",
    category: "Body Architecture",
    material: "Single-piece stamped aluminum with integrated side-impact beams",
    specs: "Aero air curtain scoops integrated into trailing edge",
    weight: "14.2 kg per side",
    engineeringNotes: "Features integrated side-impact protection beams and aero channels that guide air directly into the rear flank intake scoops to cool the engine oil coolers."
  },
  trim: {
    name: "Aerodynamic Rubber Weatherstripping & Pillar Trims",
    code: "FER-458-TR02",
    category: "Exterior Sealing",
    material: "EPDM acoustic sealing rubber with low-friction flocking",
    specs: "High-speed air sealing validated to 340 km/h wind speeds",
    weight: "3.1 kg",
    engineeringNotes: "Eliminates high-speed wind buffeting around the A-pillars and cockpit glass, channeling air cleanly along the roof."
  },
  yellow_trim: {
    name: "Scuderia Ferrari Enamel Fender Shields",
    code: "FER-458-BD99",
    category: "Scuderia Heritage",
    material: "Kiln-fired vitreous enamel on stamped brass plate",
    specs: "Historic Cavallino Rampante triangle shield on front fenders",
    weight: "0.2 kg",
    engineeringNotes: "The iconic Scuderia Ferrari racing shield, hand-enameled in Maranello and inset into custom stamped recesses on both front wings."
  },

  // 2. Wheels, Rims & Tires
  rim_fl: {
    name: "20-inch 5-Spoke Forged Alloy Star Wheel (Front Left)",
    code: "FER-458-WH-FL",
    category: "Rolling Chassis",
    material: "High-pressure forged aluminum alloy (6061-T6)",
    specs: "20\" x 8.5J ET52 | 5x114.3 bolt pattern",
    weight: "9.8 kg",
    engineeringNotes: "Forging aligns the aluminum grain along the 5 star spokes, delivering superior fatigue resistance under high lateral cornering loads while saving vital unsprung mass."
  },
  rim_fr: {
    name: "20-inch 5-Spoke Forged Alloy Star Wheel (Front Right)",
    code: "FER-458-WH-FR",
    category: "Rolling Chassis",
    material: "High-pressure forged aluminum alloy (6061-T6)",
    specs: "20\" x 8.5J ET52 | 5x114.3 bolt pattern",
    weight: "9.8 kg",
    engineeringNotes: "Precision balanced to withstand speeds exceeding 325 km/h, paired with custom Ferrari-homologated high-performance compounds."
  },
  rim_rl: {
    name: "20-inch 5-Spoke Forged Alloy Star Wheel (Rear Left)",
    code: "FER-458-WH-RL",
    category: "Rolling Chassis",
    material: "High-pressure forged aluminum alloy (6061-T6)",
    specs: "20\" x 10.5J ET37.5 | Extra-wide rear traction concave",
    weight: "11.2 kg",
    engineeringNotes: "Deep-concave forging design accommodates the massive 295/35 ZR20 rear tire required to transfer 540 N⋅m of flat-plane V8 torque to the asphalt."
  },
  rim_rr: {
    name: "20-inch 5-Spoke Forged Alloy Star Wheel (Rear Right)",
    code: "FER-458-WH-RR",
    category: "Rolling Chassis",
    material: "High-pressure forged aluminum alloy (6061-T6)",
    specs: "20\" x 10.5J ET37.5 | Extra-wide rear traction concave",
    weight: "11.2 kg",
    engineeringNotes: "Engineered with integrated spoke cooling channels that evacuate convective heat away from the rear Brembo carbon-ceramic brake discs."
  },
  rim: {
    name: "20-inch 5-Spoke Forged Alloy Star Wheel",
    code: "FER-458-WH01",
    category: "Rolling Chassis",
    material: "Monoblock forged aluminum alloy",
    specs: "Front: 20\" x 8.5J | Rear: 20\" x 10.5J",
    weight: "9.8 kg front / 11.2 kg rear",
    engineeringNotes: "Precision balanced to withstand speeds exceeding 325 km/h, paired with custom Ferrari-homologated high-performance compounds."
  },
  wheel: {
    name: "Forged Alloy Wheel Hub Assembly",
    code: "FER-458-HB01",
    category: "Rolling Chassis",
    material: "Forged aluminum hub with ceramic low-friction bearings",
    specs: "Center-bearing runout tolerance: < 0.005 mm",
    weight: "4.2 kg per hub",
    engineeringNotes: "Precision CNC machined wheel hub carrying the titanium wheel studs and wheel-speed ABS sensors."
  },
  tire: {
    name: "Michelin Pilot Sport Cup 2 / Super Sport High-G Tires",
    code: "FER-458-TR01",
    category: "Running Gear",
    material: "Dual-compound synthetic elastomer with aramid/Kevlar belt",
    specs: "Front: 235/35 ZR20 (92Y) | Rear: 295/35 ZR20 (105Y)",
    weight: "10.4 kg front / 13.8 kg rear",
    engineeringNotes: "Co-developed with Michelin over two years of track testing at Fiorano. Features asymmetrical tread patterns yielding up to 1.33 G lateral cornering grip."
  },
  centre: {
    name: "Ferrari Yellow Cavallino Rampante Wheel Center Cap",
    code: "FER-458-CP01",
    category: "Wheel Detail",
    material: "Anodized aluminum with Giallo Modena embossed stallion",
    specs: "Diameter: 60 mm clip-in with O-ring seal",
    weight: "0.08 kg per cap",
    engineeringNotes: "The iconic yellow wheel center cap featuring the black rearing horse logo of Maranello."
  },
  nuts: {
    name: "Titanium High-Tensile Wheel Lug Nut Set",
    code: "FER-458-NT01",
    category: "Fasteners",
    material: "Grade 5 Ti-6Al-4V forged titanium",
    specs: "M14 x 1.5 thread | 19 mm hex head",
    weight: "0.85 kg total set (-1.4 kg vs steel nuts)",
    engineeringNotes: "Saves critical rotational unsprung mass at all 4 corners while offering ultimate corrosion resistance and high-torque tensile strength."
  },

  // 3. Brakes & Calipers
  brake: {
    name: "Brembo Carbon-Ceramic Matrix (CCM) Disc & Caliper",
    code: "FER-458-BR01",
    category: "Braking System",
    material: "Carbon-silicon carbide composite matrix with aluminum monobloc calipers",
    specs: "Front: 398 x 36 mm (6-piston) | Rear: 360 x 32 mm (4-piston)",
    weight: "-15 kg vs cast iron counterparts",
    engineeringNotes: "Equipped with the Ferrari Pre-Fill system: whenever throttle release is detected, the hydraulic module pre-tensions pads against the rotors, eliminating dead pedal travel and braking 100-0 km/h in 32.5 m."
  },
  brakes: {
    name: "Brembo Carbon-Ceramic Matrix (CCM) Braking System",
    code: "FER-458-BR00",
    category: "Braking System",
    material: "CCM composite rotors with monoblock aluminum calipers",
    specs: "Thermal resistance: up to 1,000°C without fade",
    weight: "Complete 4-corner CCM setup",
    engineeringNotes: "Integrated with ABS Evo software and E-Diff 3 to dynamically vector braking force during corner entry."
  },

  // 4. Powertrain & Mechanicals
  metal: {
    name: "Tipo F136 FB 4.5L 90° V8 Engine Assembly",
    code: "FER-458-EG01",
    category: "Powertrain",
    material: "Alusil aluminum cylinder block, Nikasil-coated bores, titanium connecting rods",
    specs: "570 CV @ 9,000 RPM | 540 N⋅m @ 6,000 RPM | 127 CV/Litre",
    weight: "172 kg dry engine mass",
    engineeringNotes: "Maranello's most celebrated naturally aspirated V8. Features a 180° flat-plane crankshaft, dry-sump lubrication with 4 scavenge pumps, 200 bar direct fuel injection (GDI), and variable valve timing on all 32 valves."
  },
  engine: {
    name: "Tipo F136 FB 4.5L 90° Naturally Aspirated V8",
    code: "FER-458-EG01",
    category: "Powertrain",
    material: "Gravity-cast aluminum cylinder block, Nikasil-coated liners, graphite pistons",
    specs: "570 CV @ 9,000 RPM | 540 N⋅m @ 6,000 RPM | 127 CV/Litre",
    weight: "172 kg",
    engineeringNotes: "180° flat-plane crankshaft firing characteristic. Redline at 9,000 RPM with equal-length exhaust headers producing the famous piercing Maranello high-frequency acoustic scream."
  },
  chrome: {
    name: "Triple Center Inconel/Titanium Exhaust Tips",
    code: "FER-458-EX01",
    category: "Exhaust & Emissions",
    material: "Hydroformed thin-wall Inconel / Stainless steel headers",
    specs: "Distinctive 3-pipe layout with dual pneumatic bypass valves",
    weight: "18.5 kg",
    engineeringNotes: "The iconic three center exit tips: the outer two pipes route through silencers for city driving, while the central pipe opens directly at high RPM or in RACE mode for the full 9,000 RPM symphony."
  },
  plastic_gray: {
    name: "Engine Bay Heat Shields & Underbody Venturi Ducts",
    code: "FER-458-UD01",
    category: "Aerodynamics & Thermal",
    material: "Reinforced thermal composite with aluminized heat reflective barrier",
    specs: "Directs underbody airflow into rear diffuser venturi tunnels",
    weight: "6.8 kg",
    engineeringNotes: "Shields the spaceframe and suspension linkages from exhaust header heat while generating flat-floor ground effect downforce."
  },

  // 5. Glazing & Glass
  glass: {
    name: "Solar-Reflective Windshield & Glass Engine Cover Bonnet",
    code: "FER-458-GL01",
    category: "Glazing & Cabin",
    material: "Tempered acoustic safety glass with UV and infrared rejection",
    specs: "Rear engine window showcases the red crackle-finish plenum chambers",
    weight: "12.3 kg total glass surfaces",
    engineeringNotes: "The transparent rear engine lid allows visual inspection of the mid-mounted Tipo F136 FB engine bay while incorporating venting slats to release hot air from the exhaust headers."
  },
  wipers: {
    name: "Aeroelastic Windshield Wiper Assembly",
    code: "FER-458-WP01",
    category: "Visibility",
    material: "Curved aerofoil frame with dual rubber blades and integrated washer jets",
    specs: "Aerodynamic downforce profile prevents blade lift above 250 km/h",
    weight: "1.2 kg",
    engineeringNotes: "Engineered with integrated aerofoils that press the wiper blades against the glass even at speeds exceeding 300 km/h."
  },

  // 6. Lighting & Optics
  lights: {
    name: "Bi-Xenon Headlights with Integrated Radiator Cooling Ducts",
    code: "FER-458-LT01",
    category: "Lighting & Aero",
    material: "Polycarbonate lenses with 20 high-luminosity LED modules per side",
    specs: "Integrated aero radiator cooling duct inside lamp cluster",
    weight: "3.2 kg per lamp assembly",
    engineeringNotes: "The striking vertical LED clusters incorporate air vents beneath the lens that direct fresh ambient air toward the front wheel arches and cooling radiators."
  },
  leds: {
    name: "Vertical Daytime Running Light (DRL) LED Arrays",
    code: "FER-458-LT03",
    category: "Lighting & Aero",
    material: "20 high-output Cree LEDs with internal heatsink channels",
    specs: "Dual-mode DRL / Dynamic Turn Indicator illumination",
    weight: "0.8 kg",
    engineeringNotes: "Supplies the unmistakable razor-sharp vertical light signature of the 458 Italia on the road."
  },
  lights_red: {
    name: "Iconic Circular Ferrari LED Taillights & Extractor Grilles",
    code: "FER-458-LT02",
    category: "Rear Lighting & Aero",
    material: "High-intensity circular red LED ring with heat extraction mesh",
    specs: "Circular lens design reminiscent of 288 GTO and Enzo",
    weight: "1.4 kg per unit",
    engineeringNotes: "The circular taillights project from rear aerodynamic air extraction vents that evacuate warm air generated by the rear engine bay and exhaust silencers."
  },

  // 7. Carbon Fiber Aerodynamics
  carbon_fibre: {
    name: "Autoclave Pre-Preg Carbon Fiber Rear Active Diffuser",
    code: "FER-458-CF01",
    category: "Composite Aerodynamics",
    material: "High-modulus carbon fiber weave cured in autoclave under 6 bar pressure",
    specs: "Rear active diffuser strakes and front aeroelastic winglets",
    weight: "4.8 kg complete diffuser",
    engineeringNotes: "Features three vertical aerodynamic strakes that accelerate underbody air, generating low-pressure suction to pull the rear axle down onto the track."
  },
  carbon_fibre_trim: {
    name: "Carbon Fiber Aerodynamic Front Whiskers & Side Splitters",
    code: "FER-458-CF02",
    category: "Composite Aerodynamics",
    material: "Aeroelastic composite pre-preg carbon fiber",
    specs: "Deflects up to -12 mm under 200+ km/h aerodynamic load",
    weight: "1.8 kg",
    engineeringNotes: "These flexible whiskers deflect at high speed to restrict airflow to the radiators and decrease frontal drag while balancing front axle downforce."
  },
  grills: {
    name: "Front Radiator Cooling Intakes & Mesh Aero Ducts",
    code: "FER-458-GR01",
    category: "Cooling & Aero",
    material: "Expanded aluminum honeycomb mesh with black anodized finish",
    specs: "Optimized 82% open area for maximum cooling airflow",
    weight: "1.6 kg",
    engineeringNotes: "Protects the twin front radiator heat exchangers from debris while minimizing aerodynamic turbulence."
  },

  // 8. Cockpit & F1 Controls
  steering_wheel: {
    name: "F1 Steering Wheel with Integrated Controls",
    code: "FER-458-ST01",
    category: "Cockpit Controls",
    material: "Carbon fiber upper and lower rim with hand-stitched perforated leather",
    specs: "Eliminates column stalks; integrates Manettino, Start Button & Shift LEDs",
    weight: "2.8 kg",
    engineeringNotes: "Direct Formula 1 ergonomics co-developed with Michael Schumacher. Puts 100% of primary vehicle control directly in the driver's hands."
  },
  steering_carbon: {
    name: "Carbon Fiber Steering Wheel Upper Arch",
    code: "FER-458-ST02",
    category: "Cockpit Controls",
    material: "High-gloss autoclave pre-preg carbon fiber",
    specs: "Houses the 5-LED sequential shift indicator array",
    weight: "0.45 kg",
    engineeringNotes: "Ergonomically shaped flat-top arch giving clear line of sight to the yellow center tachometer."
  },
  steering_red_lights: {
    name: "Sequential F1 Shift Indicator LEDs (5-LED System)",
    code: "FER-458-ST03",
    category: "Cockpit Telemetry",
    material: "High-intensity surface-mount LEDs (2 Green, 2 Red, 1 Blue)",
    specs: "Lights illuminate at 5,500 / 6,500 / 7,500 / 8,300 / 8,900 RPM",
    weight: "0.05 kg",
    engineeringNotes: "Allows the driver to time upshifts at 9,000 RPM using peripheral vision without looking away from the track."
  },
  steering_leather: {
    name: "Perforated Italian Leather Steering Rim Grips",
    code: "FER-458-ST04",
    category: "Interior Ergonomics",
    material: "Ultra-supple perforated Poltrona Frau Italian leather",
    specs: "Contoured thumb indents with anti-fatigue grip profile",
    weight: "0.3 kg",
    engineeringNotes: "Provides supreme tactile feedback and slip-free grip during high-G lateral cornering maneuvers."
  },
  steering_centre: {
    name: "Center Horn Boss & Cavallino Rampante Airbag Module",
    code: "FER-458-ST05",
    category: "Safety & Interior",
    material: "Cast magnesium core with Giallo Modena enameled stallion badge",
    specs: "Dual-stage pyrotechnic driver airbag deployment",
    weight: "1.1 kg",
    engineeringNotes: "Center hub featuring the historic yellow Ferrari emblem and dual-stage safety airbag."
  },
  steering_metal: {
    name: "Brushed Aluminum F1 Gearshift Paddle Assembly",
    code: "FER-458-ST06",
    category: "Transmission Controls",
    material: "Column-fixed CNC machined billet aluminum",
    specs: "Extended length (140 mm) for easy reach in tight cornering",
    weight: "0.35 kg per paddle",
    engineeringNotes: "Column-mounted so the driver always knows where the upshift (right) and downshift (left) paddles are regardless of steering angle."
  },
  steering_trim: {
    name: "Integrated Manettino Dial & Engine Start Button Housing",
    code: "FER-458-ST07",
    category: "Cockpit Controls",
    material: "Billet anodized aluminum rotary switch with knurled grip",
    specs: "5 Positions: WET, SPORT, RACE, CT OFF, CST OFF",
    weight: "0.2 kg",
    engineeringNotes: "Controls the electronic differential (E-Diff 3), F1-Trac traction control, gearbox shift speed, and exhaust bypass valves with a twist of the dial."
  },
  steering_column: {
    name: "Adjustable Carbon Steering Column & Instrument Shroud",
    code: "FER-458-ST08",
    category: "Cockpit Architecture",
    material: "Extruded aluminum with carbon fiber outer cowl",
    specs: "Power tilt and telescopic adjustment with memory preset",
    weight: "4.6 kg",
    engineeringNotes: "Rigid steering column delivering razor-sharp 11.9:1 steering ratio with just 2.0 turns lock-to-lock."
  },
  blue: {
    name: "Driver Instrument Binnacle (Dual High-Res TFT Displays)",
    code: "FER-458-IC01",
    category: "Cockpit Electronics",
    material: "Twin 5-inch backlit TFT screens framing the central analog dial",
    specs: "Left: Vehicle Dynamics & VDA Assistance | Right: Telemetry & Infotainment",
    weight: "1.8 kg",
    engineeringNotes: "Displays real-time tire temperatures, brake rotor heat dissipation, SCM2 damper status, and trip metrics."
  },
  leather: {
    name: "Poltrona Frau Hand-Stitched Leather Racing Bucket Seats",
    code: "FER-458-ST99",
    category: "Interior Cabin",
    material: "Semi-aniline full grain Italian leather with contrast stitching",
    specs: "High-bolster lateral support with embossed Cavallino headrests",
    weight: "18.2 kg per seat",
    engineeringNotes: "Hand-crafted by master upholsterers in Maranello to provide lateral support under 1.33 G cornering loads."
  },
  interior_dark: {
    name: "Carbon Fiber Driver Zone Cockpit Trim",
    code: "FER-458-IN01",
    category: "Interior Cabin",
    material: "Pre-preg autoclave carbon fiber dash inlays and center bridge",
    specs: "High-gloss UV clearcoat finish with Rosso contrast vents",
    weight: "2.4 kg",
    engineeringNotes: "Surrounds the driver in lightweight motorsport carbon fiber, eliminating plastic trim pieces."
  },
  interior_light: {
    name: "Ambient Cockpit Courtesy Illumination System",
    code: "FER-458-IN02",
    category: "Interior Lighting",
    material: "Subtle warm-white LED footwell and console accent modules",
    specs: "Integrated with central locking and door entry sensors",
    weight: "0.3 kg",
    engineeringNotes: "Discreetly illuminates the cabin floorboards and carbon fiber door sills upon entry."
  },
  carpet: {
    name: "Ultra-Lightweight Sound-Insulating Floor Carpet",
    code: "FER-458-CP99",
    category: "Interior Cabin",
    material: "Dense tufted nylon carpet with lightweight acoustic damping layer",
    specs: "Embroidered 458 Italia floor mats with aluminum floor kick-plates",
    weight: "3.8 kg complete set",
    engineeringNotes: "Dampens road vibrations while allowing the mechanical music of the 9,000 RPM V8 to resonate inside the cockpit."
  }
};

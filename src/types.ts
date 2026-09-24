/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CarSpecification {
  category: string;
  items: {
    label: string;
    value: string;
    detail?: string;
  }[];
}

export interface Hotspot {
  id: string;
  label: string;
  shortDesc: string;
  detailedDesc: string;
  // Relative WebGL coordinates on our stylized 3D model
  position: [number, number, number];
  specKey: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "exterior" | "interior" | "engineering" | "track";
  src: string;
  alt: string;
}

export interface TechFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  specs: { label: string; value: string }[];
}

export interface ConfigOptions {
  paintColors: { name: string; hex: string; price: number }[];
  interiorStyles: { name: string; material: string; hex: string; price: number }[];
  wheelOptions: { name: string; text: string; price: number }[];
  caliperColors: { name: string; hex: string; price: number }[];
}

export interface BuildState {
  paint: string; // color name
  interior: string; // interior theme name
  wheel: string; // wheel design name
  calipers: string; // caliper color
}

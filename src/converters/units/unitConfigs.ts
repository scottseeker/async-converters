import type { UnitConverterConfig } from '../../types';

export const lengthConfig: UnitConverterConfig = {
  title: 'Length Converter',
  description: 'Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.',
  units: [
    { id: 'mm',  label: 'Millimeters (mm)',  toBase: v => v / 1000,        fromBase: v => v * 1000 },
    { id: 'cm',  label: 'Centimeters (cm)',  toBase: v => v / 100,         fromBase: v => v * 100 },
    { id: 'm',   label: 'Meters (m)',        toBase: v => v,               fromBase: v => v },
    { id: 'km',  label: 'Kilometers (km)',   toBase: v => v * 1000,        fromBase: v => v / 1000 },
    { id: 'in',  label: 'Inches (in)',       toBase: v => v * 0.0254,      fromBase: v => v / 0.0254 },
    { id: 'ft',  label: 'Feet (ft)',         toBase: v => v * 0.3048,      fromBase: v => v / 0.3048 },
    { id: 'yd',  label: 'Yards (yd)',        toBase: v => v * 0.9144,      fromBase: v => v / 0.9144 },
    { id: 'mi',  label: 'Miles (mi)',        toBase: v => v * 1609.344,    fromBase: v => v / 1609.344 },
    { id: 'nmi', label: 'Nautical Miles',   toBase: v => v * 1852,        fromBase: v => v / 1852 },
  ],
};

export const weightConfig: UnitConverterConfig = {
  title: 'Weight & Mass Converter',
  description: 'Convert between milligrams, grams, kilograms, pounds, ounces, and more.',
  units: [
    { id: 'mg',  label: 'Milligrams (mg)',   toBase: v => v / 1_000_000,   fromBase: v => v * 1_000_000 },
    { id: 'g',   label: 'Grams (g)',         toBase: v => v / 1000,        fromBase: v => v * 1000 },
    { id: 'kg',  label: 'Kilograms (kg)',    toBase: v => v,               fromBase: v => v },
    { id: 't',   label: 'Metric Ton (t)',    toBase: v => v * 1000,        fromBase: v => v / 1000 },
    { id: 'lb',  label: 'Pounds (lb)',       toBase: v => v * 0.453592,    fromBase: v => v / 0.453592 },
    { id: 'oz',  label: 'Ounces (oz)',       toBase: v => v * 0.0283495,   fromBase: v => v / 0.0283495 },
    { id: 'st',  label: 'Stone (st)',        toBase: v => v * 6.35029,     fromBase: v => v / 6.35029 },
  ],
};

export const temperatureConfig: UnitConverterConfig = {
  title: 'Temperature Converter',
  description: 'Convert between Celsius, Fahrenheit, and Kelvin.',
  units: [
    { id: 'c', label: 'Celsius (°C)',    toBase: v => v,              fromBase: v => v },
    { id: 'f', label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    { id: 'k', label: 'Kelvin (K)',      toBase: v => v - 273.15,     fromBase: v => v + 273.15 },
  ],
};

export const areaConfig: UnitConverterConfig = {
  title: 'Area Converter',
  description: 'Convert between square meters, kilometers, feet, acres, hectares, and more.',
  units: [
    { id: 'mm2',  label: 'mm²',              toBase: v => v / 1_000_000,     fromBase: v => v * 1_000_000 },
    { id: 'cm2',  label: 'cm²',              toBase: v => v / 10_000,        fromBase: v => v * 10_000 },
    { id: 'm2',   label: 'm²',               toBase: v => v,                 fromBase: v => v },
    { id: 'km2',  label: 'km²',              toBase: v => v * 1_000_000,     fromBase: v => v / 1_000_000 },
    { id: 'in2',  label: 'in²',              toBase: v => v * 0.00064516,    fromBase: v => v / 0.00064516 },
    { id: 'ft2',  label: 'ft²',              toBase: v => v * 0.092903,      fromBase: v => v / 0.092903 },
    { id: 'yd2',  label: 'yd²',              toBase: v => v * 0.836127,      fromBase: v => v / 0.836127 },
    { id: 'acre', label: 'Acres',            toBase: v => v * 4046.86,       fromBase: v => v / 4046.86 },
    { id: 'ha',   label: 'Hectares (ha)',    toBase: v => v * 10_000,        fromBase: v => v / 10_000 },
  ],
};

export const volumeConfig: UnitConverterConfig = {
  title: 'Volume Converter',
  description: 'Convert between milliliters, liters, fluid ounces, cups, pints, quarts, and gallons.',
  units: [
    { id: 'ml',     label: 'Milliliters (ml)', toBase: v => v,           fromBase: v => v },
    { id: 'l',      label: 'Liters (L)',        toBase: v => v * 1000,    fromBase: v => v / 1000 },
    { id: 'tsp',    label: 'Teaspoons (tsp)',   toBase: v => v * 4.92892, fromBase: v => v / 4.92892 },
    { id: 'tbsp',   label: 'Tablespoons',       toBase: v => v * 14.7868, fromBase: v => v / 14.7868 },
    { id: 'floz',   label: 'Fl. Oz (US)',       toBase: v => v * 29.5735, fromBase: v => v / 29.5735 },
    { id: 'cup',    label: 'Cups (US)',         toBase: v => v * 236.588, fromBase: v => v / 236.588 },
    { id: 'pt',     label: 'Pints (US)',        toBase: v => v * 473.176, fromBase: v => v / 473.176 },
    { id: 'qt',     label: 'Quarts (US)',       toBase: v => v * 946.353, fromBase: v => v / 946.353 },
    { id: 'gal',    label: 'Gallons (US)',      toBase: v => v * 3785.41, fromBase: v => v / 3785.41 },
    { id: 'gal_uk', label: 'Gallons (UK)',      toBase: v => v * 4546.09, fromBase: v => v / 4546.09 },
  ],
};

export const speedConfig: UnitConverterConfig = {
  title: 'Speed Converter',
  description: 'Convert between mph, km/h, m/s, ft/s, and knots.',
  units: [
    { id: 'ms',  label: 'm/s',   toBase: v => v,          fromBase: v => v },
    { id: 'kmh', label: 'km/h',  toBase: v => v / 3.6,    fromBase: v => v * 3.6 },
    { id: 'mph', label: 'mph',   toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { id: 'fts', label: 'ft/s',  toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { id: 'kn',  label: 'Knots', toBase: v => v * 0.51444, fromBase: v => v / 0.51444 },
  ],
};

export const dataStorageConfig: UnitConverterConfig = {
  title: 'Data Storage Converter',
  description: 'Convert between bits, bytes, KB, MB, GB, TB, and PB.',
  units: [
    { id: 'bit', label: 'Bits',       toBase: v => v,                 fromBase: v => v },
    { id: 'B',   label: 'Bytes',      toBase: v => v * 8,             fromBase: v => v / 8 },
    { id: 'KB',  label: 'Kilobytes',  toBase: v => v * 8 * 1024,      fromBase: v => v / (8 * 1024) },
    { id: 'MB',  label: 'Megabytes',  toBase: v => v * 8 * 1024**2,   fromBase: v => v / (8 * 1024**2) },
    { id: 'GB',  label: 'Gigabytes',  toBase: v => v * 8 * 1024**3,   fromBase: v => v / (8 * 1024**3) },
    { id: 'TB',  label: 'Terabytes',  toBase: v => v * 8 * 1024**4,   fromBase: v => v / (8 * 1024**4) },
    { id: 'PB',  label: 'Petabytes',  toBase: v => v * 8 * 1024**5,   fromBase: v => v / (8 * 1024**5) },
    { id: 'Kib', label: 'Kibibytes',  toBase: v => v * 8 * 1024,      fromBase: v => v / (8 * 1024) },
    { id: 'Mib', label: 'Mebibytes',  toBase: v => v * 8 * 1024**2,   fromBase: v => v / (8 * 1024**2) },
    { id: 'Gib', label: 'Gibibytes',  toBase: v => v * 8 * 1024**3,   fromBase: v => v / (8 * 1024**3) },
  ],
};

export type Category =
  | 'units'
  | 'time'
  | 'numbers'
  | 'text'
  | 'color'
  | 'finance'
  | 'developer'
  | 'image'
  | 'social'
  | 'gaming'
  | 'student'
  | 'random';

export interface ConverterMeta {
  slug: string;
  name: string;
  description: string;
  category: Category;
  path: string;
  keywords: string[];
}

export interface UnitDef {
  id: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export interface UnitConverterConfig {
  title: string;
  description: string;
  units: UnitDef[];
}

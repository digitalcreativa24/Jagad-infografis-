/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InfographicFormData {
  tema: string;
  tujuan: string;
  audiens: string;
  tone: string;
  bahasa: string;
  rasio: string;
  customWidthCm?: string;
  customHeightCm?: string;
  gayaDesain: string;
  warnaDominan: string;
  styleIcon: string;
  elemenVisual: string[];
  layout: string;
  poin: string;
  namaBrand: string;
  tagline: string;
  sosmed: string;
  whatsapp: string;
  logoStyle: string;
  levelDetail: string;
  formatOutput: string;
}

export const OPTIONS = {
  tujuan: ['Edukasi', 'Promosi', 'Storytelling', 'Statistik', 'Tutorial', 'Checklist', 'Timeline', 'Perbandingan', 'Lainnya'],
  audiens: ['Anak-anak', 'Remaja', 'Dewasa', 'Profesional', 'Umum', 'Lainnya'],
  tone: ['Edukatif', 'Profesional', 'Friendly', 'Persuasif', 'Santai', 'Islami', 'Formal', 'Custom'],
  bahasa: ['Indonesia', 'Inggris', 'Arab', 'China', 'Jepang', 'Rusia', 'Melayu', 'Lainnya'],
  rasio: ['1:1 (Square)', '3:4 (Portrait)', '4:5 (Instagram)', '9:16 (Story/Reels)', '16:9 (Widescreen)', 'A4 Vertikal', 'A4 Horisontal', 'Hero website 1920 x 1080 px', 'A3+ Horisontal', 'A3+ Vertikal', 'Custom (Banner/Spanduk cm, 300 DPI)'],
  gayaDesain: ['Modern', 'Minimalis', 'Flat', 'Corporate', 'Neon', 'Futuristik', 'Pastel', 'Bold', 'Clean', 'Vintage', 'Kartun', 'Komik', 'Manga / Anime', 'Pop Art', 'Doodle'],
  styleIcon: ['Outline (Garis)', 'Line Art', 'Flat 2D', '3D Rendered', 'Gradient', 'Filled (Solid)', 'Minimalist'],
  layout: ['Vertikal Panjang (Standart)', 'Square', 'Carousel (Slide by Slide)', 'Timeline', 'Grid', 'Step by step', 'Comparison (Perbandingan)', 'Custom'],
  poin: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  levelDetail: ['Sangat Detail', 'Sedang', 'Biasa'],
  formatOutput: ['Text (Deskripsi)', 'JSON Format', 'Bullet Points']
};

export const VISUAL_ELEMENTS = [
  'Icon', 'Illustration', 'Chart', 'Graph', 'Emoji', 'Abstract Shape', 'Pattern Background',
  '3D Claymorphic Illustration', 'Isometric Flowchart Grid', 'Glassmorphism Information Card',
  'Neon Soft Glow Effect', 'Vector Line Art Accents', 'Fluid Gradient Shapes', 'Minimalist Tech Icons',
  'Aesthetic Paper Texture Background', 'Futuristik Cyberpunk UI HUD', 'Brutalist Typography Accents',
  'Clean Round Progress Rings'
];

export const INITIAL_STATE: InfographicFormData = {
  tema: '',
  tujuan: 'Edukasi',
  audiens: 'Umum',
  tone: 'Edukatif',
  bahasa: 'Indonesia',
  rasio: '4:5 (Instagram)',
  customWidthCm: '',
  customHeightCm: '',
  gayaDesain: 'Modern',
  warnaDominan: '',
  styleIcon: 'Flat 2D',
  elemenVisual: [],
  layout: 'Vertikal Panjang (Standart)',
  poin: '5',
  namaBrand: '',
  tagline: '',
  sosmed: '',
  whatsapp: '',
  logoStyle: '',
  levelDetail: 'Sangat Detail',
  formatOutput: 'Text (Deskripsi)'
};

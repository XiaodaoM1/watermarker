
export interface WatermarkSettings {
  type: 'text' | 'image';
  text: string;
  image: string | null; // Data URL of the uploaded watermark image
  imageScale: number; // Scale factor 1-100 (percentage of main image width)
  color: string;
  opacity: number; // 0 to 1
  fontSize: number; // Scale factor 1-100 (percentage of image width)
  rotation: number; // -180 to 180
  isTiled: boolean;
  position: 'tl' | 'tc' | 'tr' | 'cl' | 'cc' | 'cr' | 'bl' | 'bc' | 'br';
  gap: number; // 0 to 100
}

export const DEFAULT_SETTINGS: WatermarkSettings = {
  type: 'text',
  text: '© Watermark',
  image: null,
  imageScale: 15,
  color: '#ffffff',
  opacity: 0.8,
  fontSize: 5,
  rotation: 0,
  isTiled: false,
  position: 'br',
  gap: 20,
};

export const POSITIONS = [
  { id: 'tl', label: 'Top Left' },
  { id: 'tc', label: 'Top Center' },
  { id: 'tr', label: 'Top Right' },
  { id: 'cl', label: 'Center Left' },
  { id: 'cc', label: 'Center' },
  { id: 'cr', label: 'Center Right' },
  { id: 'bl', label: 'Bottom Left' },
  { id: 'bc', label: 'Bottom Center' },
  { id: 'br', label: 'Bottom Right' },
] as const;

export type PositionType = typeof POSITIONS[number]['id'];

export interface SuggestionResponse {
  suggestions: string[];
}

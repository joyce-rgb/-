
export interface IDImageData {
  original: string;
  watermarked: string;
  name: string;
}

export interface WatermarkConfig {
  text: string;
  fontSize: number;
  opacity: number;
  color: string;
  angle: number;
  density: number; // 0 to 1
}

export enum Side {
  FRONT = '正面',
  BACK = '反面'
}

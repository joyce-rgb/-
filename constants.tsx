
import { WatermarkConfig } from './types';

export const DEFAULT_WATERMARK_TEXT = "僅供公司設立及變更登記使用";

export const DEFAULT_CONFIG: WatermarkConfig = {
  text: DEFAULT_WATERMARK_TEXT,
  fontSize: 24,
  opacity: 0.2,
  color: "#FF0000",
  angle: -30,
  density: 0
};

export const UI_COLORS = {
  primary: "blue-600",
  secondary: "slate-600",
  accent: "indigo-500",
  success: "emerald-500",
  danger: "rose-500"
};

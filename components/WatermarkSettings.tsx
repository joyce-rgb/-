
import React from 'react';
import { WatermarkConfig } from '../types';

interface WatermarkSettingsProps {
  config: WatermarkConfig;
  onChange: (config: WatermarkConfig) => void;
}

const PRESET_TEXTS = [
  "僅供公司設立使用",
  "僅供公司變更登記使用",
  "僅供公司設立及變更登記專用",
  "僅供銀行開戶使用",
  "僅供電信申辦使用",
  "僅供房屋租賃簽約使用"
];

const WatermarkSettings: React.FC<WatermarkSettingsProps> = ({ config, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...config,
      [name]: name === 'text' ? value : parseFloat(value)
    });
  };

  const handlePresetClick = (text: string) => {
    onChange({
      ...config,
      text: text
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          浮水印設定
        </h3>
        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold border border-emerald-100">100% 離線處理</span>
      </div>
      
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">自訂浮水印文字</label>
        <textarea 
          name="text"
          value={config.text}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium resize-none shadow-inner"
          rows={2}
          placeholder="請輸入浮水印文字..."
        />
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TEXTS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`text-[10px] px-2.5 py-1.5 rounded-md transition-all border ${
                config.text === preset 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">透明度</label>
            <span className="text-xs text-slate-400 font-mono">{Math.round(config.opacity * 100)}%</span>
          </div>
          <input 
            type="range" 
            name="opacity"
            min="0.05" max="0.8" step="0.05"
            value={config.opacity}
            onChange={handleChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">字體大小</label>
            <span className="text-xs text-slate-400 font-mono">{config.fontSize}px</span>
          </div>
          <input 
            type="range" 
            name="fontSize"
            min="12" max="80" step="2"
            value={config.fontSize}
            onChange={handleChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">旋轉角度</label>
            <span className="text-xs text-slate-400 font-mono">{config.angle}°</span>
          </div>
          <input 
            type="range" 
            name="angle"
            min="-90" max="90" step="5"
            value={config.angle}
            onChange={handleChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="
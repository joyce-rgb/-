
import React from 'react';
import { WatermarkConfig } from '../types';

interface WatermarkSettingsProps {
  config: WatermarkConfig;
  onChange: (config: WatermarkConfig) => void;
}

const PRESET_TEXTS = [
  "僅供公司設立使用",
  "僅供公司變更登記使用",
  "僅供公司設立及變更登記使用",
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
      <h3 className="font-bold text-slate-800 flex iems-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        浮水印設定
      </h3>
      
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">浮水印文字</label>
        <textarea 
          name="text"
          value={config.text}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
          rows={2}
          placeholder="請輸入浮水印文字..."
        />
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TEXTS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`text-[10px] px-2 py-1 rounded-md transition-colors border ${
                config.text === preset 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">透明度 ({Math.round(config.opacity * 100)}%)</label>
          <input 
            type="range" 
            name="opacity"
            min="0" max="0.9" step="0.05"
            value={config.opacity}
            onChange={handleChange}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">字體大小</label>
          <input 
            type="range" 
            name="fontSize"
            min="12" max="64" step="2"
            value={config.fontSize}
            onChange={handleChange}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">角度</label>
          <input 
            type="range" 
            name="angle"
            min="-90" max="90" step="5"
            value={config.angle}
            onChange={handleChange}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">密度 ({Math.round(config.density * 100)}%)</label>
          <input 
            type="range" 
            name="density"
            min="0" max="0.9" step="0.05"
            value={config.density}
            onChange={handleChange}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
      
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">目前顏色: </span>
        <div className="flex gap-2">
          {['#FF0000', '#000000', '#0000FF', '#666666'].map(color => (
            <button
              key={color}
              onClick={() => onChange({...config, color})}
              className={`w-6 h-6 rounded-full border-2 ${config.color === color ? 'border-blue-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatermarkSettings;

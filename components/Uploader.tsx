
import React, { useRef } from 'react';
import { Side } from '../types';

interface UploaderProps {
  side: Side;
  image: string | null;
  onUpload: (dataUrl: string) => void;
  onClear: () => void;
}

const Uploader: React.FC<UploaderProps> = ({ side, image, onUpload, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">身分證 {side}</label>
        {image && (
          <button 
            onClick={onClear}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
          >
            清除重新上傳
          </button>
        )}
      </div>
      
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[1.58/1] rounded-xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center p-6 group"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 font-medium">點擊或拖放檔案上傳</p>
          <p className="text-xs text-slate-400 mt-1">支援 PNG, JPG</p>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="aspect-[1.58/1] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
          <img src={image} alt={`ID ${side}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:bg-blue-50"
             >
               更換照片
             </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default Uploader;

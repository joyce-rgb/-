
import React, { useState, useEffect } from 'react';
import { Side, WatermarkConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import { applyWatermark, downloadImage } from './utils/imageUtils';
import Uploader from './components/Uploader';
import WatermarkSettings from './components/WatermarkSettings';

const App: React.FC = () => {
  const [frontOriginal, setFrontOriginal] = useState<string | null>(null);
  const [backOriginal, setBackOriginal] = useState<string | null>(null);
  const [frontWatermarked, setFrontWatermarked] = useState<string | null>(null);
  const [backWatermarked, setBackWatermarked] = useState<string | null>(null);
  const [config, setConfig] = useState<WatermarkConfig>(DEFAULT_CONFIG);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (frontOriginal) {
      setIsProcessing(true);
      applyWatermark(frontOriginal, config)
        .then(setFrontWatermarked)
        .catch(console.error)
        .finally(() => setIsProcessing(false));
    } else {
      setFrontWatermarked(null);
    }
  }, [frontOriginal, config]);

  useEffect(() => {
    if (backOriginal) {
      setIsProcessing(true);
      applyWatermark(backOriginal, config)
        .then(setBackWatermarked)
        .catch(console.error)
        .finally(() => setIsProcessing(false));
    } else {
      setBackWatermarked(null);
    }
  }, [backOriginal, config]);

  const handleDownloadAll = () => {
    if (frontWatermarked) downloadImage(frontWatermarked, '身分證正面_已加浮水印.png');
    if (backWatermarked) downloadImage(backWatermarked, '身分證反面_已加浮水印.png');
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">證件安全浮水印</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              純本地處理
            </span>
            <button 
              disabled={!frontWatermarked && !backWatermarked}
              onClick={handleDownloadAll}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2"
            >
              下載全部照片
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">上傳證件正反面</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Uploader side={Side.FRONT} image={frontOriginal} onUpload={setFrontOriginal} onClear={() => setFrontOriginal(null)} />
                <Uploader side={Side.BACK} image={backOriginal} onUpload={setBackOriginal} onClear={() => setBackOriginal(null)} />
              </div>
            </div>

            {(frontWatermarked || backWatermarked) && (
              <div className="bg-slate-900 p-8 rounded-2xl shadow-xl relative">
                <h2 className="text-lg font-bold text-white mb-6">即時處理結果預覽</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {frontWatermarked && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><span className="text-sm text-slate-400">正面</span></div>
                      <div className="rounded-lg overflow-hidden border border-slate-700 bg-black"><img src={frontWatermarked} className="w-full" /></div>
                    </div>
                  )}
                  {backWatermarked && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><span className="text-sm text-slate-400">反面</span></div>
                      <div className="rounded-lg overflow-hidden border border-slate-700 bg-black"><img src={backWatermarked} className="w-full" /></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <WatermarkSettings config={config} onChange={setConfig} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

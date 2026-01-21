
import React, { useState, useEffect, useCallback } from 'react';
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

  // Auto-process front image when original or config changes
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

  // Auto-process back image when original or config changes
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
      {/* Header */}
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
              純本地瀏覽器處理 (隱私安全)
            </span>
            <button 
              disabled={!frontWatermarked && !backWatermarked}
              onClick={handleDownloadAll}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下載全部照片
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Uploaders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                上傳證件正反面
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Uploader 
                  side={Side.FRONT} 
                  image={frontOriginal} 
                  onUpload={setFrontOriginal}
                  onClear={() => setFrontOriginal(null)}
                />
                <Uploader 
                  side={Side.BACK} 
                  image={backOriginal} 
                  onUpload={setBackOriginal}
                  onClear={() => setBackOriginal(null)}
                />
              </div>

              {(!frontOriginal && !backOriginal) && (
                <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-amber-700">
                    <strong>使用提示：</strong> 
                    <p className="mt-1">上傳照片後系統會自動套用浮水印。您可以透過右側控制面板調整文字、顏色、透明度與排列密度，確保重要資訊仍可辨識。</p>
                  </div>
                </div>
              )}
            </div>

            {/* Previews */}
            {(frontWatermarked || backWatermarked) && (
              <div className="bg-slate-900 p-8 rounded-2xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/>
                  </svg>
                </div>
                
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
                  即時處理結果預覽
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {frontWatermarked && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-medium text-slate-400">證件 正面</span>
                        <button 
                          onClick={() => downloadImage(frontWatermarked, '身分證正面_已加浮水印.png')}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
                        >
                          下載正面
                        </button>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-700 shadow-2xl bg-black">
                        <img src={frontWatermarked} alt="正面預覽" className="w-full" />
                      </div>
                    </div>
                  )}
                  {backWatermarked && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-medium text-slate-400">證件 反面</span>
                        <button 
                          onClick={() => downloadImage(backWatermarked, '身分證反面_已加浮水印.png')}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
                        >
                          下載反面
                        </button>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-700 shadow-2xl bg-black">
                        <img src={backWatermarked} alt="反面預覽" className="w-full" />
                      </div>
                    </div>
                  )}
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white text-sm font-medium">浮水印生成中...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            <WatermarkSettings config={config} onChange={setConfig} />
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
              <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wide">隱私與安全機制</h3>
              <ul className="text-xs text-blue-700/80 space-y-3">
                <li className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>100% 離線處理：</strong> 您的照片僅在瀏覽器內處理，絕不經由網路傳輸至伺服器。</span>
                </li>
                <li className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>不留存紀錄：</strong> 當您關閉視窗，所有資料將隨即消失，保障資訊安全。</span>
                </li>
                <li className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>法律建議：</strong> 加註浮水印時請注意文字避開姓名、字號與照片，避免影響審核流程。</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-20 text-center text-slate-400 text-xs">
        <p>© 2024 證件安全浮水印 - 保護您的個資安全</p>
      </footer>
    </div>
  );
};

export default App;

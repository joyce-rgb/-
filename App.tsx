
import React, { useState, useEffect } from 'react';
import { Side, WatermarkConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import { applyWatermark, downloadImage, generatePDF } from './utils/imageUtils';
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

  const handleDownloadImages = () => {
    if (frontWatermarked) downloadImage(frontWatermarked, '身分證正面_已加浮水印.png');
    if (backWatermarked) downloadImage(backWatermarked, '身分證反面_已加浮水印.png');
  };

  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    try {
      await generatePDF([frontWatermarked, backWatermarked], '身分證影本_已加浮水印.pdf');
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAnyImage = frontWatermarked || backWatermarked;
  const hasBothImages = frontWatermarked && backWatermarked;

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
          <div className="flex items-center gap-3">
            <button 
              disabled={!hasAnyImage || isProcessing}
              onClick={handleDownloadImages}
              className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              下載圖片檔
            </button>
            <button 
              disabled={!hasAnyImage || isProcessing}
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {hasBothImages ? '合併匯出 PDF' : '匯出 PDF'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                上傳證件正反面
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Uploader side={Side.FRONT} image={frontOriginal} onUpload={setFrontOriginal} onClear={() => setFrontOriginal(null)} />
                <Uploader side={Side.BACK} image={backOriginal} onUpload={setBackOriginal} onClear={() => setBackOriginal(null)} />
              </div>
            </div>

            {(frontWatermarked || backWatermarked) && (
              <div className="bg-slate-900 p-8 rounded-2xl shadow-xl relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
                    即時處理結果預覽
                  </h2>
                  <span className="text-xs text-slate-400">PDF 匯出將自動合併以下預覽圖</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {frontWatermarked && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-medium text-slate-400">正面預覽</span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-700 bg-black shadow-2xl">
                        <img src={frontWatermarked} alt="正面" className="w-full" />
                      </div>
                    </div>
                  )}
                  {backWatermarked && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-medium text-slate-400">反面預覽</span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-700 bg-black shadow-2xl">
                        <img src={backWatermarked} alt="反面" className="w-full" />
                      </div>
                    </div>
                  )}
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white text-sm font-medium">處理中...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <WatermarkSettings config={config} onChange={setConfig} />
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
              <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wide">隱私安全說明</h3>
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
                  <span><strong>PDF 合併功能：</strong> 點擊「匯出 PDF」可將正反面影像合併為單一文件。</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

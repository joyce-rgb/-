
import { WatermarkConfig } from '../types';
import { jsPDF } from 'jspdf';

export const applyWatermark = (
  imageSrc: string,
  config: WatermarkConfig
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Set watermark styles
      const scaledFontSize = Math.max(12, (img.width / 800) * config.fontSize);
      ctx.font = `${scaledFontSize}px sans-serif`;
      ctx.fillStyle = config.color;
      ctx.globalAlpha = config.opacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const angleRad = (config.angle * Math.PI) / 180;
      
      // Calculate tiling grid
      const stepX = scaledFontSize * 10 * (1 - config.density + 0.1);
      const stepY = scaledFontSize * 4 * (1 - config.density + 0.1);

      // Save context state
      ctx.save();
      
      // Draw repeated pattern
      for (let x = -img.width; x < img.width * 2; x += stepX) {
        for (let y = -img.height; y < img.height * 2; y += stepY) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angleRad);
          ctx.fillText(config.text, 0, 0);
          ctx.restore();
        }
      }

      ctx.restore();
      resolve(canvas.toDataURL('image/png', 0.9));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePDF = async (images: (string | null)[], filename: string) => {
  const validImages = images.filter((img): img is string => img !== null);
  if (validImages.length === 0) return;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const availableWidth = pageWidth - (margin * 2);
  
  for (let i = 0; i < validImages.length; i++) {
    const imgData = validImages[i];
    
    // Load image to get its dimensions
    const img = await new Promise<HTMLImageElement>((resolve) => {
      const el = new Image();
      el.src = imgData;
      el.onload = () => resolve(el);
    });

    const imgAspectRatio = img.height / img.width;
    const drawWidth = availableWidth;
    const drawHeight = drawWidth * imgAspectRatio;

    // Calculate Y position - stack images with a small gap
    const yPos = margin + (i * (drawHeight + 10));

    // If second image would go off page, normally we'd add a page, 
    // but for ID card front/back on A4, they should fit.
    if (yPos + drawHeight > pageHeight && i > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, margin, drawWidth, drawHeight);
    } else {
      pdf.addImage(imgData, 'PNG', margin, yPos, drawWidth, drawHeight);
    }
  }

  pdf.save(filename);
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import { WatermarkSettings, DEFAULT_SETTINGS } from './types';
import { generateWatermarkSuggestions } from './services/geminiService';
import { Upload, Download, Image as ImageIcon, AlertCircle } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_SETTINGS);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Image
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setSuggestions([]); // Clear previous suggestions
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Drawing Logic
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset Canvas
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Image
    ctx.drawImage(image, 0, 0);

    // Watermark Configuration
    const fontSizePx = (image.width * settings.fontSize) / 100;
    ctx.font = `bold ${fontSizePx}px Inter, sans-serif`;
    ctx.fillStyle = settings.color;
    ctx.globalAlpha = settings.opacity;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    if (settings.isTiled) {
      // Tiled Pattern
      const textMetrics = ctx.measureText(settings.text);
      const textW = textMetrics.width;
      
      // Calculate spacing based on gap setting
      // Base spacing is text width/height + some padding
      const spacingX = textW + (image.width * settings.gap / 200) + fontSizePx;
      const spacingY = fontSizePx * 3 + (image.width * settings.gap / 200);

      // Rotation Setup
      const angleRad = (settings.rotation * Math.PI) / 180;
      
      // Create a grid larger than the canvas to cover rotation edges
      // Use a large constant buffer to ensure coverage
      const diag = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
      
      for (let y = -diag; y < diag * 2; y += spacingY) {
        for (let x = -diag; x < diag * 2; x += spacingX) {
          ctx.save();
          // Brick offset for even rows
          const rowOffset = (Math.floor(y / spacingY) % 2) * (spacingX / 2);
          
          ctx.translate(x + rowOffset, y);
          ctx.rotate(angleRad);
          ctx.fillText(settings.text, 0, 0);
          ctx.restore();
        }
      }
    } else {
      // Single Position
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      const padding = Math.max(20, image.width * 0.05);

      // Horizontal
      if (settings.position.endsWith('l')) {
        x = padding;
        ctx.textAlign = 'left';
      } else if (settings.position.endsWith('r')) {
        x = canvas.width - padding;
        ctx.textAlign = 'right';
      }

      // Vertical
      if (settings.position.startsWith('t')) {
        y = padding;
        ctx.textBaseline = 'top';
      } else if (settings.position.startsWith('b')) {
        y = canvas.height - padding;
        ctx.textBaseline = 'bottom';
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((settings.rotation * Math.PI) / 180);
      ctx.fillText(settings.text, 0, 0);
      ctx.restore();
    }
  }, [image, settings]);

  useEffect(() => {
    if (image) {
      requestAnimationFrame(draw);
    }
  }, [draw, image]);

  // Actions
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `watermarked-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleGenerateAI = async () => {
    if (!image) return;
    setIsGenerating(true);
    
    // Create a small version for API to save bandwidth/speed
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    const scale = Math.min(512 / image.width, 1);
    tempCanvas.width = image.width * scale;
    tempCanvas.height = image.height * scale;
    ctx?.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
    
    const base64 = tempCanvas.toDataURL('image/jpeg', 0.7);
    const results = await generateWatermarkSuggestions(base64);
    
    setSuggestions(results);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-zinc-950 overflow-hidden">
      
      {/* Main Preview Area */}
      <div className="flex-1 relative flex flex-col h-full">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-center bg-gradient-to-b from-zinc-900/80 to-transparent pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ImageIcon className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Watermark Pro AI</h1>
                <p className="text-xs text-zinc-400">Secure your visual assets</p>
            </div>
          </div>
          
          {image && (
            <div className="flex gap-3 pointer-events-auto">
                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg border border-zinc-700 transition-all flex items-center gap-2 text-sm font-medium">
                    <Upload className="w-4 h-4" />
                    Change Image
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </label>
                <button 
                    onClick={handleDownload}
                    className="bg-white hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-lg shadow-lg shadow-white/10 transition-all flex items-center gap-2 text-sm font-bold"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
            </div>
          )}
        </header>

        {/* Canvas / Drop Zone */}
        <div 
            className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-hidden relative"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            ref={containerRef}
        >
            {/* Checkerboard background for transparency */}
            <div className="absolute inset-0 z-0 opacity-20" 
                style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {!image ? (
                <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all max-w-md w-full z-10 ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900/80'
                }`}>
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Upload an Image</h3>
                    <p className="text-zinc-400 text-sm mb-6">Drag and drop your image here, or click to browse files.</p>
                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-all inline-block font-medium shadow-lg shadow-indigo-500/25">
                        Choose File
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    </label>
                </div>
            ) : (
                <div className="relative shadow-2xl shadow-black/50 rounded-lg overflow-hidden max-w-full max-h-full flex z-10 border border-zinc-800">
                    <canvas 
                        ref={canvasRef} 
                        className="max-w-full max-h-full object-contain block"
                        style={{ maxHeight: '80vh' }} // Ensure it fits in view
                    />
                </div>
            )}
        </div>
        
        {/* Helper Text */}
        {!image && (
             <div className="absolute bottom-6 left-0 right-0 text-center text-zinc-500 text-sm pointer-events-none">
                Supported formats: PNG, JPG, WEBP
             </div>
        )}
      </div>

      {/* Control Panel Sidebar */}
      <ControlPanel 
        settings={settings} 
        onChange={setSettings} 
        onGenerateAI={handleGenerateAI}
        isGenerating={isGenerating}
        suggestions={suggestions}
        onSelectSuggestion={(txt) => setSettings({...settings, text: txt})}
      />
      
    </div>
  );
}

export default App;

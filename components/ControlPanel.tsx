
import React, { useRef } from 'react';
import { WatermarkSettings, POSITIONS } from '../types';
import { Type, Palette, Move, Maximize, Grid3X3, Wand2, RefreshCw, LayoutGrid, Sparkles, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';

interface ControlPanelProps {
  settings: WatermarkSettings;
  onChange: (settings: WatermarkSettings) => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
  suggestions: string[];
  onSelectSuggestion: (text: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  settings, 
  onChange, 
  onGenerateAI, 
  isGenerating,
  suggestions,
  onSelectSuggestion
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const update = (key: keyof WatermarkSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update('image', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-zinc-900 border-l border-zinc-800 w-full lg:w-96 p-6 overflow-y-auto h-full flex flex-col gap-8 shadow-2xl z-10 custom-scrollbar">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          Customize
        </h2>
      </div>

      {/* Mode Toggle */}
      <div className="bg-zinc-800 p-1 rounded-lg flex gap-1">
        <button
          onClick={() => update('type', 'text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            settings.type === 'text' 
              ? 'bg-zinc-700 text-white shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
          }`}
        >
          <Type className="w-4 h-4" /> Text
        </button>
        <button
          onClick={() => update('type', 'image')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            settings.type === 'image' 
              ? 'bg-zinc-700 text-white shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Image
        </button>
      </div>

      {/* Text Input & AI (Visible only in Text Mode) */}
      {settings.type === 'text' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Type className="w-4 h-4" /> Watermark Text
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.text}
              onChange={(e) => update('text', e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-500"
              placeholder="© Your Name"
            />
            <button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className={`p-2 rounded-lg transition-colors border border-indigo-500/30 ${
                isGenerating 
                  ? 'bg-indigo-500/10 cursor-not-allowed text-indigo-300' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }`}
              title="Generate with AI"
            >
              <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* Suggestions Chips */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSelectSuggestion(s)}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-2 py-1 rounded-full flex items-center gap-1 transition-colors animate-in fade-in zoom-in duration-300"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Upload (Visible only in Image Mode) */}
      {settings.type === 'image' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
           <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Upload Logo
          </label>
          
          {!settings.image ? (
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-zinc-800/50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
             >
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                   <Upload className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
                </div>
                <span className="text-xs text-zinc-400">Click to upload PNG/JPG</span>
             </div>
          ) : (
             <div className="relative bg-zinc-800 rounded-lg p-2 border border-zinc-700 flex items-center gap-3">
                <div className="w-12 h-12 bg-[url('https://bg.site/checkerboard.png')] bg-repeat rounded overflow-hidden flex-shrink-0 border border-zinc-600">
                   <img src={settings.image} alt="Watermark" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs text-zinc-400 truncate">Watermark Image Loaded</p>
                   <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium mt-1"
                   >
                      Replace
                   </button>
                </div>
                <button 
                    onClick={() => update('image', null)}
                    className="p-2 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 rounded-md transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
             </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleWatermarkImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      )}

      {/* Tiled Toggle */}
      <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
        <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4" /> Tiled Mode
        </span>
        <button
          onClick={() => update('isTiled', !settings.isTiled)}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            settings.isTiled ? 'bg-indigo-600' : 'bg-zinc-700'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            settings.isTiled ? 'left-7' : 'left-1'
          }`} />
        </button>
      </div>

      {/* Position Grid (Only if not tiled) */}
      {!settings.isTiled && (
        <div className="space-y-3">
           <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Move className="w-4 h-4" /> Position
          </label>
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto bg-zinc-800 p-2 rounded-xl">
            {POSITIONS.map((pos) => (
              <button
                key={pos.id}
                onClick={() => update('position', pos.id)}
                className={`w-full aspect-square rounded-md transition-all flex items-center justify-center ${
                  settings.position === pos.id
                    ? 'bg-indigo-600 shadow-inner ring-2 ring-indigo-400 ring-offset-2 ring-offset-zinc-800'
                    : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-400'
                }`}
                title={pos.label}
              >
                <div className={`w-2 h-2 rounded-full ${settings.position === pos.id ? 'bg-white' : 'bg-zinc-500'}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sliders Section */}
      <div className="space-y-6">
        
        {/* Color Picker (Text Only) */}
        {settings.type === 'text' && (
          <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-400">Color</label>
              <div className="flex gap-3 flex-wrap items-center">
                  {['#ffffff', '#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'].map(c => (
                      <button
                          key={c}
                          onClick={() => update('color', c)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${settings.color === c ? 'border-indigo-500 scale-110 shadow-lg' : 'border-zinc-700 hover:scale-105'}`}
                          style={{ backgroundColor: c }}
                          aria-label={`Select color ${c}`}
                      />
                  ))}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-700">
                    <input 
                        type="color" 
                        value={settings.color}
                        onChange={(e) => update('color', e.target.value)}
                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0"
                    />
                  </div>
              </div>
          </div>
        )}

        {/* Size Slider (Different for Text vs Image) */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400 flex items-center gap-2"><Maximize className="w-3 h-3"/> Size</span>
            <span className="text-zinc-200 font-mono">
                {Math.round(settings.type === 'text' ? settings.fontSize : settings.imageScale)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max={settings.type === 'text' ? "30" : "100"}
            value={settings.type === 'text' ? settings.fontSize : settings.imageScale}
            onChange={(e) => update(settings.type === 'text' ? 'fontSize' : 'imageScale', parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400 flex items-center gap-2">Opacity</span>
            <span className="text-zinc-200 font-mono">{Math.round(settings.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={settings.opacity}
            onChange={(e) => update('opacity', parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
             <span className="text-zinc-400 flex items-center gap-2"><RefreshCw className="w-3 h-3"/> Rotation</span>
             <span className="text-zinc-200 font-mono">{settings.rotation}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={settings.rotation}
            onChange={(e) => update('rotation', parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
        </div>

        {/* Gap (Tiled Only) */}
        {settings.isTiled && (
          <div className="space-y-3 animate-in slide-in-from-top-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 flex items-center gap-2"><LayoutGrid className="w-3 h-3"/> Spacing</span>
              <span className="text-zinc-200 font-mono">{settings.gap}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.gap}
              onChange={(e) => update('gap', parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            />
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 text-center">
          Pro Tip: Use PNG files with transparency for image watermarks.
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;

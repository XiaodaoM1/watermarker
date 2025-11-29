
export interface WatermarkSettings {
  type: 'text' | 'image';
  text: string;
  image: string | null; // Data URL of the uploaded watermark image
  imageScale: number; // Scale factor 1-100 (percentage of main image width)
  color: string;
  opacity: number; // 0 to 1
  fontSize: number; // Scale factor 1-100 (percentage of image width)
  rotation: number; // -180 to 180
  isTiled: boolean;
  position: 'tl' | 'tc' | 'tr' | 'cl' | 'cc' | 'cr' | 'bl' | 'bc' | 'br';
  gap: number; // 0 to 100
}

export const DEFAULT_SETTINGS: WatermarkSettings = {
  type: 'text',
  text: '© Watermark',
  image: null,
  imageScale: 15,
  color: '#ffffff',
  opacity: 0.8,
  fontSize: 5,
  rotation: 0,
  isTiled: false,
  position: 'br',
  gap: 20,
};

export const POSITIONS = [
  { id: 'tl', label: 'Top Left' },
  { id: 'tc', label: 'Top Center' },
  { id: 'tr', label: 'Top Right' },
  { id: 'cl', label: 'Center Left' },
  { id: 'cc', label: 'Center' },
  { id: 'cr', label: 'Center Right' },
  { id: 'bl', label: 'Bottom Left' },
  { id: 'bc', label: 'Bottom Center' },
  { id: 'br', label: 'Bottom Right' },
] as const;

export type PositionType = typeof POSITIONS[number]['id'];

export interface SuggestionResponse {
  suggestions: string[];
}

export type Language = 'en' | 'zh';

export const TRANSLATIONS = {
  en: {
    appTitle: "Watermark Pro AI",
    subtitle: "Secure your visual assets",
    changeImage: "Change Image",
    download: "Download",
    uploadTitle: "Upload an Image",
    uploadDesc: "Drag and drop your image here, or click to browse files.",
    chooseFile: "Choose File",
    supportedFormats: "Supported formats: PNG, JPG, WEBP",
    customize: "Customize",
    text: "Text",
    image: "Image",
    watermarkText: "Watermark Text",
    generateAi: "Generate with AI",
    uploadLogo: "Upload Logo",
    clickUpload: "Click to upload PNG/JPG",
    imageLoaded: "Watermark Image Loaded",
    replace: "Replace",
    tiledMode: "Tiled Mode",
    position: "Position",
    color: "Color",
    size: "Size",
    opacity: "Opacity",
    rotation: "Rotation",
    spacing: "Spacing",
    proTip: "Pro Tip: Use PNG files with transparency for image watermarks.",
    pos_tl: "Top Left",
    pos_tc: "Top Center",
    pos_tr: "Top Right",
    pos_cl: "Center Left",
    pos_cc: "Center",
    pos_cr: "Center Right",
    pos_bl: "Bottom Left",
    pos_bc: "Bottom Center",
    pos_br: "Bottom Right",
    defaultWatermark: "© Watermark"
  },
  zh: {
    appTitle: "水印大师 AI",
    subtitle: "智能保护您的图片版权",
    changeImage: "更换图片",
    download: "下载图片",
    uploadTitle: "上传图片",
    uploadDesc: "拖放图片到此处，或点击下方按钮选择。",
    chooseFile: "选择文件",
    supportedFormats: "支持格式：PNG, JPG, WEBP",
    customize: "自定义设置",
    text: "文字水印",
    image: "图片水印",
    watermarkText: "水印内容",
    generateAi: "AI 智能推荐",
    uploadLogo: "上传 Logo",
    clickUpload: "点击上传 PNG/JPG",
    imageLoaded: "水印图片已加载",
    replace: "更换",
    tiledMode: "平铺模式",
    position: "位置",
    color: "颜色",
    size: "大小",
    opacity: "不透明度",
    rotation: "旋转角度",
    spacing: "间距",
    proTip: "提示：建议使用背景透明的 PNG 图片以获得最佳效果。",
    pos_tl: "左上",
    pos_tc: "中上",
    pos_tr: "右上",
    pos_cl: "左中",
    pos_cc: "正中",
    pos_cr: "右中",
    pos_bl: "左下",
    pos_bc: "中下",
    pos_br: "右下",
    defaultWatermark: "© 版权所有"
  }
};

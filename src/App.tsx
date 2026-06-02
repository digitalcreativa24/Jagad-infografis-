/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent } from 'react';
import { 
  Settings, 
  Image as ImageIcon, 
  Layout, 
  Tag, 
  Wand2, 
  Shuffle, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Flame, 
  Globe, 
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OPTIONS, VISUAL_ELEMENTS, INITIAL_STATE, type InfographicFormData } from './types';

export default function App() {
  const [formData, setFormData] = useState<InfographicFormData>(INITIAL_STATE);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (element: string) => {
    setFormData(prev => {
      const isChecked = prev.elemenVisual.includes(element);
      if (isChecked) {
        return { ...prev, elemenVisual: prev.elemenVisual.filter(e => e !== element) };
      } else {
        return { ...prev, elemenVisual: [...prev.elemenVisual, element] };
      }
    });
  };

  const generatePrompt = () => {
    const {
      tema, tujuan, audiens, tone, bahasa, rasio, customWidthCm, customHeightCm, gayaDesain, warnaDominan,
      styleIcon, elemenVisual, layout, poin, namaBrand, tagline, sosmed,
      whatsapp, logoStyle, levelDetail, formatOutput
    } = formData;

    const fallbackTema = tema || "[TEMA BELUM DIISI]";
    const fallbackWarna = warnaDominan || "warna cerah dan menarik";
    
    let basePrompt = `/imagine prompt: A highly detailed, professional infographic design about "${fallbackTema}". `;
    
    basePrompt += `Purpose: ${tujuan}. Target Audience: ${audiens}. Tone: ${tone}. `;
    basePrompt += `Overall Design Style: ${gayaDesain}, using dominant colors of ${fallbackWarna}. `;
    
    basePrompt += `Layout Structure: ${layout} with exactly ${poin} distinct data points or sections. `;
    
    if (elemenVisual.length > 0) {
      basePrompt += `Incorporate visual elements such as: ${elemenVisual.join(', ')}. `;
    }
    
    basePrompt += `Icon Style: ${styleIcon}. `;
    
    if (namaBrand || tagline || sosmed || whatsapp || logoStyle) {
      basePrompt += `Branding guidelines - `;
      if (namaBrand) basePrompt += `Brand Name: "${namaBrand}", `;
      if (tagline) basePrompt += `Tagline: "${tagline}", `;
      if (sosmed) basePrompt += `Website/Social: "${sosmed}", `;
      if (whatsapp) basePrompt += `WhatsApp/Contact: "${whatsapp}", `;
      if (logoStyle) basePrompt += `Logo Style: ${logoStyle}. `;
    }

    basePrompt += `Text language context: ${bahasa}. (Ensure any mock text or structure aligns with this language). `;
    
    // Spesifikasi Kualitas Positif yang diperbarui sesuai permintaan
    const positiveQuality = "ultra high resolution, ultra hd, ultra sharp, sharp focus, high definition, 16K quality, clean details, crisp edges, clean texture, smooth lighting, professional rendering, print-ready design, perfectly sharp, clear and legible text";
    
    // Spesifikasi Kualitas Negatif (Hindari) yang diperbarui sesuai permintaan
    const negativePrompt = "--no pixelation, blur, low resolution, pixelated, noise, compression artifacts, distorted face, wrong text, broken logo, messy details, overexposed lighting, bad anatomy";

    basePrompt += `Quality specs: ${positiveQuality}. `;

    // Aspect ratio mapping for Midjourney
    let arString = "";
    if (rasio === 'Custom (Banner/Spanduk cm, 300 DPI)') {
      const w = parseInt(customWidthCm || '100');
      const h = parseInt(customHeightCm || '100');
      if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(w, h);
        const simplifiedW = Math.round(w / divisor);
        const simplifiedH = Math.round(h / divisor);
        arString = `--ar ${simplifiedW}:${simplifiedH}`;
        basePrompt += `Print size: Custom layout measuring ${w}cm width by ${h}cm height at extreme-definition printable 300 DPI. `;
      } else {
        arString = "--ar 16:9";
        basePrompt += `Print size: Custom high-resolution banner layout at printable 300 DPI. `;
      }
    } else {
      if (rasio.includes('1:1')) arString = "--ar 1:1";
      if (rasio.includes('3:4')) arString = "--ar 3:4";
      if (rasio.includes('4:5')) arString = "--ar 4:5";
      if (rasio.includes('9:16')) arString = "--ar 9:16";
      if (rasio.includes('16:9')) arString = "--ar 16:9";
      if (rasio.includes('A4 Vertikal')) arString = "--ar 2:3";
      if (rasio.includes('A4 Horisontal')) arString = "--ar 3:2";
      if (rasio.includes('Hero website')) arString = "--ar 16:9";
      if (rasio.includes('A3+ Horisontal')) arString = "--ar 19:13";
      if (rasio.includes('A3+ Vertikal')) arString = "--ar 13:19";
    }

    // Menyusun hasil akhir berdasarkan level detail
    if (levelDetail === 'Sangat Detail') {
      basePrompt += `${arString} --v 6.0 ${negativePrompt}`;
    } else if (levelDetail === 'Sedang') {
      basePrompt = `An infographic about "${fallbackTema}", ${gayaDesain} style, colors: ${fallbackWarna}. Layout: ${layout} with ${poin} sections. Include ${styleIcon} icons. Quality: ${positiveQuality}. ${arString} --v 6.0 ${negativePrompt}`;
    } else if (levelDetail === 'Biasa') {
      basePrompt = `Infographic: "${fallbackTema}", ${gayaDesain}, ${fallbackWarna}, ${layout}. Quality: ${positiveQuality}. ${arString} --v 6.0 ${negativePrompt}`;
    }

    let finalOutput = `[Instruksi untuk AI Image Generator (Midjourney/DALL-E 3)]\n\n${basePrompt}\n\n`;
    
    finalOutput += `[Verifikasi Akurasi Data & Fakta Terbaru]\n`;
    finalOutput += `• PENTING: Lakukan verifikasi silang (double-check) terhadap seluruh data, persentase, data statistik, informasi numerik, dan fakta sejarah/berita yang dimasukkan agar sepenuhnya akurat dan selaras dengan liputan berita terkini. Hindari data usang atau informasi spekulatif.\n\n`;

    if (formatOutput.includes('JSON')) {
      finalOutput += `[Format Struktur Konten JSON yang disarankan]\n{\n  "judul": "${fallbackTema}",\n  "warna": "${fallbackWarna}",\n  "layout": "${layout}",\n  "bagian": [\n    // AI, generate ${poin} data points di sini. Selalu double-check data agar akurat dengan berita terkini!\n  ]\n}`;
    }

    setGeneratedPrompt(finalOutput);
    setCopied(false);
    
    // Scroll to bottom smoothly
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 150);
  };

  const randomize = () => {
    const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const randomThemes = [
      "Manfaat Artificial Intelligence dalam Kehidupan Sehari-hari", 
      "Langkah Menjaga Kesehatan Mental Remaja di Era Digital", 
      "Sejarah dan Fakta Unik Kopi Dunia yang Wajib Diketahui", 
      "Evolusi Smartphone dari Masa ke Masa", 
      "Tips dan Panduan Investasi Reksa Dana untuk Pemula",
      "7 Cara Efektif Mengatur Waktu bagi Pekerja Lepas",
      "Siklus Hidup Bintang dan Lahirnya Supernova",
      "Pentingnya Konsumsi Air Putih 2 Liter per Hari"
    ];
    const randomColors = [
      "Orange, Teal, dan Biru Navy", 
      "Pink Pastel, Mint, dan Soft Grey", 
      "Monokrom Hitam Putih dengan aksen Kuning Emas", 
      "Neon Cyberpunk (Ungu Crimson & Cyan Blue)",
      "Muted Forest Green, Terracotta, dan Warm Sand",
      "Ocean Blue, Sunny Yellow, dan Crisp White"
    ];
    
    // Randomize visual elements (pick 2 to 4)
    const shuffledElements = [...VISUAL_ELEMENTS].sort(() => 0.5 - Math.random());
    const randomElementsCount = Math.floor(Math.random() * 3) + 2;
    const selectedElements = shuffledElements.slice(0, randomElementsCount);

    const pickedRasio = randomItem(OPTIONS.rasio);
    const isCustom = pickedRasio === 'Custom (Banner/Spanduk cm, 300 DPI)';
    const customWidthCm = isCustom ? String(Math.floor(Math.random() * 200) + 100) : '';
    const customHeightCm = isCustom ? String(Math.floor(Math.random() * 100) + 50) : '';

    setFormData({
      tema: randomItem(randomThemes),
      tujuan: randomItem(OPTIONS.tujuan),
      audiens: randomItem(OPTIONS.audiens),
      tone: randomItem(OPTIONS.tone),
      bahasa: randomItem(OPTIONS.bahasa),
      rasio: pickedRasio,
      customWidthCm,
      customHeightCm,
      gayaDesain: randomItem(OPTIONS.gayaDesain),
      warnaDominan: randomItem(randomColors),
      styleIcon: randomItem(OPTIONS.styleIcon),
      elemenVisual: selectedElements,
      layout: randomItem(OPTIONS.layout),
      poin: randomItem(OPTIONS.poin),
      namaBrand: 'JAGAD MEDIA',
      tagline: 'Visualizing Your Ideas with AI Power',
      sosmed: '@jagadmedia.id',
      whatsapp: '081234567890',
      logoStyle: 'Minimalist Linear Emblem',
      levelDetail: 'Sangat Detail',
      formatOutput: randomItem(OPTIONS.formatOutput)
    });
  };

  const reset = () => {
    setFormData(INITIAL_STATE);
    setGeneratedPrompt('');
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = generatedPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Gagal menyalin text: ", err);
      }
    }
  };

  // Helper function to colorize/highlight parts of the compiled prompt for beautiful rendering
  const renderHighlightedPrompt = (prompt: string) => {
    if (!prompt) return null;

    return (
      <div className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap select-text">
        {prompt.split('\n').map((line, idx) => {
          if (line.startsWith('/imagine prompt:')) {
            const label = '/imagine prompt: ';
            const remaining = line.substring(label.length);
            
            // Highlight parameters like --ar, --v, --no prefix
            const parts = remaining.split(/(--ar \d+:\d+|--v [\d\.]+|--no [a-zA-Z\s,]+)/g);
            
            return (
              <div key={idx} className="mb-2">
                <span className="text-pink-400 font-extrabold">{label}</span>
                {parts.map((part, pIdx) => {
                  if (part.startsWith('--ar')) {
                    return <span key={pIdx} className="text-emerald-400 font-semibold">{part}</span>;
                  } else if (part.startsWith('--v')) {
                    return <span key={pIdx} className="text-amber-400 font-semibold">{part}</span>;
                  } else if (part.startsWith('--no')) {
                    return <span key={pIdx} className="text-rose-400 font-semibold">{part}</span>;
                  }
                  return <span key={pIdx}>{part}</span>;
                })}
              </div>
            );
          }

          if (line.startsWith('[Verifikasi')) {
            return (
              <div key={idx} className="text-rose-400 font-extrabold tracking-wide mt-4 mb-2 flex items-center gap-2">
                <Flame size={16} className="text-rose-500 animate-pulse" />
                {line}
              </div>
            );
          }

          if (line.startsWith('• PENTING:')) {
            return (
              <div key={idx} className="text-rose-300 font-semibold bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl my-3 pl-4 leading-relaxed">
                {line}
              </div>
            );
          }

          if (line.startsWith('[Instruksi') || line.startsWith('[Format')) {
            return (
              <div key={idx} className="text-amber-300 font-bold tracking-wide mt-4 mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                {line}
              </div>
            );
          }

          if (line.trim().startsWith('{') || line.trim().startsWith('}') || line.trim().startsWith('"') || line.trim().startsWith('//')) {
            // Treat as JSON format
            if (line.trim().startsWith('//')) {
              return <div key={idx} className="text-slate-500 italic pl-4">{line}</div>;
            }
            return (
              <div key={idx} className="text-slate-400 pl-4">
                {line.split(':').map((segment, sIdx) => {
                  if (sIdx === 0) {
                    return <span key={sIdx} className="text-pink-300">{segment}</span>;
                  }
                  return <span key={sIdx}>:{segment}</span>;
                })}
              </div>
            );
          }

          return <div key={idx}>{line}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-pink-50 text-slate-800 font-sans p-4 md:p-8 antialiased selection:bg-pink-500/30 relative overflow-hidden">
      
      {/* Container holding standard Bento architectural grid */}
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Header Block styled as top Bento container */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm gap-4 transition-all hover:bg-white/70">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 uppercase italic">
                JAGAD MEDIA
              </h1>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                AI Infographic Prompt Architect
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <div className="px-4 py-2 bg-pink-50 rounded-full border border-pink-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-pink-700 uppercase tracking-tight">16K High Fidelity Mode</span>
            </div>
            <span className="px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
              MJ v6.0 Ready
            </span>
          </div>
        </header>

        {/* Modular Grid representing Bento box layout */}
        <main className="grid grid-cols-12 gap-6">
          
          {/* Card 1: Basic Content Architecture (col-span-8 equivalent) */}
          <section className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:bg-white/90">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-pink-600 text-white text-[10px] font-black rounded uppercase tracking-wider">Section 01</span>
                <h2 className="text-lg font-black text-slate-700 italic tracking-tight flex items-center gap-2">
                  <Settings size={18} className="text-pink-600" />
                  Informasi Dasar Konten
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-pink-500 mb-1.5 block tracking-wider">
                    Tema Utama Infografis <span className="text-pink-600">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="tema" 
                    value={formData.tema} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 outline-none transition-all text-slate-800"
                    placeholder="Contoh: Manfaat 10 Menit Berjalan Kaki Setiap Hari" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 mb-1.5 block tracking-wider">Tujuan komunikasi</label>
                  <div className="relative">
                    <select 
                      name="tujuan" 
                      value={formData.tujuan} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 cursor-pointer text-slate-700"
                    >
                      {OPTIONS.tujuan.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 mb-1.5 block tracking-wider">Target Audiens</label>
                  <div className="relative">
                    <select 
                      name="audiens" 
                      value={formData.audiens} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 cursor-pointer text-slate-700"
                    >
                      {OPTIONS.audiens.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 mb-1.5 block tracking-wider">Tone / Gaya Bahasa</label>
                  <div className="relative">
                    <select 
                      name="tone" 
                      value={formData.tone} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 cursor-pointer text-slate-700"
                    >
                      {OPTIONS.tone.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 mb-1.5 block tracking-wider">Bahasa Output</label>
                  <div className="relative">
                    <select 
                      name="bahasa" 
                      value={formData.bahasa} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 cursor-pointer text-slate-700"
                    >
                      {OPTIONS.bahasa.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <Globe size={14} className="text-pink-500" />
              <span>Gunakan bahasa yang disukai untuk melaraskan context infografis.</span>
            </div>
          </section>

          {/* Card 2: Aesthetic Settings (col-span-4 equivalent) */}
          <section className="col-span-12 lg:col-span-4 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:bg-white/90">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-black rounded uppercase tracking-wider">Section 02</span>
                <h2 className="text-lg font-black text-slate-700 italic tracking-tight flex items-center gap-2">
                  <ImageIcon size={18} className="text-orange-500" />
                  Aesthetic Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-orange-500 mb-1.5 block tracking-wider">Aspect Ratio</label>
                  <div className="relative">
                    <select 
                      name="rasio" 
                      value={formData.rasio} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-700 cursor-pointer"
                    >
                      {OPTIONS.rasio.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>

                  <AnimatePresence>
                    {formData.rasio === 'Custom (Banner/Spanduk cm, 300 DPI)' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="grid grid-cols-2 gap-3 overflow-hidden bg-orange-500/5 p-3 rounded-2xl border border-orange-500/10"
                      >
                        <div>
                          <label className="text-[9px] font-black uppercase text-orange-600 mb-1 block tracking-wider">Lebar Spanduk (cm)</label>
                          <input 
                            type="number" 
                            name="customWidthCm" 
                            value={formData.customWidthCm || ''} 
                            onChange={handleInputChange} 
                            min="1"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                            placeholder="Contoh: 300" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase text-orange-600 mb-1 block tracking-wider">Tinggi Spanduk (cm)</label>
                          <input 
                            type="number" 
                            name="customHeightCm" 
                            value={formData.customHeightCm || ''} 
                            onChange={handleInputChange} 
                            min="1"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                            placeholder="Contoh: 100" 
                          />
                        </div>
                        <div className="col-span-2 text-[9px] text-orange-700/90 font-bold flex items-center gap-1.5 justify-center leading-snug">
                          <Flame size={12} className="text-orange-500 flex-shrink-0 animate-pulse" />
                          <span>Rendering dioptimasi untuk Banner 300 DPI</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-500 mb-1.5 block tracking-wider">Gaya Desain</label>
                  <div className="relative">
                    <select 
                      name="gayaDesain" 
                      value={formData.gayaDesain} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-700 cursor-pointer"
                    >
                      {OPTIONS.gayaDesain.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-500 mb-1 block tracking-wider">Warna Dominan</label>
                  <input 
                    type="text" 
                    name="warnaDominan" 
                    value={formData.warnaDominan} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                    placeholder="Contoh: Coral Red, Gold Hex #FF8C00" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-500 mb-1.5 block tracking-wider">Style Icon</label>
                  <div className="relative">
                    <select 
                      name="styleIcon" 
                      value={formData.styleIcon} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-700 cursor-pointer"
                    >
                      {OPTIONS.styleIcon.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-500 mb-2 block tracking-wider">Visual Elements</label>
                  <div className="flex flex-wrap gap-1.5">
                    {VISUAL_ELEMENTS.map(element => {
                      const isSelected = formData.elemenVisual.includes(element);
                      return (
                        <button
                          key={element}
                          type="button"
                          onClick={() => handleCheckboxChange(element)}
                          className={`px-2.5 py-1.5 rounded transition-all text-[10px] font-black uppercase flex items-center cursor-pointer ${
                            isSelected 
                              ? 'bg-orange-500 text-white border border-orange-600 shadow-sm' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300/40'
                          }`}
                        >
                          {element}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Ready to generate with custom styles
            </div>
          </section>

          {/* Card 3: Layout Structure (col-span-4 equivalent) */}
          <section className="col-span-12 md:col-span-6 lg:col-span-4 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:bg-white/90">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-pink-500 text-white text-[10px] font-black rounded uppercase tracking-wider">Section 03</span>
                <h2 className="text-lg font-black text-slate-700 italic tracking-tight flex items-center gap-2">
                  <Layout size={18} className="text-pink-500" />
                  Struktur & Grid Layout
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 mb-1.5 block tracking-wider">Tipe Layout</label>
                  <div className="relative">
                    <select 
                      name="layout" 
                      value={formData.layout} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold appearance-none outline-none focus:ring-2 focus:ring-pink-500/20 text-slate-700 cursor-pointer"
                    >
                      {OPTIONS.layout.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-pink-500 mb-1.5 block tracking-wider">Jumlah Poin / Sub-Bagian</label>
                  <div className="relative">
                    <select 
                      name="poin" 
                      value={formData.poin} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold appearance-none outline-none focus:ring-2 focus:ring-pink-500/20 text-slate-700 cursor-pointer"
                    >
                      {OPTIONS.poin.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-xl p-3 border border-slate-200/50 flex gap-2.5">
                  <HelpCircle size={16} className="text-pink-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                    Jumlah poin membagikan grid layout secara seimbang ke dalam canvas gambar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Auto Grid Calibration Active
            </div>
          </section>

          {/* Card 4: Branding & Output (col-span-8 equivalent) */}
          <section className="col-span-12 md:col-span-6 lg:col-span-8 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:bg-white/90">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-orange-600 text-white text-[10px] font-black rounded uppercase tracking-wider">Section 04</span>
                <h2 className="text-lg font-black text-slate-700 italic tracking-tight flex items-center gap-2">
                  <Tag size={18} className="text-orange-600" />
                  Branding & Output Format
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-orange-600 mb-1 block tracking-wider">Nama Brand</label>
                  <input 
                    type="text" 
                    name="namaBrand" 
                    value={formData.namaBrand} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                    placeholder="Nama Brand (Opsional)" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-600 mb-1 block tracking-wider">Tagline</label>
                  <input 
                    type="text" 
                    name="tagline" 
                    value={formData.tagline} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                    placeholder="Tagline Brand (Opsional)" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-600 mb-1 block tracking-wider">Instagram / Website</label>
                  <input 
                    type="text" 
                    name="sosmed" 
                    value={formData.sosmed} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                    placeholder="@socialMedia (Opsional)" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-600 mb-1 block tracking-wider">No WhatsApp</label>
                  <input 
                    type="text" 
                    name="whatsapp" 
                    value={formData.whatsapp} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                    placeholder="No WhatsApp (Opsional)" 
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-orange-600 mb-1 block tracking-wider">Gaya Logo / Watermark</label>
                  <input 
                    type="text" 
                    name="logoStyle" 
                    value={formData.logoStyle} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800"
                    placeholder="Contoh: Minimalist Linear Logo, atau Typographic emblem" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-600 mb-1 block tracking-wider font-bold">Level Detail</label>
                  <div className="relative">
                    <select 
                      name="levelDetail" 
                      value={formData.levelDetail} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer text-slate-700"
                    >
                      {OPTIONS.levelDetail.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-orange-600 mb-1 block tracking-wider font-bold">Format Output</label>
                  <div className="relative">
                    <select 
                      name="formatOutput" 
                      value={formData.formatOutput} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer text-slate-700"
                    >
                      {OPTIONS.formatOutput.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Custom metadata embedding supported
            </div>
          </section>

          {/* Section: Live Parameter check strip */}
          <div className="col-span-12 bg-white/60 backdrop-blur-sm border border-white/80 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-slate-500 shadow-sm transition-all hover:bg-white/75">
            <div className="flex items-center gap-2">
              <span className="p-1 px-1.5 rounded bg-pink-500/10 text-pink-600 font-bold text-[10px] border border-pink-500/20">LIVE METADATA</span>
              <span className="text-slate-600 font-semibold truncate max-w-xs md:max-w-md">
                {formData.tema ? `Subjek: "${formData.tema}"` : "Tema belum diisi"}
              </span>
            </div>
            <div className="flex gap-4 font-black uppercase text-[10px] text-slate-400">
              <span>Ratio: <b className="text-slate-600">
                {formData.rasio === 'Custom (Banner/Spanduk cm, 300 DPI)' 
                  ? `Custom ${formData.customWidthCm || '100'}x${formData.customHeightCm || '100'} cm (300 DPI)` 
                  : formData.rasio}
              </b></span>
              <span>Style: <b className="text-slate-600">{formData.gayaDesain}</b></span>
              <span>Warna: <b className="text-slate-600">{formData.warnaDominan || "Automated"}</b></span>
            </div>
          </div>

          {/* Bento Command Center Container */}
          <section className="col-span-12 bg-gradient-to-br from-pink-600 to-orange-500 rounded-[2.5rem] p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-white/20">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">Ready to Construct prompt?</h3>
              <p className="text-pink-100 text-xs font-semibold">Tunggal klik untuk merumuskan instruksi Midjourney & DALL-E beresolusi ultra tajam</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button 
                onClick={generatePrompt}
                className="w-full sm:w-auto py-3.5 px-8 bg-white hover:bg-slate-50 text-pink-600 rounded-2xl font-black text-base shadow-sm hover:shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-2.5 uppercase italic tracking-tighter cursor-pointer"
              >
                <Wand2 size={18} />
                Generate Prompt
              </button>

              <button 
                onClick={randomize}
                className="w-full sm:w-auto py-3.5 px-5 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-bold uppercase transition-all backdrop-blur-sm border border-white/10 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Shuffle size={14} />
                Randomize
              </button>

              <button 
                onClick={reset}
                className="w-full sm:w-auto py-3.5 px-5 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-bold uppercase transition-all backdrop-blur-sm border border-white/10 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </section>

        </main>

        {/* Master Prompt Output Screen Container */}
        <AnimatePresence>
          {generatedPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="col-span-12 bg-slate-950 text-slate-100 rounded-[2.5rem] p-6 md:p-8 border-4 border-white shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/20 blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-md font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
                    <Sparkles size={16} className="text-pink-400 animate-pulse" />
                    Generated Master Prompt
                  </h3>
                  <p className="text-xs text-slate-400 select-none">Teks di bawah diformulasikan cerdas untuk rendering print-ready.</p>
                </div>
                
                <button 
                  onClick={copyToClipboard}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Prompt'}
                </button>
              </div>

              {/* Monospaced prompt terminal screen */}
              <div className="bg-black/50 rounded-xl p-4 md:p-5 flex-1 font-mono text-xs leading-relaxed text-green-400 border border-white/5 relative z-10 min-h-[250px]">
                {renderHighlightedPrompt(generatedPrompt)}
              </div>

              {/* Guidance advice bar inside the show container */}
              <footer className="mt-4 pt-4 border-t border-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-widest flex flex-col sm:flex-row justify-between gap-2 relative z-10">
                <div className="flex items-center gap-1.5">
                  <Bookmark size={12} className="text-amber-500 flex-shrink-0" />
                  <span>Tips: Gunakan Midjourney model v6.0 untuk detail pixel-perfect.</span>
                </div>
                <span className="text-slate-600">Negative Prompt filter active</span>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info styled as requested */}
        <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest gap-2">
          <div>&copy; {new Date().getFullYear()} Jagad Media Design Lab</div>
          <div className="flex gap-4">
            <span>Version 6.0 Stable</span>
            <span className="text-pink-500">System Ready</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

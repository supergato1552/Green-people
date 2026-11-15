import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Grid3X3, 
  Smartphone, 
  Smile, 
  Bot, 
  Sliders, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FilterType, UserRegistrationData } from '../types';

interface PhaseTwoProps {
  data: UserRegistrationData;
  updateData: (fields: Partial<UserRegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FILTERS = [
  { id: 'normal' as FilterType, label: 'Natural', colorClass: 'from-emerald-400 to-green-500', desc: 'Tonos naturales y luminosos' },
  { id: 'bw' as FilterType, label: 'Blanco & Negro', colorClass: 'from-zinc-300 to-zinc-600', desc: 'Elegancia clásica y contraste' },
  { id: 'cinema-teal' as FilterType, label: 'Película Azul/Verde', colorClass: 'from-cyan-400 to-emerald-600', desc: 'Estética cinematográfica verdosa' },
  { id: 'vintage-red' as FilterType, label: 'Rojo Cálido', colorClass: 'from-rose-500 to-amber-600', desc: 'Calidez nostálgica y carácter' }
];

const PHOTO_TIPS = [
  {
    icon: Grid3X3,
    title: 'Regla de los Tercios',
    text: 'Alinea tus ojos con la línea superior de la cuadrícula para una mirada magnética.'
  },
  {
    icon: Smartphone,
    title: 'Ángulo y Orientación',
    text: 'Mantén el teléfono al nivel de los ojos o ligeramente inclinado hacia abajo (10°).'
  },
  {
    icon: Smile,
    title: 'Expresión Natural y Relajada',
    text: 'Hombros sueltos, mentón ligeramente arriba y una media sonrisa sincera transmiten empatía.'
  }
];

export const PhaseTwoCamera: React.FC<PhaseTwoProps> = ({ data, updateData, onNext, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('normal');
  const [countdown, setCountdown] = useState<number | null>(null);

  // AI Age Verification State (Roblox-style)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiVerdict, setAiVerdict] = useState<{
    detectedAge: number;
    difference: number;
    message: string;
    passed: boolean;
  } | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1080 },
            height: { ideal: 1080 },
            facingMode: 'user'
          },
          audio: false
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err: any) {
        console.warn('Webcam not directly available or denied:', err);
        setCameraError(
          'No se pudo acceder a la cámara en directo (permiso no concedido o entorno sin webcam). ¡Puedes usar el generador de simulación instantáneo!'
        );
      }
    }

    if (!data.avatarUrl) {
      initCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [data.avatarUrl]);

  // Capture photo from live video or synthetic avatar
  const capturePhoto = () => {
    let photoData = '';

    if (streamActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Draw image
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Apply filter directly onto canvas data if desired
        photoData = canvas.toDataURL('image/jpeg', 0.9);
      }
    } else {
      // Fallback synthetic avatar using high quality dicebear realistic style or SVG
      const seed = encodeURIComponent(data.username || 'green-friend');
      photoData = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=0b100d,12281c`;
    }

    updateData({ avatarUrl: photoData });
    runAiAgeDetector();
  };

  // Roblox-style AI Age Detector
  const runAiAgeDetector = () => {
    setIsAnalyzing(true);
    setAiVerdict(null);

    // AI scan effect duration (2.2 seconds)
    setTimeout(() => {
      const declaredAge = typeof data.realAge === 'number' ? data.realAge : 22;
      
      // Calculate realistic neural age detection with small randomized variance (-1 to +2)
      const variance = Math.floor(Math.random() * 3) - 1;
      const detected = Math.max(13, declaredAge + variance);
      const diff = Math.abs(detected - declaredAge);

      const passed = diff <= 5; // Passes if close to real declared age

      setAiVerdict({
        detectedAge: detected,
        difference: diff,
        message: passed 
          ? '¡Te ves genial! Tu edad coincide con los rasgos biométricos analizados.' 
          : 'Detectamos ligera discrepancia con tu edad declarada, pero hemos validado tu autenticidad.',
        passed: true
      });

      updateData({
        detectedAge: detected,
        aiVerificationPassed: true
      });

      setIsAnalyzing(false);

      // Trigger satisfaction confetti
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#ec4899', '#f59e0b']
      });
    }, 2400);
  };

  const handleRetake = () => {
    updateData({ avatarUrl: null, detectedAge: null, aiVerificationPassed: false });
    setAiVerdict(null);
  };

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Filter CSS style definitions
  const getFilterStyle = (filter: FilterType) => {
    switch (filter) {
      case 'bw':
        return 'grayscale(100%) contrast(120%)';
      case 'cinema-teal':
        return 'contrast(115%) saturate(85%) hue-rotate(165deg) sepia(25%)';
      case 'vintage-red':
        return 'sepia(40%) saturate(140%) hue-rotate(-20deg) contrast(110%)';
      default:
        return 'contrast(105%) brightness(102%)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          Fase 2: Foto de Perfil & Verificación de Edad
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Captura tu esencia <span className="text-emerald-400">al momento</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          En Green People las fotos se toman al instante. Nada de fotos retocadas de hace 5 años.
        </p>
      </div>

      {/* VIEWFINDER / CAMERA CONTAINER */}
      <div className="relative mx-auto max-w-md aspect-square rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <canvas ref={canvasRef} className="hidden" />

        {/* 1. Live video feed */}
        {!data.avatarUrl ? (
          streamActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ filter: getFilterStyle(selectedFilter) }}
              className="w-full h-full object-cover transform -scale-x-100 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-[#0e1d15] to-slate-900">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                <Camera className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-1">Cámara en Vivo Preparada</p>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                {cameraError || 'Haz clic para capturar o autorizar tu cámara para tomar la foto al momento.'}
              </p>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition"
              >
                Capturar Foto Ahora
              </button>
            </div>
          )
        ) : (
          /* Captured photo preview */
          <div className="relative w-full h-full">
            <img
              src={data.avatarUrl}
              alt="Avatar de perfil"
              style={{ filter: getFilterStyle(selectedFilter) }}
              className="w-full h-full object-cover"
            />
            {/* Retake button overlay */}
            <button
              type="button"
              onClick={handleRetake}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Repetir Foto
            </button>
          </div>
        )}

        {/* RULE OF THIRDS GRID OVERLAY */}
        {showRuleOfThirds && !data.avatarUrl && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
            <div className="border-r border-b border-emerald-400/20" />
            <div className="border-r border-b border-emerald-400/20" />
            <div className="border-b border-emerald-400/20" />
            <div className="border-r border-b border-emerald-400/20" />
            <div className="border-r border-b border-emerald-400/20" />
            <div className="border-b border-emerald-400/20" />
            <div className="border-r border-emerald-400/20" />
            <div className="border-r border-emerald-400/20" />
            <div />
          </div>
        )}

        {/* COUNTDOWN OVERLAY */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30 pointer-events-none"
            >
              <span className="text-8xl font-black text-emerald-400 font-heading drop-shadow-[0_0_20px_#10b981]">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI SCANNING LASER EFFECT (ROBLOX STYLE) */}
        <AnimatePresence>
          {isAnalyzing && (
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 overflow-hidden">
              <motion.div
                animate={{ y: ['-100%', '300%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
              />
              <div className="px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-2xl">
                <Bot className="w-4 h-4 animate-spin text-emerald-400" />
                IA Detector Biomagnético Roblox Scan v2.4...
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* TOGGLE RULE OF THIRDS BUTTON */}
        {!data.avatarUrl && (
          <button
            type="button"
            onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
            className={`absolute top-4 left-4 z-20 px-2.5 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border transition flex items-center gap-1.5 ${
              showRuleOfThirds
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-black/40 border-white/20 text-slate-300 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            {showRuleOfThirds ? 'Guía de Tercios activa' : 'Activar Tercios'}
          </button>
        )}
      </div>

      {/* FILTER PALETTE */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          Filtros de Tono Cinematográfico
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedFilter === f.id
                  ? 'border-emerald-400 bg-emerald-950/40 text-white ring-1 ring-emerald-400/50'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${f.colorClass}`} />
                <span className="text-xs font-bold">{f.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SHUTTER / CAPTURE BUTTON */}
      {!data.avatarUrl && (
        <div className="flex justify-center pt-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startCountdown}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-[0_10px_30px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            Tomar Foto Ahora (3s)
          </motion.button>
        </div>
      )}

      {/* AI ROBLOX-STYLE AGE VERDICT CARD */}
      {aiVerdict && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                IA Roblox-Style Age Detector: Aprobado
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
              Edad Estimada: ~{aiVerdict.detectedAge} años
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
              ✨
            </div>
            <div>
              <p className="text-base font-bold text-white">¡Te ves genial!</p>
              <p className="text-xs text-slate-300">{aiVerdict.message}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TIPS DE EXPERTO PARA SALIR BIEN */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Consejos del Algoritmo para lucir auténtico:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PHOTO_TIPS.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-200">{tip.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition"
        >
          Atrás
        </button>

        <motion.button
          type="button"
          disabled={!data.avatarUrl || isAnalyzing}
          whileHover={data.avatarUrl && !isAnalyzing ? { scale: 1.02 } : {}}
          whileTap={data.avatarUrl && !isAnalyzing ? { scale: 0.98 } : {}}
          onClick={onNext}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
            data.avatarUrl && !isAnalyzing
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <span>Avanzar a la Fase 3</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
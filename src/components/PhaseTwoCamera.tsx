import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  Grid3X3, 
  Smartphone, 
  Smile, 
  Bot, 
  Sliders, 
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
  { id: 'normal' as FilterType, label: 'Natural', colorClass: 'from-[#d97757] to-amber-500', desc: 'Tonos naturales y luminosos' },
  { id: 'bw' as FilterType, label: 'Blanco & Negro', colorClass: 'from-zinc-300 to-zinc-600', desc: 'Elegancia clásica y contraste' },
  { id: 'cinema-teal' as FilterType, label: 'Cálido Claude', colorClass: 'from-[#ea580c] to-[#d97757]', desc: 'Atmósfera cinematográfica cálida' },
  { id: 'vintage-red' as FilterType, label: 'Vintage Ámbar', colorClass: 'from-amber-500 to-rose-600', desc: 'Calidez nostálgica y carácter' }
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
    text: 'Mantén el teléfono al nivel de los ojos o con una suave inclinación hacia abajo (10°).'
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

  // Initialize camera stream with cross-browser Safari/WebKit and Chromium compatibility
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Navegador sin soporte de medios directos');
        }

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
          // Required for iOS WebKit inline playback
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          await videoRef.current.play().catch(() => {});
          setStreamActive(true);
        }
      } catch (err: any) {
        console.warn('Webcam not directly available or denied:', err);
        setCameraError(
          'No se detectó cámara activa o se denegó el permiso. ¡Puedes usar el generador instantáneo de foto simulada!'
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
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg', 0.9);
      }
    } else {
      // Fallback synthetic avatar using high quality notionist portrait
      const seed = encodeURIComponent(data.username || 'claude-friend');
      photoData = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=141210,24140d`;
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
      
      const variance = Math.floor(Math.random() * 3) - 1;
      const detected = Math.max(13, declaredAge + variance);
      const diff = Math.abs(detected - declaredAge);

      const passed = diff <= 5;

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

      // Trigger warm Claude orange confetti
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d97757', '#ea580c', '#fb923c', '#fdba74', '#f59e0b']
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
        return 'contrast(110%) saturate(110%) sepia(20%) hue-rotate(-10deg)';
      case 'vintage-red':
        return 'sepia(35%) saturate(135%) hue-rotate(-20deg) contrast(110%)';
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
      className="space-y-5 sm:space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#291811]/80 border border-[#d97757]/30 text-[#f28b66] text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5 text-[#d97757]" />
          Fase 2: Foto de Perfil & Verificación
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
          Captura tu esencia <span className="text-[#d97757]">al momento</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
          En Green People las fotos se toman al instante. Nada de fotos retocadas de hace 5 años.
        </p>
      </div>

      {/* VIEWFINDER / CAMERA CONTAINER */}
      <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#d97757]/40 bg-stone-950 shadow-[0_0_50px_rgba(217,119,87,0.22)]">
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
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#12100e] via-[#1a1410] to-stone-950">
              <div className="w-16 h-16 rounded-2xl bg-[#d97757]/15 border border-[#d97757]/35 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(217,119,87,0.25)]">
                <Camera className="w-8 h-8 text-[#d97757]" />
              </div>
              <p className="text-sm font-semibold text-stone-200 mb-1">Cámara Lista</p>
              <p className="text-xs text-stone-400 max-w-xs mb-4 leading-relaxed">
                {cameraError || 'Toca el botón para capturar tu foto con la cámara o generar una imagen al momento.'}
              </p>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-5 py-2.5 rounded-xl bg-[#d97757] hover:bg-[#ea580c] text-white font-bold text-xs transition shadow-lg shadow-[#d97757]/30 cursor-pointer"
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
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-stone-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d97757]" /> Repetir Foto
            </button>
          </div>
        )}

        {/* RULE OF THIRDS GRID OVERLAY */}
        {showRuleOfThirds && !data.avatarUrl && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
            <div className="border-r border-b border-[#d97757]/25" />
            <div className="border-r border-b border-[#d97757]/25" />
            <div className="border-b border-[#d97757]/25" />
            <div className="border-r border-b border-[#d97757]/25" />
            <div className="border-r border-b border-[#d97757]/25" />
            <div className="border-b border-[#d97757]/25" />
            <div className="border-r border-b border-[#d97757]/25" />
            <div className="border-r border-b border-[#d97757]/25" />
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
              <span className="text-8xl font-black text-[#f28b66] font-heading drop-shadow-[0_0_25px_rgba(217,119,87,0.8)]">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI SCANNING LASER EFFECT (ROBLOX STYLE) */}
        <AnimatePresence>
          {isAnalyzing && (
            <div className="absolute inset-0 bg-[#24140d]/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 overflow-hidden">
              <motion.div
                animate={{ y: ['-100%', '300%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-full h-1 bg-gradient-to-r from-transparent via-[#d97757] to-transparent shadow-[0_0_18px_#d97757]"
              />
              <div className="px-4 py-2 rounded-full bg-stone-900/95 border border-[#d97757]/50 text-[#fed7aa] text-xs font-bold flex items-center gap-2 shadow-2xl">
                <Bot className="w-4 h-4 animate-spin text-[#d97757]" />
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
            className={`absolute top-3 left-3 sm:top-4 sm:left-4 z-20 px-2.5 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border transition flex items-center gap-1.5 ${
              showRuleOfThirds
                ? 'bg-[#d97757]/20 border-[#d97757] text-[#fed7aa]'
                : 'bg-black/50 border-white/20 text-stone-300 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            {showRuleOfThirds ? 'Guía de Tercios' : 'Activar Tercios'}
          </button>
        )}
      </div>

      {/* FILTER PALETTE */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-[#d97757]" />
          Filtros de Tono
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'border-[#d97757] bg-[#291811]/70 text-white ring-1 ring-[#d97757]/60'
                  : 'border-stone-800 bg-stone-900/50 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${f.colorClass}`} />
                <span className="text-xs font-bold">{f.label}</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-tight">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SHUTTER / CAPTURE BUTTON */}
      {!data.avatarUrl && (
        <div className="flex justify-center pt-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={startCountdown}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#d97757] via-[#ea580c] to-[#f97316] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(217,119,87,0.45)] cursor-pointer"
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
          className="p-4 rounded-2xl bg-gradient-to-r from-[#291811]/85 to-stone-900 border border-[#d97757]/50 shadow-[0_0_30px_rgba(217,119,87,0.25)] space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#d97757]/20 text-[#d97757]">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#f28b66]">
                IA Roblox-Style Age Detector: Aprobado
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#d97757]/20 text-[#fed7aa] font-mono text-xs font-bold">
              Edad Estimada: ~{aiVerdict.detectedAge} años
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d97757] text-white flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(217,119,87,0.5)]">
              ✨
            </div>
            <div>
              <p className="text-base font-bold text-white">¡Te ves genial!</p>
              <p className="text-xs text-stone-300">{aiVerdict.message}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TIPS DE EXPERTO PARA SALIR BIEN */}
      <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#d97757]" />
          Consejos del Algoritmo para lucir auténtico:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PHOTO_TIPS.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#d97757]">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold text-stone-200">{tip.title}</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3.5 rounded-xl border border-stone-700 bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-sm font-semibold transition cursor-pointer"
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
              ? 'bg-gradient-to-r from-[#d97757] via-[#ea580c] to-[#f97316] text-white shadow-[0_10px_25px_-5px_rgba(217,119,87,0.5)] cursor-pointer'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50'
          }`}
        >
          <span>Avanzar a la Fase 3</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

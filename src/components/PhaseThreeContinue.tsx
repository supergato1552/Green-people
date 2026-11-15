import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserRegistrationData } from '../types';

interface PhaseThreeProps {
  data: UserRegistrationData;
  onComplete: () => void;
}

export const PhaseThreeContinue: React.FC<PhaseThreeProps> = ({ data, onComplete }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);

    // Big explosive celebration confetti with Claude warm orange tones
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 999,
      colors: ['#d97757', '#ea580c', '#fb923c', '#fdba74', '#f59e0b', '#c2410c']
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.7 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.7 } });
    }, 250);

    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-8 py-4 sm:py-6 text-center"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#291811]/80 border border-[#d97757]/30 text-[#f28b66] text-xs font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#d97757]" />
        Fase 3: Todo Listo
      </div>

      {/* Hero Welcome */}
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-heading">
          ¡Bienvenido a casa, <span className="text-[#d97757]">@{data.username || 'amigo'}</span>!
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Has completado con éxito la primera etapa del registro más auténtico y cercano de la web.
        </p>
      </div>

      {/* Mini Profile Summary Card */}
      <div className="max-w-xs mx-auto p-4 rounded-2xl bg-gradient-to-b from-stone-900 to-[#191410] border border-[#d97757]/35 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#d97757] shadow-[0_0_24px_rgba(217,119,87,0.4)] mb-3">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#28150d] flex items-center justify-center text-3xl">
              🌿
            </div>
          )}
        </div>
        <h3 className="text-base font-bold text-white">{data.realName || 'Usuario'}</h3>
        <p className="text-xs text-[#f28b66] font-semibold">@{data.username}</p>
        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-stone-300">
          <span className="px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700">{data.gender}</span>
          <span className="px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700">{data.realAge} años</span>
          <span className="px-2 py-0.5 rounded-full bg-[#291811] border border-[#d97757]/40 text-[#f28b66]">Verificado</span>
        </div>
      </div>

      {/* THE ONLY BUTTON AS REQUESTED: "CONTINUAR" */}
      <div className="pt-2 sm:pt-4 max-w-sm mx-auto">
        <motion.button
          type="button"
          disabled={clicked}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleClick}
          className="w-full py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg tracking-wide bg-gradient-to-r from-[#d97757] via-[#ea580c] to-[#f97316] text-white shadow-[0_15px_40px_rgba(217,119,87,0.5)] cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 group"
        >
          <span>Continuar</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

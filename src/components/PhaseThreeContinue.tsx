import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
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

    // Big explosive celebration confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

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
      className="space-y-8 py-6 text-center"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        Fase 3: Todo Listo
      </div>

      {/* Hero Welcome */}
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          ¡Bienvenido a casa, <span className="text-emerald-400">@{data.username || 'amigo'}</span>!
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Has completado con éxito la primera etapa del registro más auténtico y cercano de la web.
        </p>
      </div>

      {/* Mini Profile Summary Card */}
      <div className="max-w-xs mx-auto p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e1d15] border border-emerald-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-3">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-emerald-900/60 flex items-center justify-center text-3xl">
              🌿
            </div>
          )}
        </div>
        <h3 className="text-base font-bold text-white">{data.realName || 'Usuario'}</h3>
        <p className="text-xs text-emerald-400 font-medium">@{data.username}</p>
        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">{data.gender}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">{data.realAge} años</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400">Verificado</span>
        </div>
      </div>

      {/* THE ONLY BUTTON AS REQUESTED: "CONTINUAR" */}
      <div className="pt-4 max-w-sm mx-auto">
        <motion.button
          type="button"
          disabled={clicked}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="w-full py-5 rounded-2xl font-black text-lg tracking-wide bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 shadow-[0_15px_40px_rgba(16,185,129,0.5)] cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 group"
        >
          <span>Continuar</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};
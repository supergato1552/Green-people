import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  AtSign, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GenderOption, UserRegistrationData } from '../types';

interface PhaseOneProps {
  data: UserRegistrationData;
  updateData: (fields: Partial<UserRegistrationData>) => void;
  onNext: () => void;
}

const GENDER_OPTIONS: { id: GenderOption; label: string; icon: string; desc: string }[] = [
  { id: 'Hombre', label: 'Hombre', icon: '🌿', desc: 'Identidad masculina' },
  { id: 'Mujer', label: 'Mujer', icon: '🌸', desc: 'Identidad femenina' },
  { id: 'Gay', label: 'Gay', icon: '✨', desc: 'Atracción hacia hombres' },
  { id: 'Lesbiana', label: 'Lesbiana', icon: '🌷', desc: 'Atracción hacia mujeres' },
  { id: 'No Binario', label: 'No Binario', icon: '🍃', desc: 'Fuera del binarismo' }
];

export const PhaseOneIdentity: React.FC<PhaseOneProps> = ({ data, updateData, onNext }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isComplete = 
    data.gender !== '' && 
    data.realName.trim().length >= 2 && 
    data.username.trim().length >= 3 && 
    typeof data.realAge === 'number' && data.realAge >= 13 && data.realAge <= 110 &&
    data.agreedHonesty;

  // Sound-like micro-satisfaction trigger (haptic visual feedback)
  const triggerLittleCelebration = () => {
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#6ee7b7']
    });
  };

  const handleGenderSelect = (gender: GenderOption) => {
    updateData({ gender });
  };

  const handleHonestyToggle = () => {
    const nextVal = !data.agreedHonesty;
    updateData({ agreedHonesty: nextVal });
    if (nextVal) {
      triggerLittleCelebration();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header with psychology note */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5" />
          Fase 1: Identidad & Autenticidad
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Aquí la gente viene a ser <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4">real</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Sin filtros de apariencia falsa. Construyamos una amistad honesta desde el primer clic.
        </p>
      </div>

      {/* 1. GENDER SELECTION */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>1. ¿Cómo te identificas?</span>
          {data.gender && (
            <span className="text-emerald-400 font-medium normal-case flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Seleccionado
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {GENDER_OPTIONS.map((g) => {
            const isSelected = data.gender === g.id;
            return (
              <motion.button
                key={g.id}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleGenderSelect(g.id)}
                className={`relative p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 border ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-600/30 to-emerald-950/80 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-2xl mb-1.5">{g.icon}</span>
                <span className="text-sm font-semibold">{g.label}</span>
                {isSelected && (
                  <motion.div 
                    layoutId="gender-glow"
                    className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. REAL NAME + PRIVACY NOTICE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            2. Tu Nombre Real
          </label>
          {data.realName.trim().length >= 2 && (
            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Válido
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={data.realName}
            onChange={(e) => updateData({ realName: e.target.value })}
            onBlur={() => setTouched(prev => ({ ...prev, realName: true }))}
            placeholder="Ej. Sofía Martínez o Carlos Ruiz"
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        {/* Psychological Trust Banner */}
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
          <Eye className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-300/90 leading-relaxed">
            <strong className="text-emerald-200 font-semibold">Tú tienes el control total:</strong> Más adelante podrás decidir exactamente quién puede ver tu nombre real (solo amigos cercanos, todos o nadie).
          </p>
        </div>
      </div>

      {/* 3. USERNAME / ALIAS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <AtSign className="w-3.5 h-3.5 text-emerald-400" />
            3. Nombre de Usuario (Apodo o Alias)
          </label>
          {data.username.trim().length >= 3 && (
            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> @{data.username.toLowerCase().replace(/\s+/g, '')} está genial
            </span>
          )}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">@</span>
          <input
            type="text"
            value={data.username}
            onChange={(e) => updateData({ username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
            placeholder="aventurero_verde, panda99, etc."
            className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Este será tu identificador público en la comunidad. Usa tu apodo favorito o el que más te identifique.
        </p>
      </div>

      {/* 4. REAL AGE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            4. Tu Edad Real
          </label>
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-slate-400 hover:text-emerald-400 transition text-[11px] flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> ¿Por qué la pedimos?
            </button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-xs text-slate-300 shadow-2xl z-20 pointer-events-none"
                >
                  Pedimos tu edad real para conectar con gente de tus mismos rangos de intereses y seguridad. <strong>Esto no cambiará ni afectará tu experiencia de exploración.</strong>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative">
          <input
            type="number"
            min={13}
            max={110}
            value={data.realAge === '' ? '' : data.realAge}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
              updateData({ realAge: val });
            }}
            placeholder="Ingresa tu edad (ej. 23)"
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <p className="text-[11px] text-emerald-400/80 italic">
          ✨ Tu edad real no afectará la experiencia ni la calidad de lo que descubras aquí.
        </p>
      </div>

      {/* 5. HONESTY PLEDGE CHECKBOX */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        onClick={handleHonestyToggle}
        className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 flex items-start gap-3.5 ${
          data.agreedHonesty 
            ? 'bg-emerald-950/40 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.15)]' 
            : 'bg-slate-900/50 border-slate-700/80 hover:border-slate-600'
        }`}
      >
        <div className="mt-0.5">
          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
            data.agreedHonesty 
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm' 
              : 'border-slate-500 bg-slate-800'
          }`}>
            {data.agreedHonesty && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-950 stroke-[3]" />
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex-1 text-xs">
          <p className="font-semibold text-slate-200 select-none">
            Promesa de Honestidad Green People 🤝
          </p>
          <p className="text-slate-400 mt-1 select-none leading-relaxed">
            Prometo bajo palabra que toda esta información es verídica y real. Entiendo que en esta red buscamos personas auténticas para crear amistades sinceras y sanas.
          </p>
        </div>
      </motion.div>

      {/* SUBMIT BUTTON WITH PSYCHOLOGICAL PROGRESSION */}
      <motion.button
        type="button"
        disabled={!isComplete}
        whileHover={isComplete ? { scale: 1.02, y: -2 } : {}}
        whileTap={isComplete ? { scale: 0.98 } : {}}
        onClick={onNext}
        className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
          isComplete
            ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] cursor-pointer'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>Continuar a la Fase 2 (Foto & Verificación)</span>
      </motion.button>
    </motion.div>
  );
};
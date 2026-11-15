import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Users, Shield, Sparkles } from 'lucide-react';
import { PhaseOneIdentity } from './components/PhaseOneIdentity';
import { PhaseTwoCamera } from './components/PhaseTwoCamera';
import { PhaseThreeContinue } from './components/PhaseThreeContinue';
import { UserRegistrationData } from './types';

const INITIAL_DATA: UserRegistrationData = {
  gender: '',
  realName: '',
  username: '',
  realAge: '',
  agreedHonesty: false,
  avatarUrl: null,
  detectedAge: null,
  aiVerificationPassed: false
};

export function App() {
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [userData, setUserData] = useState<UserRegistrationData>(INITIAL_DATA);
  const [isCompletedFlow, setIsCompletedFlow] = useState(false);

  const updateUserData = (fields: Partial<UserRegistrationData>) => {
    setUserData((prev) => ({ ...prev, ...fields }));
  };

  const handlePhaseThreeFinished = () => {
    setIsCompletedFlow(true);
  };

  return (
    <main className="min-h-screen min-h-[100dvh] bg-[#0c0b0a] text-stone-100 flex flex-col justify-between relative overflow-x-hidden safe-pt safe-pb selection:bg-[#d97757] selection:text-white">
      {/* Background ambient Claude-orange lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-[#d97757]/15 rounded-full blur-[120px] sm:blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-orange-600/12 rounded-full blur-[130px] sm:blur-[150px]" />
        <div className="absolute -bottom-32 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#c2410c]/12 rounded-full blur-[120px] sm:blur-[140px]" />
        
        {/* Subtle dot pattern grid in Claude terracotta */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{ backgroundImage: 'radial-gradient(#d97757 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* TOP NAVBAR / HEADER */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f28b66] to-[#b34c26] flex items-center justify-center shadow-[0_0_24px_rgba(217,119,87,0.45)] ring-1 ring-[#f28b66]/30">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-heading">
              Green <span className="text-[#d97757]">people</span>
            </h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
              Conexiones Auténticas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-300 bg-[#191512]/80 px-3.5 py-1.5 rounded-full border border-[#d97757]/20 shadow-sm backdrop-blur-md">
          <Shield className="w-3.5 h-3.5 text-[#d97757]" />
          <span className="hidden sm:inline">Espacio 100% libre de perfiles falsos</span>
          <span className="sm:hidden text-[11px] font-medium">100% Real</span>
        </div>
      </header>

      {/* MAIN CONTAINER (Responsive for phone & PC) */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-2 sm:py-4 flex-1 flex flex-col justify-center">
        {/* PROGRESS STEPPER */}
        {!isCompletedFlow && (
          <div className="mb-5 sm:mb-7 px-2 sm:px-4">
            <div className="flex items-center justify-between relative">
              {/* Connector line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-stone-800 -z-1" />
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#d97757] to-[#ea580c] transition-all duration-500 -z-1"
                style={{ width: currentPhase === 1 ? '0%' : currentPhase === 2 ? '50%' : '100%' }}
              />

              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentPhase >= 1 
                    ? 'bg-[#d97757] text-white shadow-[0_0_16px_rgba(217,119,87,0.55)]' 
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}>
                  1
                </div>
                <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                  currentPhase >= 1 ? 'text-[#f28b66]' : 'text-stone-500'
                } hidden sm:block`}>
                  Identidad
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentPhase >= 2 
                    ? 'bg-[#d97757] text-white shadow-[0_0_16px_rgba(217,119,87,0.55)]' 
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}>
                  2
                </div>
                <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                  currentPhase >= 2 ? 'text-[#f28b66]' : 'text-stone-500'
                } hidden sm:block`}>
                  Foto & IA
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentPhase === 3 
                    ? 'bg-[#d97757] text-white shadow-[0_0_16px_rgba(217,119,87,0.55)]' 
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}>
                  3
                </div>
                <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                  currentPhase === 3 ? 'text-[#f28b66]' : 'text-stone-500'
                } hidden sm:block`}>
                  Continuar
                </span>
              </div>
            </div>
          </div>
        )}

        {/* GLASS CARD CONTAINER */}
        <div className="glass-panel p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl relative">
          <AnimatePresence mode="wait">
            {!isCompletedFlow ? (
              <>
                {currentPhase === 1 && (
                  <PhaseOneIdentity
                    key="phase1"
                    data={userData}
                    updateData={updateUserData}
                    onNext={() => setCurrentPhase(2)}
                  />
                )}

                {currentPhase === 2 && (
                  <PhaseTwoCamera
                    key="phase2"
                    data={userData}
                    updateData={updateUserData}
                    onNext={() => setCurrentPhase(3)}
                    onBack={() => setCurrentPhase(1)}
                  />
                )}

                {currentPhase === 3 && (
                  <PhaseThreeContinue
                    key="phase3"
                    data={userData}
                    onComplete={handlePhaseThreeFinished}
                  />
                )}
              </>
            ) : (
              /* State after clicking Continuar */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 sm:py-12 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#d97757]/20 border border-[#d97757]/60 flex items-center justify-center text-[#d97757] shadow-[0_0_25px_rgba(217,119,87,0.3)]">
                  <Sparkles className="w-8 h-8 animate-pulse text-[#d97757]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                  ¡Registro Fase 1-2-3 Completado!
                </h3>
                <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  Tu perfil de <strong className="text-[#f28b66]">@{userData.username}</strong> está guardado y verificado. Todo optimizado para Mozilla, Chromium y WebKit en PC y móvil.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPhase(1);
                    setIsCompletedFlow(false);
                  }}
                  className="px-5 py-2.5 text-xs rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 border border-stone-700/60 transition shadow-sm"
                >
                  Reiniciar demo de registro
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 w-full text-center py-4 sm:py-6 text-xs text-stone-500 px-4">
        <p>Green People © 2026 • Diseñado para amistades humanas, reales y cercanas.</p>
      </footer>
    </main>
  );
}

export default App;

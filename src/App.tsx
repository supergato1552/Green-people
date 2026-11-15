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
    <main className="min-h-screen bg-[#080d0a] text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-700/15 rounded-full blur-[140px]" />
        
        {/* Subtle dot pattern grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* TOP NAVBAR / HEADER */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Leaf className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white font-heading">
              Green <span className="text-emerald-400">people</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Conexiones Auténticas
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Espacio 100% libre de perfiles falsos</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        {/* PROGRESS STEPPER */}
        {!isCompletedFlow && (
          <div className="mb-6 px-4">
            <div className="flex items-center justify-between relative">
              {/* Connector line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-1" />
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 transition-all duration-500 -z-1"
                style={{ width: currentPhase === 1 ? '0%' : currentPhase === 2 ? '50%' : '100%' }}
              />

              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentPhase >= 1 
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_#10b981]' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  1
                </div>
                <span className="text-[11px] font-semibold mt-1 text-slate-400 hidden sm:block">Identidad</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentPhase >= 2 
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_#10b981]' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  2
                </div>
                <span className="text-[11px] font-semibold mt-1 text-slate-400 hidden sm:block">Foto & IA</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentPhase === 3 
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_#10b981]' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  3
                </div>
                <span className="text-[11px] font-semibold mt-1 text-slate-400 hidden sm:block">Continuar</span>
              </div>
            </div>
          </div>
        )}

        {/* GLASS CARD CONTAINER */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl relative">
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
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white">¡Registro Fase 1-2-3 Completado!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Tu perfil de <strong>@{userData.username}</strong> está guardado y verificado. Listo para la siguiente parte que me indiques.
                </p>
                <button
                  onClick={() => {
                    setCurrentPhase(1);
                    setIsCompletedFlow(false);
                  }}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Reiniciar demo de registro
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 w-full text-center py-6 text-xs text-slate-500">
        <p>Green People © 2026 • Diseñado para amistades humanas, reales y cercanas.</p>
      </footer>
    </main>
  );
}

export default App;
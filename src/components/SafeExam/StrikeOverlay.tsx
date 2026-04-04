import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock } from 'lucide-react';
import GlowButton from '../UI/GlowButton';
import GlassCard from '../UI/GlassCard';

interface StrikeOverlayProps {
  strikes: number;
  maxStrikes: number;
  lastViolation: string | null;
  onContinue: () => void;
}

const StrikeOverlay: React.FC<StrikeOverlayProps> = ({ strikes, maxStrikes, lastViolation, onContinue }) => {
  if (strikes === 0) return null;

  const isFinalStrike = strikes >= maxStrikes;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-red-950/90 backdrop-blur-3xl flex items-center justify-center p-6 text-center"
      >
        <div className="absolute inset-0 scanner-effect opacity-20" />
        
        <GlassCard className="max-w-md w-full border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-red-500/30"
          >
            {isFinalStrike ? <Lock className="text-red-400" size={48} /> : <ShieldAlert className="text-red-400" size={48} />}
          </motion.div>

          <h2 className="text-3xl font-bold text-red-400 mb-4 font-orbitron tracking-tighter">
            PROHIBITED ACTION DETECTED
          </h2>
          
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 mb-8">
            <p className="text-red-300 font-bold mb-1">VIolation ID: 0x{strikes}</p>
            <p className="text-red-100/70 text-sm">{lastViolation || "PROTOCOL_BREACH"}</p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {[...Array(maxStrikes)].map((_, i) => (
              <div 
                key={i}
                className={`w-12 h-2 rounded-full transition-all duration-500 ${
                  i < strikes ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <p className="text-red-100/60 mb-8 italic text-sm">
            {isFinalStrike 
              ? "Critical breach detected. Terminating mission and submitting current progress to Command."
              : `Warning: ${maxStrikes - strikes} attempt(s) remaining. Ensure your workspace is secure.`}
          </p>

          {!isFinalStrike && (
            <GlowButton variant="danger" className="w-full" onClick={onContinue}>
              Resume Mission & Resolve Breach
            </GlowButton>
          )}
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default StrikeOverlay;

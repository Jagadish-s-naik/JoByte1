import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import GlassCard from '../UI/GlassCard';
import GlowButton from '../UI/GlowButton';

interface MCQTaskProps {
  task?: {
    question?: string;
    description?: string;
    options: string[];
  };
  onComplete: (answer: string) => void;
}

const MCQTask: React.FC<MCQTaskProps> = ({ task, onComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!task) {
    return <div className="text-center py-10">Initializing mission data...</div>;
  }

  const handleSubmit = () => {
    if (selected) onComplete(selected);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-orbitron mb-8 text-teal-400">MISSION TASK: SYSTEM ANALYSIS</h2>
      
      <GlassCard className="mb-8">
        <p className="text-xl text-teal-100/90 leading-relaxed mb-10">
          {task.question || task.description}
        </p>
        
        <div className="space-y-4">
          {task.options?.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 10, backgroundColor: 'rgba(0, 255, 255, 0.05)' }}
              onClick={() => setSelected(option)}
              className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-4 ${
                selected === option 
                ? 'border-teal-400 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
                : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="shrink-0">
                {selected === option ? <CheckCircle2 className="text-teal-400" /> : <Circle className="text-white/20" />}
              </div>
              <span className={selected === option ? 'text-teal-400 font-bold' : 'text-teal-100/70'}>
                {option}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <GlowButton 
          disabled={!selected} 
          onClick={handleSubmit}
          className="px-12"
        >
          CONFIRM RESPONSE
        </GlowButton>
      </div>
    </div>
  );
};

export default MCQTask;

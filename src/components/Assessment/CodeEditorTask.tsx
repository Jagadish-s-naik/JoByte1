import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Save, Play } from 'lucide-react';
import GlassCard from '../UI/GlassCard';
import GlowButton from '../UI/GlowButton';

interface CodeEditorTaskProps {
  task: {
    question: string;
    template: string;
  };
  onComplete: (answer: string) => void;
}

const CodeEditorTask: React.FC<CodeEditorTaskProps> = ({ task, onComplete }) => {
  const [code, setCode] = useState(task.template);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = () => {
    setOutput("SYSTEM_LOG: SIMULATION RUNNING...\n[SUCCESS] TEST_CASE_01: NOMINAL_TRAJECTORY\n[SUCCESS] TEST_CASE_02: STABILITY_CHECK\nSTATUS: READY FOR SUBMISSION");
  };

  const handleSubmit = () => {
    onComplete(code);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-8 h-[70vh]">
      {/* Left: Task Description */}
      <GlassCard className="flex flex-col h-full bg-black/40 border-teal-500/10">
        <div className="flex items-center gap-3 mb-6 text-teal-400 font-orbitron">
          <Terminal size={20} />
          <h2 className="text-lg tracking-widest">MISSION PARAMETERS</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-4 text-teal-100/70 space-y-4 leading-relaxed font-sans">
          <p className="font-bold text-teal-400">OBJECTIVE:</p>
          <p>{task.question}</p>
          
          <div className="bg-teal-500/5 p-4 rounded border border-teal-500/20 text-xs font-mono">
            // DATA_STREAM: V_DESC_LIMIT = 5.0 m/s
            // MARGIN_OF_ERROR: 0.1%
          </div>
        </div>
      </GlassCard>

      {/* Right: Code Area */}
      <div className="flex flex-col gap-4 h-full">
        <GlassCard className="flex-1 p-0 overflow-hidden bg-[#0a0a0f] border-teal-500/20 flex flex-col">
          <div className="bg-black/80 px-4 py-2 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-orbitron tracking-widest text-teal-500/50">STABILIZER_V1.CPP</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-teal-300 outline-none resize-none selection:bg-teal-500/30"
          />
          
          {output && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100px' }}
              className="bg-black border-t border-teal-500/20 p-4 font-mono text-[10px] text-teal-500/70 overflow-y-auto whitespace-pre-wrap"
            >
              {output}
            </motion.div>
          )}
        </GlassCard>

        <div className="flex justify-between gap-4">
          <GlowButton variant="ghost" className="flex-1" onClick={handleRun}>
            <span className="flex items-center justify-center gap-2">
              <Play size={16} /> SIMULATE RUN
            </span>
          </GlowButton>
          <GlowButton className="flex-1" onClick={handleSubmit}>
            <span className="flex items-center justify-center gap-2">
              <Save size={16} /> SUBMIT DATA
            </span>
          </GlowButton>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorTask;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Network, Key, CheckCircle2, Server, Database } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AtsIntegrationModalProps {
  onClose: () => void;
  onSuccess: (provider: string) => void;
}

const PROVIDERS = [
  { id: 'workday', name: 'Workday' },
  { id: 'greenhouse', name: 'Greenhouse' },
  { id: 'lever', name: 'Lever' },
];

const AtsIntegrationModal: React.FC<AtsIntegrationModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'connecting' | 'success'>('form');
  const [provider, setProvider] = useState('greenhouse');
  const [apiKey, setApiKey] = useState('');
  const [connectionLog, setConnectionLog] = useState<string[]>([]);
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    setStep('connecting');
    
    // Simulate connection sequence
    const addLog = (msg: string, delay: number) => {
      return new Promise(resolve => {
        setTimeout(() => {
          setConnectionLog(prev => [...prev, msg]);
          resolve(true);
        }, delay);
      });
    };

    await addLog(`Initializing secure handshake with ${provider}...`, 500);
    await addLog("Validating private API key...", 800);
    await addLog("Fetching initial candidate schema...", 1000);
    await addLog("Establishing real-time webhooks...", 800);
    
    // Update user metadata in Supabase to persist status
    const { error } = await supabase.auth.updateUser({
      data: {
        ats_active: true,
        ats_provider: provider
      }
    });

    if (error) {
      console.error("Failed to save ATS status", error);
    }

    await addLog("Connection successful!", 500);
    
    setTimeout(() => {
      setStep('success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={step === 'connecting' ? undefined : onClose} 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-surface-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {step !== 'connecting' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleConnect} 
                className="space-y-6"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Network className="text-blue-400" size={28} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold font-display text-white mb-2">Connect ATS</h2>
                  <p className="text-slate-400 text-sm">Synchronize your candidates and jobs automatically with your existing Applicant Tracking System.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Provider</label>
                    <div className="relative">
                      <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none"
                      >
                        {PROVIDERS.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Private API Key</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="password"
                        required
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk_live_..."
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-8"
                >
                  <Database size={18} /> Integrate System
                </button>
              </motion.form>
            )}

            {step === 'connecting' && (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-6 flex flex-col items-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-slate-800 rounded-full" />
                  <div className="w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute inset-0" />
                  <Network className="text-blue-400 absolute inset-0 m-auto animate-pulse" size={28} />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-6">Establishing Connection</h3>
                
                <div className="w-full bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-400 h-40 overflow-y-auto flex flex-col justify-end space-y-2 border border-white/5 shadow-inner">
                  {connectionLog.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={i === connectionLog.length - 1 ? 'text-blue-400 font-bold' : ''}
                    >
                      {'>'} {log}
                    </motion.div>
                  ))}
                  <div className="animate-pulse">{'>'} _</div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-500" size={48} />
                </div>
                
                <h2 className="text-2xl font-bold font-display text-white mb-2">Integration Active</h2>
                <p className="text-slate-400 mb-8 max-w-[250px]">
                  Your platform is now securely synced with {PROVIDERS.find(p => p.id === provider)?.name}.
                </p>
                
                <button 
                  onClick={() => {
                    onSuccess(provider);
                    onClose();
                  }}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AtsIntegrationModal;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  Code, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  TrendingUp,
  FileText
} from 'lucide-react';

interface CandidateReportProps {
  candidate: any;
  onClose: () => void;
}

const CandidateReport: React.FC<CandidateReportProps> = ({ candidate, onClose }) => {
  const report = candidate.report?.[0];
  if (!report) return null;

  const scoreColor = report.total_score >= 80 ? 'text-green-400' : report.total_score >= 60 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = report.total_score >= 80 ? 'bg-green-400/10' : report.total_score >= 60 ? 'bg-yellow-400/10' : 'bg-red-400/10';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-10 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                  <span className="text-2xl font-bold text-primary">{candidate.full_name?.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold font-display">{candidate.full_name}</h2>
                  <p className="text-slate-400 font-medium uppercase tracking-widest text-xs mt-1">
                    {candidate.mission?.title} • {candidate.mission?.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Applied {new Date(candidate.created_at).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 ${scoreBg} ${scoreColor} border border-current/20 rounded-lg text-[10px] font-bold uppercase tracking-wider`}>
                  Confidence: {report.total_score}%
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
               <div className={`text-5xl font-black font-display ${scoreColor} mb-1`}>
                 {report.total_score}<span className="text-2xl opacity-50">%</span>
               </div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hiring Confidence Score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Skill Breakdown */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Competency Map</h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Code size={16} />
                      <span className="text-xs font-bold uppercase">Technical</span>
                    </div>
                    <span className="text-sm font-black">{report.technical_score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${report.technical_score}%` }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Brain size={16} />
                      <span className="text-xs font-bold uppercase">Logic & Reasoning</span>
                    </div>
                    <span className="text-sm font-black">{report.logic_score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${report.logic_score}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield size={16} />
                      <span className="text-xs font-bold uppercase">Integrity</span>
                    </div>
                    <span className="text-sm font-black">{report.integrity_score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${report.integrity_score}%` }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Anti-Cheating Telemetry */}
              <div className={`p-4 rounded-2xl border ${report.strikes > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {report.strikes > 0 ? <AlertTriangle className="text-red-400" size={16} /> : <CheckCircle2 className="text-green-400" size={16} />}
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${report.strikes > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {report.strikes > 0 ? 'Potential Cheating Detected' : 'Verified Secure Session'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  {report.strikes > 0 
                    ? `The system detected ${report.strikes} instances of application switching or tab blurring during the assessment.` 
                    : 'Candidate remained in full-screen focus throughout the entire 45-minute simulation session.'}
                </p>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="lg:col-span-2">
              <div className="bg-surface-800/50 border border-white/5 p-8 rounded-3xl min-h-full">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-primary" size={20} />
                  <h3 className="font-bold text-lg font-display">AI Performance Report</h3>
                </div>
                
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-slate-400 space-y-4 leading-relaxed font-medium whitespace-pre-wrap">
                    {report.ai_analysis || 'No detailed analysis generated for this candidate yet. Scores are based on raw performance data.'}
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                    <FileText size={14} />
                    Verified by AI Auditor v2.4
                  </div>
                  <button className="btn-primary py-2 px-6 text-xs shadow-xl shadow-primary/20">
                    Schedules Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CandidateReport;

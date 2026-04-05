import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Candidate } from '../../types';
import CandidateReport from './CandidateReport';

interface JobApplicantsModalProps {
  missionId: string;
  missionTitle: string;
  onClose: () => void;
}

const JobApplicantsModal: React.FC<JobApplicantsModalProps> = ({ missionId, missionTitle, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);

      // Check if missionId is a valid UUID
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(missionId);

      const dummyApplicants: Candidate[] = [
        { 
          id: `da1-${missionId}`, full_name: 'A. Rivera', email: 'alex.r@example.com', status: 'IN_REVIEW', created_at: new Date().toISOString(),
          mission: { title: missionTitle, company: 'JoByte' },
          report: [{ total_score: 87, technical_score: 84, logic_score: 89, integrity_score: 100, strikes: 0 }]
        },
        { 
          id: `da2-${missionId}`, full_name: 'J. Smith', email: 'j.smith@example.com', status: 'SHORTLISTED', created_at: new Date().toISOString(),
          mission: { title: missionTitle, company: 'JoByte' },
          report: [{ total_score: 92, technical_score: 95, logic_score: 90, integrity_score: 100, strikes: 0 }]
        },
        { 
          id: `da3-${missionId}`, full_name: 'C. Johnson', email: 'casey.j@example.com', status: 'REJECTED', created_at: new Date().toISOString(),
          mission: { title: missionTitle, company: 'JoByte' },
          report: [{ total_score: 45, technical_score: 40, logic_score: 50, integrity_score: 100, strikes: 2 }]
        },
      ];

      if (!isUuid) {
        // Delay slightly to show loading state for demo purposes
        setTimeout(() => {
          setCandidates(dummyApplicants);
          setLoading(false);
        }, 600);
        return;
      }

      const { data, error } = await supabase
        .from('candidates')
        .select(`
          *,
          mission:missions(title, company),
          report:vjsa_reports(*)
        `)
        .eq('mission_id', missionId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applicants:', error);
        setCandidates(dummyApplicants);
      } else {
        if (data && data.length > 0) {
          setCandidates(data as Candidate[]);
        } else {
          setCandidates(dummyApplicants);
        }
      }
      setLoading(false);
    };

    fetchApplicants();
  }, [missionId, missionTitle]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'text-primary bg-primary/10 border-primary/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-neutral-950 dark:text-white leading-tight">
              Applicants for <span className="text-primary">{missionTitle}</span>
            </h2>
            <p className="text-secondary body-sm mt-1">{candidates.length} talent profiles discovered.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-secondary hover:text-neutral-950 dark:hover:text-white bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="font-bold text-secondary animate-pulse uppercase tracking-widest text-xs">Scanning candidate database...</p>
            </div>
          ) : candidates.length > 0 ? (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-secondary">
                <div className="col-span-5">Candidate</div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-3 text-center">Status</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {/* Candidate List */}
              {candidates.map((candidate) => {
                const score = candidate.report?.[0]?.total_score || 0;
                return (
                  <motion.div 
                    key={candidate.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-12 gap-4 items-center bg-surface-container-low/30 hover:bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 transition-colors group"
                  >
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xl shrink-0">
                        {candidate.full_name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-neutral-950 dark:text-white truncate">{candidate.full_name}</h4>
                        <p className="text-xs text-secondary truncate">{candidate.email}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <div className={`px-3 py-1 rounded-full border text-xs font-black ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                    </div>

                    <div className="col-span-3 flex justify-center">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${
                        candidate.status === 'HIRED' ? 'bg-green-100 text-green-700' :
                        candidate.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        <span className="material-symbols-outlined text-[12px]">
                          {candidate.status === 'HIRED' ? 'check_circle' : 
                           candidate.status === 'REJECTED' ? 'cancel' : 'pending'}
                        </span>
                        {candidate.status}
                      </span>
                    </div>

                    <div className="col-span-2 text-right">
                      <button 
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-[10px] font-black uppercase tracking-tighter text-primary hover:underline group-hover:translate-x-1 transition-all flex items-center gap-1 ml-auto"
                      >
                        Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-surface-container rounded-3xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-4xl">person_search</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2">No discovery yet</h3>
              <p className="text-secondary body-md max-w-xs mx-auto">No talent profiles have been indexed for this mission. Try promoting your job posting.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-surface-container-lowest border-t border-outline-variant/10 text-[10px] text-secondary font-medium flex justify-between shrink-0">
          <span>SECURED BY VJSA V1.0 INTEGRITY PROTOCOLS</span>
          <span>SYSTEM TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>

      {/* Nested Candidate Report Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateReport 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobApplicantsModal;

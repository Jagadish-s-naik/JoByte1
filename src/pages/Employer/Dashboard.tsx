import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { AnimatePresence } from 'framer-motion';
import CreateJobModal from '../../components/Employer/CreateJobModal';
import CandidateReport from '../../components/Employer/CandidateReport';
import AtsIntegrationModal from '../../components/Employer/AtsIntegrationModal';
import JobApplicantsModal from '../../components/Employer/JobApplicantsModal';
import type { JobPosting, Candidate } from '../../types';

interface Stats {
  label: string;
  value: string;
}

interface AtsStatus {
  active: boolean;
  provider?: string;
}

const EmployerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeJobs, setActiveJobs] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobPosting | null>(null);
  const [stats, setStats] = useState<Stats[]>([
    { label: 'Total Job Postings', value: '0' },
    { label: 'Active Applicants', value: '0' },
    { label: 'Successful Hires', value: '0' },
    { label: 'In Review', value: '0' },
  ]);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [atsStatus, setAtsStatus] = useState<AtsStatus>({ active: false });

  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (session.user.user_metadata?.ats_active) {
      setAtsStatus({ 
        active: true, 
        provider: session.user.user_metadata.ats_provider 
      });
    }

    const { data: jobsData } = await supabase
      .from('missions')
      .select(`
        id, title, type, location,
        candidates(count)
      `)
      .eq('employer_id', session.user.id)
      .order('created_at', { ascending: false });

    if (jobsData) {
      setActiveJobs(jobsData as JobPosting[]);
      setStats(prev => [
        { ...prev[0], value: jobsData.length.toString() },
        { ...prev[1], value: (jobsData as JobPosting[]).reduce((acc: number, job: JobPosting) => acc + (job.candidates?.[0]?.count || 0), 0).toString() },
        prev[2],
        prev[3]
      ]);
    }

    const { data: candidatesData } = await supabase
      .from('candidates')
      .select(`
        *,
        mission:missions(title, company),
        report:vjsa_reports(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (candidatesData) {
      setCandidates(candidatesData as Candidate[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-[28px] font-black text-neutral-950 dark:text-white leading-tight">
              Enterprise <span className="text-primary">Recruitment Hub</span>
            </h1>
            <p className="text-secondary body-md mt-1">Manage your precision-engineered talent acquisition pipeline.</p>
          </div>
          <button 
            onClick={() => setIsCreateJobOpen(true)}
            className="bg-primary text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-container scale-95 active:scale-100 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Job Posting
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/20 shadow-[0px_12px_32px_rgba(13,13,13,0.02)]">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-neutral-950 dark:text-white">{stat.value}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: Active Postings */}
          <div className="lg:w-[58%]">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Active Job Postings</h2>
              <a className="text-primary text-sm font-bold hover:underline transition-all" href="/jobs">Manage All ›</a>
            </div>
            
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-6 hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined text-primary">work</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-950 dark:text-white text-lg">{job.title}</h3>
                        <p className="text-sm text-secondary font-medium mt-0.5">{job.type} • {job.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-sm">group</span>
                      <span className="text-sm font-bold text-neutral-950 dark:text-white">{job.candidates?.[0]?.count || 0} Applicants</span>
                    </div>
                    <button 
                      onClick={() => setSelectedJobForModal(job)}
                      className="text-xs font-black uppercase tracking-tighter text-primary group-hover:translate-x-1 transition-transform"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Tools & Feed */}
          <div className="lg:w-[40%] space-y-8">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-950 dark:text-white mb-6">Qualified Feed</h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    onClick={() => setSelectedCandidate(candidate)}
                    className="py-4 flex items-center justify-between hover:bg-surface-container-lowest/50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                        {candidate.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-950 dark:text-white group-hover:text-primary transition-colors">{candidate.full_name}</h4>
                        <p className="text-xs text-secondary mt-0.5">{candidate.mission?.title}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className={`text-sm font-bold ${(candidate.report?.[0]?.total_score || 0) > 80 ? 'text-green-600' : 'text-primary'}`}>
                        {candidate.report?.[0]?.total_score || 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Integration Card */}
            <div className={`border rounded-lg p-6 ${atsStatus.active ? 'bg-green-50/50 border-green-200' : 'bg-slate-100/50 dark:bg-neutral-900 border-outline-variant/20'}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-2 rounded-lg ${atsStatus.active ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined">{atsStatus.active ? 'check_circle' : 'info'}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-950 dark:text-white">ATS Integration</h2>
                  <p className="text-xs text-secondary mt-1">
                    {atsStatus.active 
                      ? "ATS Integration active." 
                      : "Connect JoByte to your internal HR tools."}
                  </p>
                </div>
              </div>
              {!atsStatus.active && (
                <button 
                  onClick={() => setIsAtsOpen(true)}
                  className="w-full bg-neutral-950 text-white font-bold py-3 rounded-lg hover:bg-neutral-800 transition-all">
                  Setup Integration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateReport 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
        
        {selectedJobForModal && (
          <JobApplicantsModal 
            missionId={selectedJobForModal.id}
            missionTitle={selectedJobForModal.title}
            onClose={() => setSelectedJobForModal(null)}
          />
        )}
        
        {isCreateJobOpen && (
          <CreateJobModal 
            onClose={() => setIsCreateJobOpen(false)}
            onSuccess={() => {
              fetchData();
            }}
          />
        )}

        {isAtsOpen && (
          <AtsIntegrationModal
            onClose={() => setIsAtsOpen(false)}
            onSuccess={(provider) => {
              setAtsStatus({ active: true, provider });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployerDashboard;


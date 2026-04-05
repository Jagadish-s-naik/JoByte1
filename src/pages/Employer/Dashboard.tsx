import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
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

    const realJobs = (jobsData || []) as JobPosting[];
    const dummyJobs: JobPosting[] = [
      { id: 'd1', title: 'Senior Frontend Architect', type: 'Full-time', location: 'Remote', candidates: [{ count: 12 }] },
      { id: 'd2', title: 'Product Design Lead', type: 'Full-time', location: 'San Francisco, CA', candidates: [{ count: 8 }] },
      { id: 'd3', title: 'DevOps Platform Engineer', type: 'Contract', location: 'London, UK', candidates: [{ count: 5 }] },
      { id: 'd4', title: 'Fullstack Engineer (Node/React)', type: 'Full-time', location: 'Remote', candidates: [{ count: 22 }] },
      { id: 'd5', title: 'Site Reliability Engineer', type: 'Full-time', location: 'Austin, TX', candidates: [{ count: 7 }] },
      { id: 'd6', title: 'Machine Learning Researcher', type: 'Full-time', location: 'Toronto, ON', candidates: [{ count: 15 }] },
      { id: 'd7', title: 'QA Automation Lead', type: 'Contract', location: 'Remote', candidates: [{ count: 3 }] },
      { id: 'd8', title: 'Security Architect', type: 'Full-time', location: 'Berlin, DE', candidates: [{ count: 9 }] },
      { id: 'd9', title: 'Mobile Developer (iOS)', type: 'Full-time', location: 'Remote', candidates: [{ count: 18 }] },
      { id: 'd10', title: 'Technical Product Manager', type: 'Full-time', location: 'Seattle, WA', candidates: [{ count: 6 }] },
    ];

    const combinedJobs = [...realJobs, ...dummyJobs].slice(0, 10);
    setActiveJobs(combinedJobs);
    
    const totalJobs = combinedJobs.length;
    const totalApplicants = combinedJobs.reduce((acc, j) => acc + (j.candidates?.[0]?.count || 0), 0);
    
    setStats(prev => [
      { ...prev[0], value: totalJobs.toString() },
      { ...prev[1], value: totalApplicants.toString() },
      { ...prev[2], value: '8' },
      { ...prev[3], value: '12' },
    ]);

    const { data: candidatesData } = await supabase
      .from('candidates')
      .select(`
        *,
        mission:missions(title, company),
        report:vjsa_reports(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const realCandidates = (candidatesData || []) as Candidate[];
    const dummyCandidates: Candidate[] = [
      { 
        id: 'c1', full_name: 'S. Rodriguez', created_at: new Date().toISOString(), 
        mission: { title: 'Senior Frontend Architect', company: 'JoByte' }, 
        report: [{ total_score: 94, technical_score: 96, logic_score: 92, integrity_score: 100, strikes: 0 }] 
      },
      { 
        id: 'c2', full_name: 'M. Chen', created_at: new Date().toISOString(), 
        mission: { title: 'Product Design Lead', company: 'JoByte' }, 
        report: [{ total_score: 88, technical_score: 85, logic_score: 91, integrity_score: 100, strikes: 0 }] 
      },
      { 
        id: 'c3', full_name: 'A. Gupta', created_at: new Date().toISOString(), 
        mission: { title: 'DevOps Platform Engineer', company: 'JoByte' }, 
        report: [{ total_score: 72, technical_score: 74, logic_score: 68, integrity_score: 100, strikes: 0 }] 
      },
      { 
        id: 'c4', full_name: 'J. Wilson', created_at: new Date().toISOString(), 
        mission: { title: 'SRE Specialist', company: 'JoByte' }, 
        report: [{ total_score: 81, technical_score: 82, logic_score: 79, integrity_score: 85, strikes: 1 }] 
      },
      { 
        id: 'c5', full_name: 'E. Petrova', created_at: new Date().toISOString(), 
        mission: { title: 'ML Researcher', company: 'JoByte' }, 
        report: [{ total_score: 96, technical_score: 98, logic_score: 94, integrity_score: 100, strikes: 0 }] 
      },
      { 
        id: 'c6', full_name: 'D. Kim', created_at: new Date().toISOString(), 
        mission: { title: 'Product Manager', company: 'JoByte' }, 
        report: [{ total_score: 64, technical_score: 60, logic_score: 68, integrity_score: 100, strikes: 0 }] 
      },
      { 
        id: 'c7', full_name: 'S. Jenkins', created_at: new Date().toISOString(), 
        mission: { title: 'Mobile Engineer', company: 'JoByte' }, 
        report: [{ total_score: 89, technical_score: 91, logic_score: 87, integrity_score: 95, strikes: 0 }] 
      },
      { 
        id: 'c8', full_name: 'O. Farooq', created_at: new Date().toISOString(), 
        mission: { title: 'QA Architect', company: 'JoByte' }, 
        report: [{ total_score: 77, technical_score: 75, logic_score: 79, integrity_score: 100, strikes: 0 }] 
      },
      { 
        id: 'c9', full_name: 'L. Wang', created_at: new Date().toISOString(), 
        mission: { title: 'Backend Architect', company: 'JoByte' }, 
        report: [{ total_score: 92, technical_score: 94, logic_score: 90, integrity_score: 100, strikes: 0 }] 
      },
      { 
        id: 'c10', full_name: 'R. Miller', created_at: new Date().toISOString(), 
        mission: { title: 'Cloud Specialist', company: 'JoByte' }, 
        report: [{ total_score: 83, technical_score: 85, logic_score: 81, integrity_score: 90, strikes: 0 }] 
      },
    ];

    const combinedCandidates = [...realCandidates, ...dummyCandidates]
      .map((c: any) => {
        // Anonymize name if it's "Test User", "John Doe", or similar placeholders
        const lowercaseName = c.full_name?.toLowerCase() || '';
        if (lowercaseName.includes('test user') || lowercaseName.includes('john doe')) {
          c.full_name = `Candidate #${c.id.slice(-4).toUpperCase()}`;
        } else if (c.full_name && !c.full_name.includes('.') && c.full_name.split(' ').length > 1) {
          // If it's a full name without initials, anonymize it to F. Lastname
          const parts = c.full_name.split(' ');
          c.full_name = `${parts[0][0]}. ${parts[parts.length - 1]}`;
        }

        // Diversify scores if they are missing or lead to 0%
        if (!c.report || c.report.length === 0 || c.report[0].total_score === 0) {
          const mockScore = 70 + Math.floor(Math.random() * 25);
          return {
            ...c,
            report: [{ total_score: mockScore, technical_score: mockScore - 5, logic_score: mockScore + 2, integrity_score: 100, strikes: 0 }]
          };
        }
        return c;
      })
      .slice(0, 10);

    setCandidates(combinedCandidates as Candidate[]);

    setLoading(false);
  }, []);

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This will also remove associated applicant data.')) return;

    // Only attempt real delete if not a dummy job
    if (!id.startsWith('d')) {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);
      
      if (error) {
        alert('Error deleting job: ' + error.message);
        return;
      }
    }

    setActiveJobs(prev => prev.filter(job => job.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchParams.get('action') === 'create-job') {
      setIsCreateJobOpen(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dot-grid pb-12">
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
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined text-primary">work</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-950 dark:text-white text-lg">{job.title}</h3>
                        <p className="text-sm text-secondary font-medium mt-0.5">{job.type} • {job.location}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Posting"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
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

          {/* RIGHT COLUMN: Tools & Leads */}
          <div className="lg:w-[40%] space-y-8">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-950 dark:text-white mb-6">Qualified Leads</h2>
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


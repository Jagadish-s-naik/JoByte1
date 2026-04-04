import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Search, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/layout/Navbar';
import CandidateReport from '../../components/Employer/CandidateReport';
import CreateJobModal from '../../components/Employer/CreateJobModal';
import AtsIntegrationModal from '../../components/Employer/AtsIntegrationModal';

interface JobPosting {
  id: string;
  title: string;
  type: string;
  location: string;
  candidates: { count: number }[];
}

interface Candidate {
  id: string;
  full_name: string;
  created_at: string;
  mission?: { title: string; company: string };
  report?: any[];
}

const EmployerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeJobs, setActiveJobs] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [stats, setStats] = useState([
    { label: 'Total Job Postings', value: '0', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Applicants', value: '0', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Successful Hires', value: '0', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'In Review', value: '0', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ]);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [atsStatus, setAtsStatus] = useState<{ active: boolean; provider?: string }>({ active: false });

  const fetchData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Check ATS Status from metadata
    if (session.user.user_metadata?.ats_active) {
      setAtsStatus({ 
        active: true, 
        provider: session.user.user_metadata.ats_provider 
      });
    }

    // Fetch Jobs
      const { data: jobsData } = await supabase
        .from('missions')
        .select(`
          id, title, type, location,
          candidates(count)
        `)
        .eq('employer_id', session.user.id);

      if (jobsData) {
        setActiveJobs(jobsData as JobPosting[]);
        setStats(prev => [
          { ...prev[0], value: jobsData.length.toString() },
          { ...prev[1], value: (jobsData as JobPosting[]).reduce((acc: number, job: JobPosting) => acc + (job.candidates?.[0]?.count || 0), 0).toString() },
          prev[2],
          prev[3]
        ]);
      }

      // Fetch Candidates with Reports
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
        setCandidates(candidatesData);
      }

      setLoading(false);
    };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-display">
              Enterprise <span className="text-primary">Recruitment Hub</span>
            </h1>
            <p className="text-slate-400 mt-1">Manage your team and track performance with real-time analytics.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCreateJobOpen(true)}
              className="btn-primary py-3 px-6 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              Create Job Posting
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-900 border border-white/5 p-6 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                  <TrendingUp size={12} />
                  <span>+8.2%</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Job Postings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display">Active Job Postings</h2>
              <button className="text-primary hover:text-primary-600 text-sm font-medium flex items-center gap-1">
                Manage All <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-surface-900 border border-white/5 p-6 rounded-3xl hover:border-primary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-all">
                      <Briefcase className="text-primary" size={24} />
                    </div>
                    <button className="text-slate-500 hover:text-white">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{job.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{job.type} • {job.location}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, job.candidates?.[0]?.count || 0))].map((_, j) => (
                        <div key={j} className="h-8 w-8 rounded-full border-2 border-surface-900 bg-surface-800 flex items-center justify-center text-[10px] font-bold">
                          {String.fromCharCode(65 + j)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-400">{job.candidates?.[0]?.count || 0} Applicants</span>
                  </div>
                </motion.div>
              ))}
              {activeJobs.length === 0 && (
                <div className="col-span-full py-12 text-center bg-surface-900 border border-dashed border-white/10 rounded-3xl">
                   <p className="text-slate-500">No active job postings yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Talent Feed */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display">Qualified Feed</h2>
              <button className="text-slate-500 hover:text-white transition-colors">
                <Search size={20} />
              </button>
            </div>

            <div className="bg-surface-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
              {candidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  onClick={() => setSelectedCandidate(candidate)}
                  className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-primary/20 border border-white/10 flex items-center justify-center font-bold text-primary">
                      {candidate.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{candidate.full_name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{candidate.mission?.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${candidate.report?.[0]?.total_score > 80 ? 'text-green-400' : 'text-primary'}`}>
                      {candidate.report?.[0]?.total_score || 'N/A'}%
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Confidence</p>
                  </div>
                </motion.div>
              ))}
              {candidates.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No applicants found.
                </div>
              )}
            </div>

            <div className={`border p-6 rounded-3xl ${atsStatus.active ? 'bg-green-500/10 border-green-500/20' : 'bg-gradient-to-br from-indigo-500/10 to-transparent border-white/5'}`}>
              <div className="flex items-center gap-3 mb-4">
                {atsStatus.active ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <AlertCircle className="text-indigo-400" size={20} />
                )}
                <h3 className="font-bold">ATS Integration</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {atsStatus.active 
                  ? `Successfully synced with ${atsStatus.provider?.charAt(0).toUpperCase()}${atsStatus.provider?.slice(1) || 'provider'}. Real-time candidate sync is active.` 
                  : "Connect your existing ATS to sync candidates and automate the simulation workflow."}
              </p>
              {!atsStatus.active && (
                <button 
                  onClick={() => setIsAtsOpen(true)}
                  className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10"
                >
                  Setup Integration
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals Container */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateReport 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
        
        {isCreateJobOpen && (
          <CreateJobModal 
            onClose={() => setIsCreateJobOpen(false)}
            onSuccess={() => {
              // Re-fetch data upon successful job creation
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

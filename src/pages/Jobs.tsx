import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Task {
  id: string;
  type: string;
  title?: string;
  description?: string;
  question?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  vjsa_difficulty: string;
  posted_at: string;
  created_at?: string;
  description?: string;
  tasks?: Task[];
}

const getDaysAgo = (dateStr?: string) => {
  if (!dateStr) return 'Just now';
  const days = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
  if (days === 0) return 'Just now';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = ['All', 'Engineering', 'Design', 'Data', 'DevOps', 'Security', 'Mobile'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const getLevelLabel = (clearance: string) => {
          const mapping: Record<string, string> = {
            'Alpha': 'Junior',
            'Beta': 'Mid-Level',
            'Gamma': 'Senior'
          };
          return mapping[clearance] || 'Mid-Level';
        };

        const mappedJobs: Job[] = (data || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          company: m.company,
          location: m.location || 'Remote',
          type: m.type || 'Full-time',
          salary: m.salary || '$80k - $120k',
          tags: m.tags || ['React', 'Next.js', 'Typescript'],
          vjsa_difficulty: getLevelLabel(m.clearance),
          created_at: m.created_at,
          posted_at: getDaysAgo(m.created_at),
          description: m.description,
          tasks: m.tasks
        }));

        setJobs(mappedJobs);
      } catch (err) {
        console.error('Job fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setRole(session.user.user_metadata?.role || 'applicant');
      }
    };

    fetchJobs();
    fetchAuth();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = job.location.toLowerCase().includes(locationSearch.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                           job.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                           (selectedCategory === 'Security' && job.tags.some(t => t.toLowerCase().includes('cybersecurity'))) ||
                           (selectedCategory === 'DevOps' && job.tags.some(t => t.toLowerCase().includes('aws') || t.toLowerCase().includes('kubernetes')));

    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex flex-col">
      <main className="dot-grid flex-1 pb-24">
        {/* Hero Bar */}
        <section className="max-w-[900px] mx-auto pt-16 pb-8 px-6">
          <div className="flex items-center gap-4 mb-4">
            {user && (
              <Link 
                to={role === 'employer' ? '/employer/dashboard' : '/applicant/dashboard'}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-colors text-neutral-500 group mt-1.5 md:mt-2.5"
              >
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </Link>
            )}
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-neutral-950 italic">
              Find your next <span className="text-primary">Career Leap</span>
            </h1>
          </div>
          <p className="text-neutral-500 font-medium tracking-tight text-center">Access the world's most exclusive engineering and architecture roles.</p>
        </section>

        {/* Search Bar Section */}
        <div className="max-w-[900px] mx-auto px-6 mb-12">
          <div className="bg-white border border-outline-variant/40 rounded-xl h-16 shadow-2xl flex items-center px-2 py-2">
            <div className="flex-1 flex items-center px-4 gap-3">
              <span className="material-symbols-outlined text-primary group-focus-within:scale-110 transition-transform">search</span>
              <input 
                className="w-full border-none focus:ring-0 focus:outline-none text-sm font-bold placeholder:text-neutral-400 placeholder:font-medium" 
                placeholder="Job title, skills or keywords" 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxLength={250}
              />
            </div>
            <div className="h-8 w-[1px] bg-neutral-200"></div>
            <div className="flex-1 flex items-center px-4 gap-3 hidden sm:flex">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <input 
                className="w-full border-none focus:ring-0 focus:outline-none text-sm font-bold placeholder:text-neutral-400 placeholder:font-medium" 
                placeholder="Location or Remote" 
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                maxLength={250}
              />
            </div>
            <button 
              onClick={() => {
                // Focus search or scroll to results
                document.getElementById('results-start')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary text-white px-8 h-full rounded-lg font-black text-[10px] tracking-widest uppercase hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Search Jobs
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary/20' 
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:border-primary hover:text-primary hover:bg-primary/5'
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setLocationSearch('');
                  setSelectedCategory('All');
                }}
                className="flex items-center gap-2 px-4 py-2 text-neutral-400 font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div id="results-start" className="max-w-[900px] mx-auto px-6 flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-secondary tracking-tight font-medium animate-pulse">Fetching opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-outline-variant/40 rounded-lg bg-surface-container-lowest">
              <span className="material-symbols-outlined text-4xl text-neutral-400 mb-4 block">search_off</span>
              <p className="text-secondary">No current openings matching your criteria.</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <div key={job.id} className="group bg-white border border-outline-variant/40 rounded-xl p-6 transition-all hover:border-t-[3px] hover:border-t-primary shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">work</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-950 mb-1 leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex items-center flex-wrap gap-3 text-sm text-neutral-500 font-medium">
                        <span className="font-bold text-neutral-900">{job.company}</span>
                        <span className="material-symbols-outlined text-xs text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <span className="material-symbols-outlined text-sm">payments</span>
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                    {index === 0 && (
                      <span className="px-3 py-1 bg-[#E53935] text-white text-[10px] font-black tracking-widest uppercase rounded-full">TOP MATCH</span>
                    )}
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2 text-neutral-600 font-bold text-xs uppercase tracking-widest hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#FFF1F0] text-primary text-[10px] font-bold rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={async () => {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (!session) {
                        navigate('/login', { state: { from: `/assessment/${job.id}` } });
                        return;
                      }
                      const role = session.user.user_metadata?.role;
                      if (role === 'employer') {
                        alert('Employers cannot take assessments.');
                        return;
                      }
                      navigate(`/assessment/${job.id}`);
                    }}
                    className="group/btn ml-auto flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-1 transition-transform"
                  >
                    Start Assessment 
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
            ))
          )}
          </div>
      </main>

      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-primary p-8 text-white relative">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className="flex gap-4 items-center mb-4">
                  <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-black tracking-widest uppercase rounded-full">
                    {selectedJob.vjsa_difficulty} Opportunity
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-black tracking-widest uppercase rounded-full">
                    {selectedJob.type}
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-2">{selectedJob.title}</h2>
                <p className="text-white/80 font-bold tracking-tight text-lg">{selectedJob.company}</p>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 pt-6">
                <div className="flex flex-wrap gap-6 mb-8 border-b border-neutral-100 pb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Location</p>
                      <p className="font-bold text-neutral-900">{selectedJob.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Salary Range</p>
                      <p className="font-bold text-neutral-900">{selectedJob.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Posted</p>
                      <p className="font-bold text-neutral-900">{selectedJob.posted_at}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-black uppercase tracking-widest text-neutral-950 mb-4">Mission Scope</h4>
                  <p className="text-neutral-600 leading-relaxed font-medium whitespace-pre-line">
                    {selectedJob.description || "No detailed description provided for this mission."}
                  </p>
                </div>

                <div className="mb-8 p-6 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-neutral-950">Assessment Details</h4>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">VJSA V1.0 - PROTECTED</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <span className="material-symbols-outlined text-primary text-xl">verified</span>
                      <p className="text-sm font-medium text-neutral-600">This mission requires a <strong>{selectedJob.vjsa_difficulty} level</strong> verification through our proprietary Virtual Skills Assessment.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border border-neutral-100">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Task Count</p>
                        <p className="font-bold text-neutral-950">{selectedJob.tasks?.length || 0} Challenges</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-neutral-100">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Time Estimate</p>
                        <p className="font-bold text-neutral-950">~30 Minutes</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-neutral-100 bg-white flex items-center justify-between">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="px-6 py-3 text-neutral-500 font-bold text-sm tracking-tight hover:text-neutral-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                      navigate('/login', { state: { from: `/assessment/${selectedJob!.id}` } });
                      return;
                    }
                    if (session.user.user_metadata?.role === 'employer') {
                      alert('Employers cannot take assessments.');
                      return;
                    }
                    navigate(`/assessment/${selectedJob!.id}`);
                  }}
                  className="bg-primary text-white px-10 py-3 rounded-lg font-black text-xs tracking-widest uppercase hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  Initiate Assessment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;

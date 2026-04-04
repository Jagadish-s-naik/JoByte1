import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Filter, 
  Sparkles,
  Building2,
  DollarSign,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';

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
  description?: string;
}

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales'];

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

        const mappedJobs: Job[] = (data || []).map(m => ({
          id: m.id,
          title: m.title,
          company: m.company,
          location: m.location || 'Remote',
          type: m.type || 'Full-time',
          salary: m.salary || '$80k - $120k',
          tags: m.tags || ['React', 'Next.js', 'Typescript'],
          vjsa_difficulty: getLevelLabel(m.clearance),
          posted_at: '2 days ago'
        }));

        setJobs(mappedJobs);
      } catch (err) {
        console.error('Job fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || job.tags.includes(selectedCategory))
  );

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header section with Search */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-6"
          >
            Find your next <span className="text-primary font-bold">Career Leap</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Explore verified opportunities across top tech companies. 
            Level up your candidacy with our AI-driven simulation engine.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="absolute inset-x-0 inset-y-0 bg-primary/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row gap-4 bg-surface-900/50 backdrop-blur-xl border border-white/5 p-2 rounded-2xl shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company..."
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="h-full w-px bg-white/5 mx-2 hidden md:block" />
              <div className="flex items-center px-4 gap-2 text-slate-400">
                <MapPin size={18} />
                <span className="text-sm font-medium">Remote Available</span>
              </div>
              <button className="btn-primary h-14 px-10 flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20">
                Search Jobs
              </button>
            </div>
          </motion.div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-10 bg-white/5 mx-2 hidden sm:block" />
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-900 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all text-sm font-medium">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 text-sm font-medium animate-pulse">Syncing career opportunities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-surface-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-3xl group hover:border-primary/40 hover:bg-surface-900/60 transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Confidence Highlight */}
                  {index === 0 && (
                    <div className="absolute top-0 right-0 py-1.5 px-4 bg-primary/20 border-b border-l border-primary/30 rounded-bl-2xl">
                      <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest">
                        <Sparkles size={12} /> Top Match
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex gap-5 items-start">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-indigo-500/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-all">
                        <Building2 className="text-primary" size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400" /> {job.company}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-green-400" /> {job.salary}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-400">{job.vjsa_difficulty}</span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-400">{job.type}</span>
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
                            alert('Employers cannot take assessments. Please use an applicant account.');
                            return;
                          }
                          navigate(`/assessment/${job.id}`);
                        }}
                        className="w-full md:w-auto btn-primary py-2.5 px-6 font-bold text-sm flex items-center justify-center gap-2 group/btn shadow-xl shadow-primary/10 hover:shadow-primary/20"
                      >
                        Start Assessment <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Clock size={14} /> 
                      <span>{job.posted_at}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredJobs.length === 0 && !loading && (
              <div className="py-20 text-center bg-surface-900/20 border border-dashed border-white/10 rounded-[2rem]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">No jobs found matching your search</h3>
                <p className="text-slate-500">Try adjusting your filters or searching for different keywords.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;

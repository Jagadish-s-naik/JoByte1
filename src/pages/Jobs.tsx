import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
          posted_at: getDaysAgo(m.created_at)
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
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || job.tags.includes(selectedCategory))
  );

  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex flex-col">
      <main className="dot-grid flex-1 pb-24">
        {/* Hero Bar */}
        <section className="max-w-[900px] mx-auto pt-16 pb-8 px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-neutral-950 mb-4">
            Find your next <span className="text-primary">Career Leap</span>
          </h1>
          <p className="text-neutral-500 font-medium tracking-tight">Access the world's most exclusive engineering and architecture roles.</p>
        </section>

        {/* Search Bar Section */}
        <div className="max-w-[900px] mx-auto px-6 mb-12">
          <div className="bg-white border border-outline-variant/40 rounded-lg h-16 shadow-xl flex items-center px-2">
            <div className="flex-1 flex items-center px-4 gap-3">
              <span className="material-symbols-outlined text-neutral-400">search</span>
              <input 
                className="w-full border-none focus:ring-0 text-sm font-medium placeholder:text-neutral-400" 
                placeholder="Job title or keywords" 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-neutral-200"></div>
            <div className="flex-1 flex items-center px-4 gap-3 hidden sm:flex">
              <span className="material-symbols-outlined text-neutral-400">location_on</span>
              <input 
                className="w-full border-none focus:ring-0 text-sm font-medium placeholder:text-neutral-400" 
                placeholder="Location or Remote" 
                type="text"
              />
            </div>
            <button className="bg-primary text-white px-8 h-12 rounded-lg font-bold text-sm tracking-tight hover:brightness-110 transition-all active:scale-95">
              Search Jobs
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white' 
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-4 py-2 text-neutral-900 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">settings</span>
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="max-w-[900px] mx-auto px-6 flex flex-col gap-6">
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
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-black tracking-widest uppercase rounded-full">{job.type}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#FFF1F0] text-primary text-xs font-bold rounded">
                        {tag}
                      </span>
                    ))}
                    <span className="ml-2 text-neutral-400 text-xs flex items-center">{job.posted_at}</span>
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
    </div>
  );
};

export default Jobs;

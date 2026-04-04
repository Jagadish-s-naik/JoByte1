import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Search,
  ChevronRight,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

const ApplicantDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState([
    { label: 'Total Applications', value: '0', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'In Review', value: '0', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Interviews', value: '0', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Offers', value: '0', icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]);
  
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      
      const currentUser = session.user;
      setUser(currentUser);
      
      try {
        // Fetch User's Applications (Candidates entries)
        const { data: candData } = await supabase
          .from('candidates')
          .select(`
            *,
            mission:missions(id, title, company, type)
          `)
          .eq('email', currentUser.email);
        
        if (candData) {
          setApplications(candData);
          
          // Update Stats
          setStats(prev => [
            { ...prev[0], value: candData.length.toString() },
            { ...prev[1], value: candData.filter((c: any) => c.status === 'INVITED' || c.status === 'IN_PROGRESS').length.toString() },
            prev[2],
            prev[3]
          ]);
        }
        
        // Fetch User's Assessment Reports
        const { data: reptData } = await supabase
          .from('vjsa_reports')
          .select(`
            *,
            mission:missions(title)
          `)
          .eq('candidate_id', candData?.[0]?.id || 'none'); // Simplified for now
        
        if (reptData && reptData.length > 0) {
          setReports(reptData);
          const avgScore = Math.floor(reptData.reduce((acc: number, r: any) => acc + (r.total_score || 0), 0) / reptData.length);
          setConfidenceScore(avgScore);
        } else {
          setConfidenceScore(0);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-display">
              Welcome back, <span className="text-primary">{user?.user_metadata?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-400 mt-1">Here's what's happening with your job applications.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search applications..." 
                className="bg-surface-800 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
              />
            </div>
            <button className="p-2 bg-surface-800 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-900 border border-white/5 p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-white/5 py-1 px-2 rounded-lg">+12%</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Recent Applications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display">Recent Applications</h2>
              <button className="text-primary hover:text-primary-600 text-sm font-medium flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {applications.length > 0 ? applications.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-surface-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-indigo-500/20 border border-white/10 flex items-center justify-center font-bold text-xl text-primary">
                      {app.mission?.company?.charAt(0) || 'J'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">{app.mission?.title}</h4>
                      <p className="text-sm text-slate-400">{app.mission?.company} • {app.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' :
                      app.status === 'IN_PROGRESS' || app.status === 'INVITED' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {app.status}
                    </span>
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="py-12 bg-surface-900 border border-dashed border-white/10 rounded-2xl text-center">
                  <p className="text-slate-500">No applications found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Profile & Recommendations */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-2">Hiring Confidence Score</h3>
              <p className="text-sm text-slate-400 mb-6">Based on your recent simulation performance.</p>
              
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${confidenceScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute top-0 left-0 h-full bg-primary" 
                />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-white">{confidenceScore}<span className="text-sm font-normal text-slate-500">/100</span></span>
                <span className={`text-xs font-medium ${confidenceScore > 80 ? 'text-green-400' : confidenceScore > 60 ? 'text-yellow-400' : 'text-slate-400'}`}>
                  {confidenceScore > 80 ? 'Excellent' : confidenceScore > 60 ? 'Good' : confidenceScore > 0 ? 'Improving' : 'N/A'}
                </span>
              </div>
            </div>

            <div className="bg-surface-900 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4">Upcoming Assessments</h3>
              <div className="space-y-4">
                {applications.filter(a => a.status !== 'COMPLETED').map((app) => (
                  <div key={app.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <AlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={20} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{app.mission?.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Pending Assessment</p>
                      <button 
                        onClick={() => navigate(`/assessment/${app.mission?.id}`)}
                        className="w-full btn-primary py-2 px-3 text-[10px] font-bold mt-4 rounded-xl"
                      >
                        Start Now
                      </button>
                    </div>
                  </div>
                ))}
                {applications.filter(a => a.status !== 'COMPLETED').length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-4">No pending assessments.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

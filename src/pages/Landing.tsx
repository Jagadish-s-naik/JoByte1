import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'applicant' | 'employer' | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (session?.user) {
        setUser(session.user);
        setRole(session.user.user_metadata?.role || 'applicant');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
      if (session?.user) {
        setRole(session.user.user_metadata?.role || 'applicant');
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="dot-grid relative min-h-screen overflow-hidden">
      {/* Floating Tech Icons (Decorative) */}
      <div className="absolute inset-0 pointer-events-none opacity-45 text-neutral-400">
        <span className="material-symbols-outlined absolute top-[10%] left-[5%]" style={{ fontSize: '40px' }}>code</span>
        <span className="material-symbols-outlined absolute top-[15%] right-[10%]" style={{ fontSize: '32px' }}>database</span>
        <span className="material-symbols-outlined absolute bottom-[20%] left-[12%]" style={{ fontSize: '36px' }}>terminal</span>
        <span className="material-symbols-outlined absolute top-[40%] left-[8%]" style={{ fontSize: '28px' }}>smartphone</span>
        <span className="material-symbols-outlined absolute bottom-[10%] right-[15%]" style={{ fontSize: '44px' }}>briefcase_meal</span>
        <span className="material-symbols-outlined absolute top-[60%] right-[5%]" style={{ fontSize: '30px' }}>security</span>
        <span className="material-symbols-outlined absolute top-[25%] left-[45%]" style={{ fontSize: '24px' }}>memory</span>
        <span className="material-symbols-outlined absolute bottom-[35%] left-[48%]" style={{ fontSize: '34px' }}>cloud_done</span>
        <span className="material-symbols-outlined absolute top-[75%] left-[25%]" style={{ fontSize: '26px' }}>api</span>
        <span className="material-symbols-outlined absolute top-[12%] left-[80%]" style={{ fontSize: '38px' }}>developer_mode</span>
        <span className="material-symbols-outlined absolute bottom-[45%] right-[25%]" style={{ fontSize: '24px' }}>psychology</span>
        <span className="material-symbols-outlined absolute top-[50%] left-[20%]" style={{ fontSize: '22px' }}>schema</span>
        <span className="material-symbols-outlined absolute bottom-[5%] left-[50%]" style={{ fontSize: '40px' }}>verified</span>
        <span className="material-symbols-outlined absolute top-[85%] right-[40%]" style={{ fontSize: '30px' }}>analytics</span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          Empowering the next generation of tech talent
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-[#111827] tracking-tighter mb-6 leading-tight">
          Hire with confidence ,<br />
          <span className="text-[#E53935]">Work with purpose</span>
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          The editorial-grade ATS and career platform designed for high-stakes engineering teams. We bridge the gap between resume claims and proven technical mastery.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!user ? (
            <>
              <button onClick={() => navigate('/jobs')} className="px-8 py-4 bg-primary text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#93000d] transition-all">
                Browse Opportunities <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button onClick={() => navigate('/signup?role=employer')} className="px-8 py-4 bg-white text-neutral-950 border-2 border-neutral-950 rounded-lg font-bold text-lg hover:bg-neutral-50 transition-all">
                For Employers
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate(role === 'employer' ? '/employer/dashboard' : '/applicant/dashboard')} 
                className="px-8 py-4 bg-primary text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#93000d] transition-all shadow-lg shadow-primary/20"
              >
                Go to My Dashboard <span className="material-symbols-outlined font-bold">dashboard</span>
              </button>
              {role === 'employer' ? (
                <button 
                  onClick={() => navigate('/employer/dashboard')} 
                  className="px-8 py-4 bg-neutral-950 text-white rounded-lg font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  Post a Job <span className="material-symbols-outlined">add_circle</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/jobs')} 
                  className="px-8 py-4 bg-white text-neutral-950 border-2 border-neutral-950 rounded-lg font-bold text-lg hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
                >
                  Explore Jobs <span className="material-symbols-outlined">search</span>
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trust Row */}
      <section className="py-12 border-y border-neutral-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-8">TRUSTED BY INDUSTRY LEADERS IN TECH</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-70">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
              <span className="material-symbols-outlined">water_drop</span> TECHFLOW
            </div>
            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
              <span className="material-symbols-outlined">center_focus_strong</span> ZENTRY
            </div>
            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
              <span className="material-symbols-outlined">hexagon</span> NOVA LABS
            </div>
            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
              <span className="material-symbols-outlined">shield</span> SECURECORE
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-950 mb-4">The JoByte Advantage</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">Precision-engineered tools to streamline your recruitment architecture and career growth.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group bg-white p-8 rounded-lg border border-neutral-100 shadow-sm hover:border-t-[3px] hover:border-t-primary transition-all duration-300">
            <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-950 mb-3">AI Assessments</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">Context-aware technical challenges that adapt to the candidate's level in real-time, providing deep insights.</p>
          </div>
          {/* Feature 2 */}
          <div className="group bg-white p-8 rounded-lg border border-neutral-100 shadow-sm hover:border-t-[3px] hover:border-t-primary transition-all duration-300">
            <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-950 mb-3">Anti-Cheat</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">Advanced proctoring and code-style fingerprinting ensure that the work you evaluate is 100% original talent.</p>
          </div>
          {/* Feature 3 */}
          <div className="group bg-white p-8 rounded-lg border border-neutral-100 shadow-sm hover:border-t-[3px] hover:border-t-primary transition-all duration-300">
            <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-950 mb-3">Confidence Scoring</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">A proprietary metric that quantifies the reliability of a candidate's skill profile based on cross-referenced data.</p>
          </div>
        </div>
      </section>

      {/* Hire Section */}
      <section className="py-24 px-6 bg-neutral-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-left">
            <div className="inline-block px-4 py-1 rounded-full border border-[#E53935] text-[#E53935] text-xs font-bold tracking-widest mb-6">
              NEXT-GEN RECRUITMENT ENGINE
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">
              HIRE WITH <span className="text-[#E53935]">ABSOLUTE</span><br />CONFIDENCE
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-lg leading-relaxed">
              Eliminate the noise in your hiring funnel. JoByte's editorial approach surfaces the top 1% of talent using verified technical architecture audits.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/signup?role=employer')} className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-[#93000d] transition-all">Request Demo</button>
              <button onClick={() => navigate('/jobs')} className="px-8 py-4 bg-transparent border border-neutral-700 text-white rounded-lg font-bold hover:bg-neutral-900 transition-all">Platform Tour</button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg">
            <div className="relative bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-800 p-2">
              <img 
                alt="Technical recruitment dashboard" 
                className="rounded-lg w-full h-[400px] object-cover" 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2850&ixlib=rb-4.0.3" 
              />
            </div>
          </div>
        </div>
        {/* Background accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary opacity-10 blur-[120px]"></div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-[900px] mx-auto bg-neutral-50 rounded-2xl p-12 text-center border border-neutral-100 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950 mb-6">Start your career journey with editorial precision.</h2>
          <p className="text-neutral-500 mb-10 max-w-md mx-auto">Join 50,000+ engineers building their legacy at top-tier organizations worldwide.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-[#93000d] transition-all">Create Profile</button>
            <button onClick={() => navigate('/jobs')} className="px-8 py-4 bg-neutral-950 text-white rounded-lg font-bold hover:bg-black transition-all">View Active Roles</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Brain, 
  BarChart3, 
  Globe,
  Users,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Driven Assessments",
      description: "Our VJSA engine evaluates technical logic and problem-solving through real-world simulations."
    },
    {
      icon: ShieldCheck,
      title: "Anti-Cheat Environment",
      description: "Secure, monitored testing environment ensuring 100% integrity for every applicant."
    },
    {
      icon: BarChart3,
      title: "Confidence Scoring",
      description: "Objective metrics and 'Hiring Confidence Scores' help employers make data-backed decisions."
    }
  ];

  return (
    <div className="bg-background text-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium tracking-wide mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Empowering the next generation of technical hiring
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display tracking-tight text-white mb-8 leading-[1.1]"
          >
            Hire the best with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary-600">
              Technical Confidence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            JoByte is an enterprise-grade recruitment platform that utilizes AI-driven virtual simulations 
             to verify skills before you even interview. Data-driven hiring, simplified.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto btn-primary h-14 px-10 text-base flex items-center justify-center gap-3 group"
            >
              Browse Opportunities <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 h-14 px-10 rounded-xl font-bold transition-all flex items-center justify-center"
            >
              For Employers
            </button>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Logos */}
      <section className="py-16 border-y border-white/5 bg-surface-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-10">
            Trusted by industry leaders in tech
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale saturate-0">
            <div className="flex items-center gap-2 font-bold text-xl"><Globe size={24} /> TECHFLOW</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Users size={24} /> ZENTRY</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Briefcase size={24} /> NOVA LABS</div>
            <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck size={24} /> SECURECORE</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The JoByte Advantage</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Traditional resumes are outdated. We provide a comprehensive evaluation ecosystem that highlights true merit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-900/50 border border-white/5 p-8 rounded-3xl group hover:border-primary/30 transition-all"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Recruitment Engine
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-black font-display tracking-tight leading-[0.9] mb-8"
        >
          HIRE WITH <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary-600 animate-gradient-x">
            ABSOLUTE CONFIDENCE
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 font-medium leading-relaxed"
        >
          JoByte integrates <span className="text-white">Virtual Job Simulations</span> and <span className="text-white">AI-Driven Scoring</span> to find your perfect candidate, 10x faster and with zero bias.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <button 
            onClick={() => navigate('/signup?role=employer')}
            className="w-full sm:w-auto btn-primary px-10 py-4 text-sm font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-all group"
          >
            Start Hiring Now <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </button>
          <button 
            onClick={() => navigate('/jobs')}
            className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 hover:border-white/20 transition-all"
          >
            Explore Jobs
          </button>
        </motion.div>
        </main>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary/20 to-indigo-500/10 border border-primary/20 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">Start your career journey or <br />hire top talent today.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button 
              onClick={() => navigate('/signup')} 
              className="btn-primary h-14 px-12 text-lg w-full sm:w-auto"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 h-14 px-12 rounded-xl font-bold transition-all w-full sm:w-auto"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

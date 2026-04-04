import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield, Zap, Search } from 'lucide-react';
import GlassCard from '../components/UI/GlassCard';
import GlowButton from '../components/UI/GlowButton';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen pt-20 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Welcome to JoByte
          </h1>
          <p className="text-xl md:text-2xl text-teal-100/70 mb-10 font-orbitron tracking-widest">
            THE NEXT GEN FRONTIER JOB DIRECTORY
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          <GlowButton className="text-lg px-10 py-4">
            <span className="flex items-center gap-3">
              <Search size={20} /> Browse Missions
            </span>
          </GlowButton>
          <GlowButton variant="ghost" className="text-lg px-10 py-4">
            Post an Opening
          </GlowButton>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <GlassCard className="text-center">
          <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-teal-400" size={32} />
          </div>
          <h3 className="text-xl mb-4">Safe Exam Mode</h3>
          <p className="text-teal-100/60 leading-relaxed">
            Tamper-proof Virtual Job Simulation Assessments with real-time anti-cheat surveillance.
          </p>
        </GlassCard>

        <GlassCard className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="text-blue-400" size={32} />
          </div>
          <h3 className="text-xl mb-4">AI Scoring</h3>
          <p className="text-teal-100/60 leading-relaxed">
            Instant evaluation of tech challenges powered by Anthropic's Claude AI engine.
          </p>
        </GlassCard>

        <GlassCard className="text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="text-purple-400" size={32} />
          </div>
          <h3 className="text-xl mb-4">Deep Tech Jobs</h3>
          <p className="text-teal-100/60 leading-relaxed">
            Work with NASA, SpaceX, and top-tier Quantum/Aerospace startups world-wide.
          </p>
        </GlassCard>
      </section>

      {/* Decorative Mission Status */}
      <div className="fixed bottom-8 left-8 hidden lg:block opacity-40">
        <div className="font-orbitron text-[10px] space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
            <span>ENCRYPTION ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
            <span>SESSION: 0X4F-VJSA</span>
          </div>
          <div className="text-teal-400">DATA SYNC: ESTABLISHED</div>
        </div>
      </div>
    </div>
  );
};

export default Home;

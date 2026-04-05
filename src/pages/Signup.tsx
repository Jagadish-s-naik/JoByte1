import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'applicant' | 'employer' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'employer' || roleParam === 'applicant') {
      setRole(roleParam as 'employer' | 'applicant');
      setStep(2);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = formData.email.trim();
    const cleanPassword = formData.password.trim();

    if (cleanPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          full_name: formData.fullName,
          role: role,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('rate limit')) {
        setError('Email limit reached (3 per hour). Please try again later or disable email confirmation in your Supabase Dashboard.');
      } else if (authError.message.toLowerCase().includes('invalid')) {
        setError('The email or password format is invalid. Please double check for hidden spaces.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Redirect to login or specific dashboard
    navigate('/login');
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });

    if (authError) {
      setError("Guest account not configured. Please use standard registration or contact support.");
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role || 'applicant';
    if (role === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/applicant/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-surface-900 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">J</span>
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight">JoByte</span>
            </Link>
            <h1 className="text-3xl font-bold text-white">Create your account</h1>
            <p className="text-slate-400 mt-2">Join thousand of professionals and top companies</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-lg font-semibold text-white">I want to join as a...</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole('applicant')}
                    className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 group bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 ${role === 'applicant' ? 'ring-2 ring-primary border-primary' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${role === 'applicant' ? 'bg-primary' : 'bg-surface-800'}`}>
                      <GraduationCap className={role === 'applicant' ? 'text-white' : 'text-slate-400'} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">Applicant</h3>
                      <p className="text-sm text-slate-400 mt-1">Ready to showcase my skills and land a dream job</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setRole('employer')}
                    className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 group bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 ${role === 'employer' ? 'ring-2 ring-primary border-primary' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${role === 'employer' ? 'bg-primary' : 'bg-surface-800'}`}>
                      <Building2 className={role === 'employer' ? 'text-white' : 'text-slate-400'} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">Employer</h3>
                      <p className="text-sm text-slate-400 mt-1">Looking for top talent and efficient hiring</p>
                    </div>
                  </button>
                </div>

                <div className="pt-8">
                  <button
                    disabled={!role}
                    onClick={() => setStep(2)}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <form onSubmit={handleSignup} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <User size={18} />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          maxLength={250}
                          className="w-full bg-surface-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          maxLength={250}
                          className="w-full bg-surface-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Lock size={18} />
                        </div>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          maxLength={250}
                          className="w-full bg-surface-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="Min 8 characters"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] btn-primary py-4 flex items-center justify-center gap-2 group"
                    >
                      {loading ? 'Creating Account...' : 'Complete Registration'}
                      {!loading && <CheckCircle2 size={18} />}
                    </button>
                    <div className="flex flex-1 gap-2">
                      <Link
                        to="/login"
                        className="flex-1 px-4 py-4 bg-white/5 text-slate-300 font-bold rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center text-sm"
                      >
                        Sign In
                      </Link>
                      <button
                        type="button"
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="flex-1 px-4 py-4 bg-white/5 text-slate-300 font-bold rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-1 text-sm"
                      >
                        <span className="material-symbols-outlined text-sm">person</span>
                        Guest
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      Wait, let me change my role
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-600 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <ShieldCheck className="text-primary shrink-0" size={20} />
            Secure & Private
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Users className="text-primary shrink-0" size={20} />
            Verified Profiles
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Briefcase className="text-primary shrink-0" size={20} />
            Direct Industry Links
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

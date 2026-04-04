import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { User, Mail, Save, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'applicant' | 'employer' | string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setRole(session.user.user_metadata?.role || 'applicant');
        setFullName(session.user.user_metadata?.full_name || '');
        setCompany(session.user.user_metadata?.company || '');
      }
      setLoading(false);
    };
    
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          ...(role === 'employer' ? { company } : {})
        }
      });

      if (error) throw error;
      
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-900 border border-white/10 rounded-3xl overflow-hidden"
        >
          {/* Header area */}
          <div className="relative h-32 bg-gradient-to-br from-primary/30 to-indigo-500/10 border-b border-white/5">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-surface-900 flex items-center justify-center p-2 border border-white/10 shadow-xl">
                <div className="w-full h-full rounded-xl bg-slate-800 flex items-center justify-center">
                   <User className="text-slate-400" size={40} />
                </div>
              </div>
            </div>
            {role === 'employer' && (
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <Building size={14} className="text-primary" />
                <span className="text-xs font-medium text-white">Employer Account</span>
              </div>
            )}
            {role === 'applicant' && (
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-xs font-medium text-white">Verified Applicant</span>
              </div>
            )}
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
              <p className="text-slate-400 text-sm">Update your personal information and account preferences.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      className="w-full bg-slate-800/20 border border-transparent rounded-xl py-3 pl-12 pr-4 text-slate-400 cursor-not-allowed"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Email changes require re-authentication.</p>
                </div>
              </div>

              {role === 'employer' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
              )}

              <hr className="border-white/5 my-8" />
              
              <div className="flex items-center justify-between">
                <div>
                  {successMsg && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-sm text-green-400"
                    >
                      <CheckCircle2 size={16} />
                      {successMsg}
                    </motion.div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;

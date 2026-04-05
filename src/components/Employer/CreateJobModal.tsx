import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface CreateJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    tags: '',
    clearance: 'Alpha',
    description: '',
    requirements: '',
    benefits: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        setUser(session.user);
        // Pre-fill company if available in metadata
        if (session.user.user_metadata?.company) {
          setFormData(prev => ({ ...prev, company: session.user.user_metadata.company }));
        }
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Hardening for salary field: strictly numeric and currency characters
    if (name === 'salary') {
      const sanitized = value.replace(/[^0-9$kKmM,.\-\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitized }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map((tag: string) => tag.trim()).filter((t: string) => t);
      
      const fullDescription = `
${formData.description}

${formData.requirements ? '### Requirements\n' + formData.requirements : ''}

${formData.benefits ? '### Benefits\n' + formData.benefits : ''}
`.trim();

      const { error } = await supabase.from('missions').insert({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        tags: tagsArray,
        clearance: formData.clearance,
        description: fullDescription,
        employer_id: user?.id
      });

      if (error) {
        console.error('Supabase raw error details:', error);
        throw error;
      }
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Resolved Error creating job:', errorMessage);
      alert(`Failed to post job: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-surface-900 border border-white/10 rounded-3xl shadow-2xl custom-scrollbar"
      >
        <div className="sticky top-0 z-10 bg-surface-900/80 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">work</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white">Create Job Posting</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Job Title *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base">work</span>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Engineer"
                    maxLength={250}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base">business</span>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                    maxLength={250}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base">location_on</span>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote, San Francisco"
                    maxLength={250}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Salary Range</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base">payments</span>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. $120k - $150k"
                    maxLength={50}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Clearance (Difficulty) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  VJSA Assessment Level <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                </label>
                <select
                  name="clearance"
                  value={formData.clearance}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none"
                >
                  <option value="Alpha">Alpha (Junior)</option>
                  <option value="Beta">Beta (Mid-Level)</option>
                  <option value="Gamma">Gamma (Senior)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">This defines the difficulty of the automated assessment.</p>
              </div>
            </div>

            {/* Tags/Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Required Skills / Tags</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-base">label</span>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="React, TypeScript, Node.js (Comma separated)"
                  maxLength={250}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Job Description</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-base">description</span>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role and responsibilities..."
                  maxLength={5000}
                  rows={4}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-y custom-scrollbar"
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Requirements</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-base">fact_check</span>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="List the key requirements and qualifications..."
                  maxLength={2000}
                  rows={3}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-y custom-scrollbar"
                />
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Benefits & Perks</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-base">redeem</span>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="What benefits does the company provide?"
                  maxLength={2000}
                  rows={3}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-y custom-scrollbar"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary py-2.5 px-8 text-sm flex items-center justify-center gap-2 min-w-[160px]"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span> Publish Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateJobModal;

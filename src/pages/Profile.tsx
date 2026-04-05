import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Save, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  Globe,
  Plus, 
  Trash2, 
  Camera,
  MapPin,
  FileText,
  Phone,
  LayoutDashboard,
  ArrowLeft
} from 'lucide-react';
import type { Profile as UserProfile, ExperienceItem, EducationItem, SocialLinks } from '../types';

type Tab = 'overview' | 'professional' | 'settings';

const Profile: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Local state for UI-only toggles
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'New Job Recommendations': true,
    'Assessment Phase Updates': true,
    'Company Newsletters': false,
    'Public Profile Visibility': true,
    'Show VJSA Performance Scores': true,
    'Anonymous Application Mode': false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      // Ensure JSON fields are parsed/initialized
      const formattedProfile: UserProfile = {
        ...data,
        experience: data.experience || [],
        education: data.education || [],
        social_links: data.social_links || {},
        skills: data.skills || []
      };

      setProfile(formattedProfile);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setErrorMsg('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const updateSocialLink = (platform: keyof SocialLinks, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      social_links: { ...profile.social_links, [platform]: value }
    });
  };

  // Dynamic Handlers for Experience
  const addExperience = () => {
    const newItems = [...(profile?.experience || []), { company: '', role: '', duration: '', description: '' }];
    updateProfileField('experience', newItems);
  };

  const removeExperience = (index: number) => {
    const newItems = profile?.experience?.filter((_, i) => i !== index);
    updateProfileField('experience', newItems);
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    const newItems = [...(profile?.experience || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateProfileField('experience', newItems);
  };

  // Dynamic Handlers for Education
  const addEducation = () => {
    const newItems = [...(profile?.education || []), { school: '', degree: '', year: '' }];
    updateProfileField('education', newItems);
  };

  const removeEducation = (index: number) => {
    const newItems = profile?.education?.filter((_, i) => i !== index);
    updateProfileField('education', newItems);
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    const newItems = [...(profile?.education || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateProfileField('education', newItems);
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const skill = e.currentTarget.value.trim();
      if (skill && !profile?.skills?.includes(skill)) {
        updateProfileField('skills', [...(profile?.skills || []), skill]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateProfileField('skills', profile?.skills?.filter(s => s !== skillToRemove));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Image size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          updateProfileField('avatar_url', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggle = (label: string) => {
    setToggles(prev => ({ ...prev, [label]: !prev[label] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <Link 
          to={profile?.role === 'employer' ? '/employer/dashboard' : '/applicant/dashboard'}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group mb-8 w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back to Dashboard</span>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Header & Cover Section */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-indigo-600/30 via-primary/30 to-purple-600/20 border-b border-white/5">
            <div className="absolute -bottom-16 left-8 sm:left-12 flex items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-surface-900 flex items-center justify-center p-2 border border-white/10 shadow-2xl relative z-10 overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-surface-800 flex items-center justify-center">
                      <User className="text-slate-500" size={60} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <button 
                    type="button"
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl cursor-pointer pointer-events-auto"
                  >
                    <Camera className="text-white" size={24} />
                  </button>
                </div>
              </div>
              <div className="pb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-none">{profile.full_name}</h1>
                <div className="flex items-center gap-2 text-slate-400">
                  {profile.role === 'employer' ? (
                    <Building2 size={16} className="text-primary" />
                  ) : (
                    <ShieldCheck size={16} className="text-primary" />
                  )}
                  <span className="text-sm font-medium uppercase tracking-wider">
                    {profile.role === 'employer' ? profile.company_name || 'Employer Account' : profile.headline || 'JoByte Applicant'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="pt-20 px-8 sm:px-12">
            <div className="flex items-center border-b border-white/5 mb-8">
              {(['overview', 'professional', 'settings'] as Tab[]).map((tab) => {
                const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                const isProfessional = tab === 'professional';
                const finalLabel = isProfessional && profile.role === 'employer' ? 'Company' : label;
                
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {finalLabel}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeProfileTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary-rgb),0.5)]" 
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSave} className="pb-12">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Base Info */}
                      <div className="space-y-6">
                        <SectionTitle title="Personal Details" icon={<User className="text-primary" size={18} />} />
                        
                        <div>
                          <FieldLabel label="Full Name" />
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input 
                              value={profile.full_name} 
                              onChange={(e) => updateProfileField('full_name', e.target.value)}
                              placeholder="Your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel label="Professional Headline" />
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input 
                              value={profile.headline || ''} 
                              onChange={(e) => updateProfileField('headline', e.target.value)}
                              placeholder={profile.role === 'employer' ? "e.g. HR Manager" : "e.g. Full Stack Developer"}
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel label="Phone Number" />
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input 
                              value={profile.phone || ''} 
                              onChange={(e) => updateProfileField('phone', e.target.value)}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social Presence */}
                      <div className="space-y-6">
                        <SectionTitle title="Social & Web" icon={<Globe className="text-primary" size={18} />} />
                        
                        <div>
                          <FieldLabel label="LinkedIn URL" />
                          <div className="relative text-blue-400">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
                            <Input 
                              value={profile.social_links?.linkedin || ''} 
                              onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                              placeholder="linkedin.com/in/username"
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel label="GitHub URL" />
                          <div className="relative text-slate-300">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
                            <Input 
                              value={profile.social_links?.github || ''} 
                              onChange={(e) => updateSocialLink('github', e.target.value)}
                              placeholder="github.com/username"
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel label="Portfolio Website" />
                          <div className="relative text-primary">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
                            <Input 
                              value={profile.social_links?.portfolio || ''} 
                              onChange={(e) => updateSocialLink('portfolio', e.target.value)}
                              placeholder="yourwebsite.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <FieldLabel label="Brief Biography" />
                        <textarea
                          maxLength={2000}
                          className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px]"
                          value={profile.bio || ''}
                          onChange={(e) => updateProfileField('bio', e.target.value)}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'professional' && profile.role === 'applicant' && (
                  <motion.div
                    key="professional-applicant"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-12"
                  >
                    {/* Skills Section */}
                    <section>
                      <SectionTitle title="Skills & Competencies" icon={<CheckCircle2 className="text-primary" size={18} />} />
                      <div className="mt-4 p-6 bg-slate-800/30 rounded-3xl border border-white/5">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {profile.skills?.map((skill, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm flex items-center gap-2 group"
                            >
                              {skill}
                              <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                                <Trash2 size={14} className="opacity-50 group-hover:opacity-100" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <Input 
                          placeholder="Type a skill and press Enter..." 
                          onKeyDown={handleSkillAdd}
                        />
                        <p className="text-xs text-slate-500 mt-3 ml-1">E.g. React, Node.js, AWS Cloud, Leadership</p>
                      </div>
                    </section>

                    {/* Experience Section */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <SectionTitle title="Work Experience" icon={<Briefcase className="text-primary" size={18} />} />
                        <button type="button" onClick={addExperience} className="text-xs font-semibold text-primary flex items-center gap-1 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                          <Plus size={14} /> Add Role
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {profile.experience?.map((exp, idx) => (
                          <div key={idx} className="p-6 bg-slate-800/30 rounded-3xl border border-white/5 relative group overflow-hidden">
                            <div className="flex justify-between items-start mb-6 -mt-2">
                              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Experience Entry #{idx + 1}</h4>
                              <button 
                                type="button" 
                                onClick={() => removeExperience(idx)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                title="Remove role"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input 
                                  placeholder="Company Name" 
                                  value={exp.company} 
                                  onChange={(e) => updateExperience(idx, 'company', e.target.value)} 
                                />
                                <Input 
                                  placeholder="Role Title" 
                                  value={exp.role} 
                                  onChange={(e) => updateExperience(idx, 'role', e.target.value)} 
                                />
                                <Input 
                                  placeholder="Duration (e.g. 2021 - Present)" 
                                  value={exp.duration} 
                                  onChange={(e) => updateExperience(idx, 'duration', e.target.value)} 
                                />
                              </div>
                              <div className="md:col-span-2">
                                <textarea
                                  maxLength={1000}
                                  className="w-full bg-slate-800/10 border border-white/5 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-primary/50 transition-all min-h-[80px]"
                                  placeholder="Key accomplishments..."
                                  value={exp.description}
                                  onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Education Section */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <SectionTitle title="Education" icon={<GraduationCap className="text-primary" size={18} />} />
                        <button type="button" onClick={addEducation} className="text-xs font-semibold text-primary flex items-center gap-1 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                          <Plus size={14} /> Add Qualification
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {profile.education?.map((edu, idx) => (
                          <div key={idx} className="p-6 bg-slate-800/30 rounded-3xl border border-white/5 relative group">
                            <div className="flex justify-between items-start mb-6 -mt-2">
                              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Qualification #{idx + 1}</h4>
                              <button 
                                type="button" 
                                onClick={() => removeEducation(idx)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                title="Remove qualification"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input 
                                placeholder="University/School" 
                                value={edu.school} 
                                onChange={(e) => updateEducation(idx, 'school', e.target.value)} 
                              />
                              <Input 
                                placeholder="Field of Study" 
                                value={edu.degree} 
                                onChange={(e) => updateEducation(idx, 'degree', e.target.value)} 
                              />
                              <Input 
                                placeholder="Graduation Year" 
                                value={edu.year} 
                                onChange={(e) => updateEducation(idx, 'year', e.target.value)} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'professional' && profile.role === 'employer' && (
                  <motion.div
                    key="professional-employer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <SectionTitle title="Business Profile" icon={<Building2 className="text-primary" size={18} />} />
                        
                        <div>
                          <FieldLabel label="Company Name" />
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input 
                              value={profile.company_name || ''} 
                              onChange={(e) => updateProfileField('company_name', e.target.value)}
                              placeholder="JoByte Global"
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel label="Company Website" />
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input 
                              value={profile.company_website || ''} 
                              onChange={(e) => updateProfileField('company_website', e.target.value)}
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel label="Industry" />
                          <div className="relative">
                            <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input 
                              value={profile.industry || ''} 
                              onChange={(e) => updateProfileField('industry', e.target.value)}
                              placeholder="e.g. Technology, Finance, Healthcare"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <SectionTitle title="Corporate Presence" icon={<MapPin className="text-primary" size={18} />} />
                        
                        <div>
                          <FieldLabel label="Headquarters Location" />
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <Input 
                              value={profile.company_location || ''} 
                              onChange={(e) => updateProfileField('company_location', e.target.value)}
                              placeholder="New York, NY"
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel label="Company Size" />
                          <select className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            <option>1-10 employees</option>
                            <option>11-50 employees</option>
                            <option>51-200 employees</option>
                            <option>201-500 employees</option>
                            <option>500+ employees</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <SectionTitle title="About the Company" icon={<FileText className="text-primary" size={18} />} />
                        <div className="mt-4">
                          <textarea
                            maxLength={5000}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[200px]"
                            value={profile.company_description || ''}
                            onChange={(e) => updateProfileField('company_description', e.target.value)}
                            placeholder="Write about your company's mission, culture, and what you look for in candidates..."
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="p-8 bg-slate-800/30 rounded-[2rem] border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
                       <ShieldCheck size={48} className="text-primary/40 mb-4" />
                       <h3 className="text-xl font-bold text-white mb-2">Platform Security Settings</h3>
                       <p className="text-slate-400 max-w-sm mb-6">Security protocols and authentication settings are managed via our enterprise auth provider.</p>
                       <button type="button" className="text-primary font-semibold hover:underline">Change Password</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-800/30 rounded-3xl border border-white/5">
                          <h4 className="text-white font-bold mb-4">Email Notifications</h4>
                          <div className="space-y-3">
                             <Toggle 
                               label="New Job Recommendations" 
                               checked={toggles['New Job Recommendations']} 
                               onChange={() => handleToggle('New Job Recommendations')} 
                             />
                             <Toggle 
                               label="Assessment Phase Updates" 
                               checked={toggles['Assessment Phase Updates']} 
                               onChange={() => handleToggle('Assessment Phase Updates')} 
                             />
                             <Toggle 
                               label="Company Newsletters" 
                               checked={toggles['Company Newsletters']} 
                               onChange={() => handleToggle('Company Newsletters')} 
                             />
                          </div>
                       </div>
                       <div className="p-6 bg-slate-800/30 rounded-3xl border border-white/5">
                          <h4 className="text-white font-bold mb-4">Privacy Controls</h4>
                          <div className="space-y-3">
                             <Toggle 
                               label="Public Profile Visibility" 
                               checked={toggles['Public Profile Visibility']} 
                               onChange={() => handleToggle('Public Profile Visibility')} 
                             />
                             <Toggle 
                               label="Show VJSA Performance Scores" 
                               checked={toggles['Show VJSA Performance Scores']} 
                               onChange={() => handleToggle('Show VJSA Performance Scores')} 
                             />
                             <Toggle 
                               label="Anonymous Application Mode" 
                               checked={toggles['Anonymous Application Mode']} 
                               onChange={() => handleToggle('Anonymous Application Mode')} 
                             />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Actions Bar */}
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                  {successMsg && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-sm text-green-400 font-medium"
                    >
                      <CheckCircle2 size={18} />
                      {successMsg}
                    </motion.div>
                  )}
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-sm text-red-400 font-medium"
                    >
                      <Trash2 size={18} />
                      {errorMsg}
                    </motion.div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-3 px-8 rounded-2xl flex items-center gap-2 shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)]"
                >
                  {saving ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? 'Synchronizing...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Reusable Sub-components
const SectionTitle = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-4">
    {icon}
    <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
  </div>
);

const FieldLabel = ({ label }: { label: string }) => (
  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">
    {label}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    maxLength={250}
    {...props}
    className={`w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${props.className || ''}`}
  />
);

const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
  <button 
    type="button"
    onClick={onChange}
    className="flex items-center justify-between w-full group cursor-pointer"
  >
    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
    <div className={`w-10 h-5 rounded-full border transition-all relative ${checked ? 'bg-primary/20 border-primary/50' : 'bg-surface-800 border-white/10'}`}>
      <motion.div 
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full transition-colors ${checked ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'bg-slate-500'}`} 
      />
    </div>
  </button>
);

export default Profile;

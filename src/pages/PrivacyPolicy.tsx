import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      icon: <Shield className="w-6 h-6 text-red-500" />,
      content: "Welcome to JoByte. We are committed to protecting your personal data and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform."
    },
    {
      title: "2. Data We Collect",
      icon: <Eye className="w-6 h-6 text-red-400" />,
      content: [
        "Personal Identification: Name, email address, phone number, and physical address.",
        "Professional Information: Resume/CV data, skills, experience, and education history.",
        "Candidate Performance: Match scores, simulation results, and application status.",
        "Technical Data: IP address, browser type, and device information."
      ]
    },
    {
      title: "3. How We Use Your Data",
      icon: <Lock className="w-6 h-6 text-rose-500" />,
      content: [
        "To provide and maintain our platform services.",
        "To facilitate AI-powered candidate-to-job matching.",
        "To process and manage your job applications and simulations.",
        "To communicate updates, notifications, and administrative information.",
        "To generate anonymised market intelligence reports."
      ]
    },
    {
      title: "4. Legal Basis for Processing",
      icon: <FileText className="w-6 h-6 text-red-600" />,
      content: "We process your data in compliance with India's Digital Personal Data Protection Act (DPDPA), 2023. Our processing is based on your explicit consent and the necessity of providing our recruitment services."
    },
    {
      title: "5. Data Sharing and Disclosure",
      icon: <Shield className="w-6 h-6 text-rose-600" />,
      content: [
        "With Employers: We share relevant candidate profile data for recruitment purposes.",
        "Service Providers: We may use third-party providers (e.g., Supabase, Clerk) for core functions.",
        "Anonymised Analytics: Aggregated, non-identifiable data may be shared with intelligence partners.",
        "Legal Requirements: We may disclose data if required by law or to protect our rights."
      ]
    },
    {
      title: "6. Data Retention",
      icon: <Lock className="w-6 h-6 text-red-700" />,
      content: "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements."
    },
    {
      title: "7. Your Rights (DPDPA 2023)",
      icon: <CheckCircle2 className="w-6 h-6 text-rose-400" />,
      content: [
        "Right to access your personal data.",
        "Right to correction and erasure of your data.",
        "Right to withdraw consent at any time.",
        "Right to grievance redressal."
      ]
    },
    {
      title: "8. Cookies and Tracking",
      icon: <Shield className="w-6 h-6 text-red-400" />,
      content: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent mb-4 tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 text-lg uppercase tracking-widest font-bold">
            Effective Date: April 5, 2026 | Version 1.0
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0D0D0E]/50 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-300 shadow-[0_0_50px_rgba(239,68,68,0.02)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
              </div>
              
              {Array.isArray(section.content) ? (
                <ul className="space-y-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex gap-3 text-neutral-400 leading-relaxed font-medium">
                      <span className="text-red-500 mt-1 font-black">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-400 leading-relaxed font-medium">
                  {section.content}
                </p>
              )}
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 p-8 bg-gradient-to-br from-red-500/5 to-black rounded-3xl border border-red-500/10 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase">Contact Our Privacy Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-red-500/5 rounded-full mb-2 border border-red-500/10">
                <Mail className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Email Us</p>
              <a href="mailto:horizonhacks@gmail.com" className="text-white hover:text-red-500 transition-colors font-bold">
                horizonhacks@gmail.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-red-500/5 rounded-full mb-2 border border-red-500/10">
                <Phone className="w-6 h-6 text-rose-500" />
              </div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Call Us</p>
              <a href="tel:+916360869590" className="text-white hover:text-red-500 transition-colors font-bold">
                +91 6360869590
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-red-500/5 rounded-full mb-2 border border-red-500/10">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Visit Us</p>
              <p className="text-white font-bold">Mangalore, Karnataka, India</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          © 2026 JoByte. All rights reserved. Compliant with DPDPA, 2023.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, Lock, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'who-we-are',
      title: '1. Who We Are',
      content: `JoByte ("we," "us," "our") is an AI-powered job portal connecting Candidates seeking employment with Employers looking to hire. We operate as both a Data Fiduciary (for Candidate data) and a Data Processor (processing data on behalf of Employers) under the DPDPA, 2023.

Contact for privacy matters: horizonhacks@gmail.com
Phone: +91 6360869590`,
    },
    {
      id: 'data-we-collect',
      title: '2. Data We Collect',
      subsections: [
        {
          title: '2.1 Data You Provide Directly',
          content: `From Candidates:
• Identity data: full name, email address, profile photograph (if provided)
• Professional data: skills, years of experience, preferred roles, employment history summary, education
• Application data: proposal text, simulation scores, resume URL
• Communication data: messages and interactions within the Platform

From Employers:
• Company data: company name, industry, size, website, description, location
• Contact data: recruiter name and email
• Job listing content: role titles, descriptions, skill requirements, salary ranges
• Hiring outcome data: shortlist and rejection decisions`,
        },
        {
          title: '2.2 Data Collected Automatically',
          content: `• Log data: IP address, browser type, device type, pages visited, timestamps
• Usage data: features used, search queries, time spent on pages
• Authentication data: session tokens managed by our identity provider
• Performance data: error logs and platform diagnostics`,
        },
      ],
    },
    {
      id: 'how-we-use-data',
      title: '3. How We Use Your Data',
      content: `3.1 To Provide the Platform
• Creating and managing your account
• Running the AI matching algorithm to rank relevant Job Listings for Candidates and relevant Candidates for Employers
• Processing job applications and communicating status updates
• Sending automated emails (shortlist notifications with Google Meet links, rejection notifications)
• Facilitating proctored assessments through Safe Exam Browser

3.2 Platform Safety and Compliance
• Detecting and preventing fraud, misrepresentation, and policy violations
• Enforcing the Anti-Ghost Hiring Policy and Terms of Use
• Complying with legal obligations, court orders, and regulatory requirements

3.3 Service Improvement
• Improving the accuracy of our AI matching algorithm
• Analysing platform usage to improve features and user experience
• Conducting research and development on recruitment market trends`,
    },
    {
      id: 'anonymised-data',
      title: '3.4 Commercial Analytics (Anonymised)',
      content: `Anonymised Data Resale — Full Disclosure
After the application period for a job role closes, JoByte anonymises all Application data associated with that role. We remove all direct and indirect personal identifiers. The resulting anonymised, aggregated datasets may be sold to HR analytics firms, recruitment consultancies, and enterprise clients as market intelligence.

What this means in practice: a report might say "demand for Python ML engineers in Bangalore grew 34% in Q2 2025" — we will never say "Ananya Rao applied to 4 jobs." The data sold cannot identify you.

Legal basis: Legitimate interest (analytics and platform sustainability) with explicit disclosure per DPDPA, 2023, Section 6.`,
    },
    {
      id: 'legal-bases',
      title: '4. Legal Bases for Processing',
      content: `We process personal data on the following legal bases under the DPDPA, 2023:
• Consent: You provide explicit consent during registration and onboarding.
• Contractual necessity: Processing required to provide the services you have requested.
• Legitimate interests: Platform security, fraud prevention, service improvement, and the anonymised analytics programme.
• Legal obligation: Processing required to comply with applicable laws.`,
    },
    {
      id: 'data-sharing',
      title: '5. Data Sharing',
      content: `5.1 With Employers
Candidate Application data — including profile information, match score, and proposal text — is shared with the Employer who posted the relevant Job Listing, for the sole purpose of evaluating that Application.

5.2 With Service Providers
We share data with trusted third-party service providers (e.g., Supabase for backend, Clerk for Auth, etc.) who process data on our behalf under strict data processing agreements.`,
    },
    {
      id: 'data-retention',
      title: '6. Data Retention',
      content: `• Active account data: retained while your account is active.
• Application data: retained for 24 months after the application period closes.
• Anonymised data: retained indefinitely for analytics purposes.
• Payment records: retained for 7 years as required by regulations.`,
    },
    {
      id: 'security',
      title: '7. Security',
      content: `We implement appropriate technical and organisational security measures, including TLS 1.2 or higher encryption, hashed passwords, and role-based access controls. We notify users within 72 hours of any material data breach.`,
    },
    {
      id: 'rights',
      title: '9. Your Rights',
      content: `Under the DPDPA, 2023, you have the following rights:
• Right of Access: Request a copy of your personal data.
• Right to Correction: Correct inaccurate or incomplete data.
• Right to Erasure: Request deletion of your personal data.
• Right to Withdraw Consent: Withdraw consent for data processing at any time.
• Right to Grievance Redressal: Raise a grievance with our Data Protection Officer at horizonhacks@gmail.com.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <Shield size={12} />
            Legal Document
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            This policy explains how JoByte collects, uses, stores, and protects your personal data.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            <span className="flex items-center gap-2">
              <Globe size={14} className="text-primary" />
              Effective Date: June 15, 2025
            </span>
            <span className="flex items-center gap-2">
              <Lock size={14} className="text-primary" />
              Version 1.0
            </span>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">
              Last Updated: April 5, 2026
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          {sections.map((section, idx) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-primary opacity-50 group-hover:opacity-100 transition-opacity">#</span>
                {section.title}
              </h2>
              
              {section.content && (
                <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              )}

              {section.subsections && (
                <div className="space-y-8 mt-6">
                  {section.subsections.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <h3 className="text-lg font-bold text-white/90">
                        {sub.title}
                      </h3>
                      <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">
                        {sub.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-10 border-t border-white/10 text-center"
        >
          <p className="text-neutral-500 text-sm mb-6">
            For any queries or grievances, please reach out to our legal team.
          </p>
          <div className="flex flex-col items-center gap-3">
            <a href="mailto:horizonhacks@gmail.com" className="flex items-center gap-2 text-primary font-bold hover:underline">
              <Mail size={16} />
              horizonhacks@gmail.com
            </a>
            <p className="text-neutral-400 font-medium">
              JoByte Technologies, Mangalore, Karnataka, India
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, FileText, Globe, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'definitions',
      title: '1. Definitions',
      content: `"JoByte," "we," "us," or "our" refers to the JoByte platform and its operators.
"Platform" means the JoByte website, mobile applications, APIs, and all associated services.
"Candidate" means any individual who registers on the Platform seeking employment opportunities.
"Employer" means any individual, company, or organisation that registers to post job listings and recruit through the Platform.
"User" refers to both Candidates and Employers collectively.
"Job Listing" means any employment opportunity posted by an Employer on the Platform.
"Application" means a Candidate's submission — either a Proposal or a Simulation — in response to a Job Listing.`,
    },
    {
      id: 'acceptance',
      title: '2. Acceptance of Terms',
      content: `2.1 These Terms and Conditions constitute a legally binding agreement between you and JoByte. Your continued use of the Platform constitutes acceptance of any amendments we make, which will be communicated with reasonable notice.
2.2 Users must be at least 18 years of age to register.
2.3 Employers registering on behalf of a company represent that they have authority to bind that company to these Terms.`,
    },
    {
      id: 'registration',
      title: '3. Account Registration and Onboarding',
      content: `3.1 Candidates must provide accurate personal details, skills, experience, and education. This information is used by our AI matching system.
3.2 Employers must provide accurate company information and ensure all job listings are truthful.
3.3 Authentication is handled by our third-party identity provider. You are responsible for all activity under your account.`,
    },
    {
      id: 'candidate-rights',
      title: '4. Candidate — Rights and Obligations',
      content: `4.1 Candidates may apply via Proposal (free) or via Simulation (paid).
4.2 Misrepresentation of qualifications is grounds for immediate account termination.
4.3 Candidates who opt for a Simulation agree to the rules of the applicable proctoring software. Attempts to circumvent proctoring result in disqualification.
4.4 JoByte makes no representations regarding the outcome of any Application.`,
    },
    {
      id: 'employer-rights',
      title: '5. Employer — Rights and Obligations',
      content: `5.1 Job Listings must be accurate, genuine, and not violate any anti-discrimination laws.
5.2 Anti-Ghost Hiring Policy — Strictly Enforced:
Ghost hiring — the practice of posting jobs with no genuine intent to hire — is prohibited. Employers who declare a high number of openings and hire a materially smaller number without justification will face penalties:
• First violation: Formal written warning and a financial penalty.
• Second violation: Increased penalty and temporary account suspension.
• Third violation: Permanent blacklisting.`,
    },
    {
      id: 'ai-matching',
      title: '6. AI Matching System',
      content: `6.1 JoByte uses an AI matching system to rank Job Listings against Candidate profiles.
6.2 Match scores are indicative and not guarantees of suitability.
6.3 JoByte is not liable for missed matches resulting from incomplete User-provided data.`,
    },
    {
      id: 'data-commercialisation',
      title: '7. Data Commercialisation — Anonymised Analytics',
      content: `JoByte collects Application data and recruitment outcomes. After the period closes, we anonymise this data and may sell it as market intelligence. No personally identifiable data is sold. Use of the Platform constitutes consent to this practice.`,
    },
    {
      id: 'payments',
      title: '8. Payments and Refunds',
      content: `8.1 Simulation applications require payment. We do not store payment card information.
8.2 Simulation fees are non-refundable once the Simulation has been initiated.
8.3 Technical failures on JoByte's end may qualify for a refund or re-attempt.`,
    },
    {
      id: 'ip',
      title: '9. Intellectual Property',
      content: `9.1 The JoByte platform design, AI systems, and content are the intellectual property of JoByte.
9.2 Users retain ownership of their content but grant JoByte a licence to use and process it for platform operations.`,
    },
    {
      id: 'conduct',
      title: '10. Prohibited Conduct',
      content: `Users must not provide false information, impersonate others, scrape data, or circumvent proctoring measures.`,
    },
    {
      id: 'liability',
      title: '11. Limitation of Liability',
      content: `JoByte shall not be liable for any indirect or consequential damages. Total aggregate liability is limited to INR 5,000 or the fees paid in the last 12 months.`,
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
            <FileText size={12} />
            Legal Agreement
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
            Terms <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            Please read these terms carefully before using the JoByte platform. Your use constitutes acceptance.
          </p>
          
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-8 flex gap-4 items-start max-w-2xl">
            <AlertTriangle className="text-primary shrink-0" size={20} />
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              By registering, accessing, or using the JoByte platform in any capacity — as a Candidate or as an Employer — you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions in their entirety.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-8 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
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
              
              <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
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
            For any questions regarding these terms, please contact our legal department.
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

export default TermsAndConditions;

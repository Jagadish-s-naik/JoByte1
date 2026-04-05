import { Gavel, Scale, AlertOctagon, Cpu, Database, CreditCard, Ban, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Gavel className="w-6 h-6 text-red-500" />,
      content: "By registering for, accessing, or using the JoByte platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the platform."
    },
    {
      title: "2. Platform Role & AI System",
      icon: <Cpu className="w-6 h-6 text-red-500" />,
      content: [
        "JoByte provides an AI-powered recruitment platform connecting candidates and employers.",
        "Our AI matching system uses semantic analysis (Sentence Transformers) to rank candidates and job listings.",
        "Match scores are indicative and do not guarantee suitability or employment outcomes.",
        "Users are responsible for ensuring the accuracy of data provided to the AI system."
      ]
    },
    {
      title: "3. Employer Obligations",
      icon: <Scale className="w-6 h-6 text-red-600" />,
      content: [
        "Job listings must represent genuine, current, and available employment opportunities.",
        "Employers must not use candidate data for any purpose other than evaluating for the specific listed role.",
        "Employers must comply with India's DPDPA, 2023 when handling candidate personal data."
      ]
    },
    {
      title: "4. Anti-Ghost Hiring Policy",
      icon: <AlertOctagon className="w-6 h-6 text-red-500" />,
      content: [
        "Ghost hiring (posting jobs without genuine intent to hire) is strictly prohibited.",
        "Significant misrepresentation of available positions will lead to formal warnings.",
        "Second violations result in financial penalties and public profile notation.",
        "Third violations result in permanent blacklisting and potential regulatory referral."
      ],
      isWarning: true
    },
    {
      title: "5. Candidate Responsibilities",
      icon: <Database className="w-6 h-6 text-rose-600" />,
      content: [
        "Candidates must provide accurate personal and professional information during onboarding.",
        "Misrepresentation of qualifications or identity is grounds for immediate account termination.",
        "When participating in simulations, candidates must adhere to proctoring rules (Safe Exam Mode)."
      ]
    },
    {
      title: "6. Anonymised Data Disclosure",
      icon: <Database className="w-6 h-6 text-red-700" />,
      content: "JoByte may anonymise and aggregate application data to generate market intelligence reports. No personally identifiable data is ever sold. Usage of the platform constitutes consent to this practice."
    },
    {
      title: "7. Payments and Refunds",
      icon: <CreditCard className="w-6 h-6 text-red-400" />,
      content: [
        "Simulation fees are disclosed at the time of application and are non-refundable once initiated.",
        "Refunds are only issued in the event of a platform-side technical failure.",
        "Payment processing is handled by third-party gateways; JoByte does not store card data."
      ]
    },
    {
      title: "8. Prohibited Conduct",
      icon: <Ban className="w-6 h-6 text-rose-400" />,
      content: [
        "Unauthorized data scraping or reverse-engineering of JoByte systems.",
        "Impersonation of any person, entity, or corporation.",
        "Posting of discriminatory, harassing, or unlawful content."
      ]
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
            Terms & Conditions
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
              className={`bg-[#0D0D0E]/50 border rounded-2xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-300 ${
                section.isWarning ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/5 shadow-[0_0_50px_rgba(239,68,68,0.02)]'
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl border ${section.isWarning ? 'bg-red-500/20 border-red-500/30' : 'bg-red-500/5 border-red-500/10'}`}>
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
              </div>
              
              {Array.isArray(section.content) ? (
                <ul className="space-y-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex gap-3 text-neutral-400 leading-relaxed font-medium">
                      <span className={`mt-1 font-black ${section.isWarning ? 'text-red-500' : 'text-red-600'}`}>•</span>
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
          <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase relative z-10">Contact Legal Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-red-500/5 rounded-full mb-2 border border-red-500/10">
                <Mail className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Legal Inquiries</p>
              <a href="mailto:horizonhacks@gmail.com" className="text-white hover:text-red-500 transition-colors font-bold">
                horizonhacks@gmail.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-red-500/5 rounded-full mb-2 border border-red-500/10">
                <Phone className="w-6 h-6 text-rose-500" />
              </div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Phone Support</p>
              <a href="tel:+916360869590" className="text-white hover:text-red-500 transition-colors font-bold">
                +91 6360869590
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-red-500/5 rounded-full mb-2 border border-red-500/10">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Headquarters</p>
              <p className="text-white font-bold">Mangalore, Karnataka, India</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          © 2026 JoByte. All rights reserved. Governed by the laws of India.
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

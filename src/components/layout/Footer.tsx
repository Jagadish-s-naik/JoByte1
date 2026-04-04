import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'AI Matching', href: '#' },
        { label: 'Exam Engine', href: '#' },
        { label: 'Skill Mapping', href: '#' },
        { label: 'Direct Apply', href: '#' },
        { label: 'API Integration', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Talent Blog', href: '#' },
        { label: 'Documentation', href: '#' },
        { label: 'Case Studies', href: '#' },
        { label: 'Live Demo', href: '#', badge: 'Live' },
        { label: 'Community', href: '#' }
      ]
    }
  ];

  return (
    <footer className="relative bg-white dark:bg-[#050505] border-t border-neutral-100 dark:border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute bottom-[-20px] left-0 right-0 pointer-events-none select-none overflow-hidden whitespace-nowrap opacity-[0.03] dark:opacity-[0.05] flex justify-center">
         <span className="text-[18vw] font-black tracking-tighter text-transparent stroke-2 stroke-neutral-900 dark:stroke-white uppercase" style={{ WebkitTextStroke: '2px currentColor' }}>
           JOBYTE
         </span>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">J</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter text-neutral-900 dark:text-white">JoByte</span>
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
              Advanced AI-powered recruitment engine for precision career architecture and enterprise-grade talent assessment.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-neutral-50 dark:bg-white/5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-primary transition-all hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="p-2 bg-neutral-50 dark:bg-white/5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-primary transition-all hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="p-2 bg-neutral-50 dark:bg-white/5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-primary transition-all hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links Sections */}
          {footerSections.map((section, idx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className="space-y-6"
            >
              <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-white transition-colors"
                    >
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      <span>{link.label}</span>
                      {link.badge && (
                         <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-inset ring-primary/20 ml-1">
                           {link.badge}
                         </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contact@jobyte.ai" className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Mail size={16} />
                  </div>
                  <span>contact@jobyte.ai</span>
                </a>
              </li>
              <li>
                <a href="tel:+1800123BYTE" className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Phone size={16} />
                  </div>
                  <span>+1 (800) 123-BYTE</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <MapPin size={16} />
                  </div>
                  <span>San Francisco, CA</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-neutral-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-500 font-medium">
            &copy; {currentYear} JoByte AI. All rights reserved. Precision Career Engineering.
          </p>
          <div className="flex items-center gap-8 text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-tighter">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

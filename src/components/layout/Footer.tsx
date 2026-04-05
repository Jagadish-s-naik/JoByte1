import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Browse Jobs', href: '/jobs' },
        { label: 'Talent Dashboard', href: '/applicant/dashboard' },
        { label: 'Employer Hub', href: '/employer/dashboard' },
        { label: 'Verification Engine', href: '/assessment' },
        { label: 'Account Settings', href: '/profile' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Precision Search', href: '/jobs?sort=score' },
        { label: 'Anti-Cheat Logic', href: '#', badge: 'v2.0' },
        { label: 'ATS Integration', href: '/employer/dashboard?tab=ats' },
        { label: 'Enterprise API', href: '#' },
        { label: 'Case Studies', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Security Protocol', href: '/privacy' },
        { label: 'System Status', href: '#', badge: 'Live' },
        { label: 'Developer Portal', href: '#' },
        { label: 'Privacy Vault', href: '/privacy' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Integrity Protocol', href: '#' },
        { label: 'Legal Notice', href: '#' }
      ]
    }
  ];

  return (
    <footer className="relative bg-white dark:bg-[#050505] border-t border-neutral-100 dark:border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute bottom-[-10px] left-0 right-0 pointer-events-none select-none overflow-hidden whitespace-nowrap opacity-[0.02] dark:opacity-[0.04] flex justify-center">
         <span className="text-[22vw] font-black tracking-[10vw] text-transparent stroke-2 stroke-neutral-900 dark:stroke-white uppercase leading-none" style={{ WebkitTextStroke: '2px currentColor' }}>
           JOBYTE
         </span>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand & Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                <span className="text-white font-black text-2xl">J</span>
              </div>
              <span className="text-3xl font-black tracking-tighter text-neutral-950 dark:text-white">JoByte<span className="text-primary">.</span></span>
            </Link>
            <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
              The world's most precise AI-powered recruitment engine, engineered for platform integrity and career architecture.
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300 font-bold group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <MapPin size={18} />
                  </div>
                  <span>Mangalore, Karnataka</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300 font-bold group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <span>horizonhacks@gmail.com</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300 font-bold group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <span>+91 6360869590</span>
               </div>
            </div>
          </motion.div>

          {/* Dynamic Link Sections */}
          {footerLinks.map((section, idx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className="space-y-8"
            >
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-950 dark:text-white pb-2 border-b border-neutral-100 dark:border-white/5 inline-block">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-white transition-all font-semibold"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-primary opacity-0 group-hover:opacity-100 italic">/</span>
                      <span>{link.label}</span>
                      {link.badge && (
                         <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase text-primary ring-1 ring-inset ring-primary/20 ml-1">
                           {link.badge}
                         </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-12 border-t border-neutral-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-1">
             <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold tracking-tight">
               &copy; {currentYear} JOBYTE ENGINE CORE. ARCHITECTED BY VJSA LABS.
             </p>
             <p className="text-[10px] text-neutral-300 dark:text-neutral-600 font-medium italic">
               The Precision Recruitment Protocol v1.0.4-stable
             </p>
          </div>
          
          <div className="flex items-center gap-8">
              <div className="flex gap-4">
                <a href="#" className="w-9 h-9 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center text-neutral-400 hover:text-primary transition-all hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center text-neutral-400 hover:text-primary transition-all hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center text-neutral-400 hover:text-primary transition-all hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  LayoutDashboard
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'applicant' | 'employer' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        setUser(session.user);
        setRole((session.user.user_metadata?.role as 'applicant' | 'employer') ?? 'applicant');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setRole((session?.user?.user_metadata?.role as 'applicant' | 'employer') ?? 'applicant');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Browse Jobs', path: '/jobs', icon: Briefcase },
    ...(user ? [
      { 
        name: role === 'employer' ? 'Dashboard' : 'My Applications', 
        path: role === 'employer' ? '/employer/dashboard' : '/applicant/dashboard', 
        icon: LayoutDashboard 
      }
    ] : [])
  ];

  // Close dropdowns when clicking outside (simple effect)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown-container')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 shadow-sm docked full-width top-0 sticky z-50">
      <div className="flex justify-between items-center h-14 px-6 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-neutral-950 dark:text-white">JoByte</Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-['Inter'] text-sm tracking-tight transition-colors duration-200 ${
                    isActive 
                      ? "font-bold text-primary dark:text-[#E53935] border-b-2 border-primary" 
                      : "font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop User Section */}
        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-neutral-600 dark:text-neutral-400 scale-95 active:scale-100 transition-transform">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="relative profile-dropdown-container">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-8 w-8 rounded-full bg-neutral-200 overflow-hidden border border-neutral-100 hover:opacity-80 transition-opacity"
              >
                <img alt="User profile avatar" className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || 'User'}&background=random`} />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-48 bg-white dark:bg-surface-900 border border-neutral-100 dark:border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-neutral-100 dark:border-white/10">
                      <p className="text-sm font-bold text-neutral-950 dark:text-white leading-none">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                        {role}
                      </p>
                    </div>
                    <Link 
                      to={`/${role || 'applicant'}/profile`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Profile Settings
                    </Link>
                    <div className="h-px bg-neutral-100 dark:bg-white/10 my-1 font-bold mx-2" />
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 font-medium text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors duration-200 scale-95 active:scale-100 transition-transform">
              Sign In
            </Link>
            <Link to="/signup" className="px-5 py-2 bg-primary text-white rounded-lg font-bold text-sm scale-95 active:scale-100 transition-transform">
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-600 dark:text-neutral-400 hover:text-primary p-2"
          >
            <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-surface-900 border-b border-neutral-100 dark:border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg ${
                    location.pathname === link.path 
                      ? 'text-primary bg-primary/5' 
                      : 'text-neutral-600 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user ? (
                <div className="pt-4 flex flex-col gap-3 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center px-4 py-2 bg-neutral-100 dark:bg-white/5 text-sm font-bold text-neutral-950 dark:text-slate-300 rounded-lg hover:bg-neutral-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-primary text-white text-center text-sm font-bold rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-neutral-100 dark:border-white/5 space-y-1">
                  <Link
                    to={`/${role || 'applicant'}/profile`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-neutral-600 dark:text-slate-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

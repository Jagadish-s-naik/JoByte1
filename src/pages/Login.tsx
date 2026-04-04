import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { user } = data;
    const role = user?.user_metadata?.role || 'applicant';
    
    if (role === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/applicant/dashboard');
    }
  };

  return (
    <div className="dot-grid relative min-h-[calc(100vh-56px)] flex items-center justify-center p-6 overflow-hidden">
      {/* Floating Architectural Decorators (Asymmetric Layout) */}
      <div className="absolute top-20 left-10 opacity-10 select-none">
        <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'wght' 200" }}>architecture</span>
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 select-none">
        <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'wght' 200" }}>work</span>
      </div>
      <div className="absolute top-1/2 -right-12 opacity-5 select-none rotate-12">
        <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'wght' 100" }}>business_center</span>
      </div>

      {/* Center Sign-In Card */}
      <div className="w-full max-w-[480px] bg-white border border-neutral-200 rounded-xl shadow-[0px_12px_32px_rgba(13,13,13,0.04)] p-10 relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="flex justify-center mb-6 hover:opacity-80 transition-opacity">
            <span className="text-3xl font-black tracking-tighter text-neutral-950">JoByte</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-950 mb-2">Welcome back</h2>
          <p className="text-neutral-500 font-medium">Continue to your career headquarters</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 group-focus-within:text-primary">mail</span>
              </div>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full h-[44px] pl-10 pr-3 bg-white border border-[#E5E7EB] rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-neutral-400" 
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 group-focus-within:text-primary">lock</span>
              </div>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full h-[44px] pl-10 pr-3 bg-white border border-[#E5E7EB] rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-neutral-400" 
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[44px] bg-[#B7131A] hover:bg-[#93000d] disabled:opacity-50 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
          </button>
        </form>

        {/* Social Divider */}
        <div className="relative my-8">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-100"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
            <span className="bg-white px-4 text-neutral-400">Or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 h-[44px] border border-[#E5E7EB] rounded-lg bg-white hover:bg-neutral-50 transition-all active:scale-95">
            <img alt="GitHub Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMkqdtCangW9m0pQ4NG11CO4KwYpndELUqBfFB960K3GKNaudvOQYb7sJGe4lZKINGc1IrgW4Jxg-u-uicVo0ZdxQ0WDUDJuv5x0Sa0kUKnyYShWKtFUW1hQto68L1J08n-64p9HpwYk_kz6p50WGSBocpghLJbkiVS6HJtzkws4C1SO7dCuyZTuHaBoJ_EiyqbeZiM7ryXssstNwYXtSkYc4-mT7d-nnGpfJidPd1beUxZmPQdSMi3jsk50zlNIFa7BrWUr79_g"/>
            <span className="text-sm font-semibold text-neutral-700">GitHub</span>
          </button>
          <button className="flex items-center justify-center gap-2 h-[44px] border border-[#E5E7EB] rounded-lg bg-white hover:bg-neutral-50 transition-all active:scale-95">
            <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXTu-qMJMDNITKCBZv9MhjNtLlxEQFXwJRI-1wslHbbc1GXf5Ofjpw05AknYh7hfzc4f_z-vzm0TLYW653yCRzldcswajeSve2O5Nzzwv-kAVhm3rzOC476PrMqW8LZKRnU0jBrFW8Zk_sF1TeflMXAgpWQIaVVPTNDhyzDaihfh0arnQFf0iKAJ8cqVj9iMSI34ndPRJC3wIGkNKb8iyiIWxri4ZCBS9fe0SzFsG4Q1_FWthtaByfHMyiXDZrc1ex0lVSEWAf0g"/>
            <span className="text-sm font-semibold text-neutral-700">Google</span>
          </button>
        </div>

        {/* Create Account Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-neutral-500 font-medium">
            Don't have an account? 
            <Link to="/signup" className="text-primary font-bold hover:underline ml-1">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

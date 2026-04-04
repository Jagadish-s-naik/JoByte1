import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart" | "style"> {
  variant?: 'primary' | 'danger' | 'ghost';
  glow?: boolean;
}

const GlowButton: React.FC<GlowButtonProps> = ({ 
  children, 
  variant = 'primary', 
  glow = true, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-md font-orbitron text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-2";
  
  const variants: Record<string, string> = {
    primary: "bg-teal-500/20 text-teal-400 border border-teal-500/50 hover:bg-teal-500/30 hover:border-teal-400",
    danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:border-red-400",
    ghost: "bg-transparent text-white/50 border border-white/10 hover:text-white hover:border-white/30"
  };

  const glows: Record<string, string> = {
    primary: "shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]",
    danger: "shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
    ghost: ""
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${glow ? glows[variant] : ''} ${className}`}
      {...props as any}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
    </motion.button>
  );
};

export default GlowButton;

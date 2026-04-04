import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  FileText, 
  Cpu, 
  UserCheck, 
  MessageSquare, 
  Trophy 
} from 'lucide-react';
import type { Candidate } from '../../types';

interface ApplicationProgressModalProps {
  application: Candidate | null;
  onClose: () => void;
}

const ApplicationProgressModal: React.FC<ApplicationProgressModalProps> = ({ application, onClose }) => {
  if (!application) return null;

  const steps = [
    {
      id: 'applied',
      title: 'Application Submitted',
      description: 'Your application has been successfully received and is in our initial queue.',
      icon: FileText,
      isCompleted: true,
      isCurrent: application.status === 'APPLIED',
    },
    {
      id: 'assessment',
      title: 'Technical Assessment',
      description: 'Evaluation of technical skills through our AI-powered testing platform.',
      icon: Cpu,
      isCompleted: ['INVITED', 'IN_PROGRESS', 'COMPLETED', 'HIRED', 'REJECTED'].includes(application.status || ''),
      isCurrent: ['INVITED', 'IN_PROGRESS'].includes(application.status || ''),
    },
    {
      id: 'review',
      title: 'Recruiter Review',
      description: 'Manual review of your profile and assessment performance by our hiring team.',
      icon: UserCheck,
      isCompleted: ['HIRED', 'REJECTED'].includes(application.status || '') && application.status !== 'COMPLETED',
      isCurrent: application.status === 'COMPLETED',
    },
    {
      id: 'interview',
      title: 'Interview Rounds',
      description: 'Face-to-face discussions with the engineering and product leadership teams.',
      icon: MessageSquare,
      isCompleted: application.status === 'HIRED',
      isCurrent: false,
    },
    {
      id: 'decision',
      title: 'Final Decision',
      description: 'The final results of the recruitment process.',
      icon: Trophy,
      isCompleted: application.status === 'HIRED',
      isCurrent: false,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl shadow-neutral-950/20 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
            <div>
              <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Application Progress</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Tracking <span className="font-semibold text-primary">{application.mission?.title}</span> at {application.mission?.company}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-10 overflow-y-auto max-h-[70vh]">
            <div className="space-y-8 relative">
              {/* Timeline Connector lines */}
              <div className="absolute left-6 top-1 bottom-1 w-0.5 bg-neutral-100 dark:bg-neutral-800" />

              {steps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 relative"
                  >
                    {/* Status Icon */}
                    <div className="relative z-10">
                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                        ${step.isCompleted 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                          : step.isCurrent
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 animate-pulse'
                            : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-400'
                        }
                      `}>
                        {step.isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                      </div>
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-bold text-lg ${step.isCompleted || step.isCurrent ? 'text-neutral-950 dark:text-white' : 'text-neutral-400'}`}>
                          {step.title}
                        </h3>
                        {step.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm leading-relaxed ${step.isCompleted || step.isCurrent ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-all"
            >
              Close
            </button>
            {application.status === 'INVITED' && (
              <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Start Assessment
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplicationProgressModal;

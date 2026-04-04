import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  ChevronRight, 
  Brain, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Layout
} from 'lucide-react';
import { useAntiCheat } from '../hooks/useAntiCheat';
import MCQTask from '../components/Assessment/MCQTask';
import CodeEditorTask from '../components/Assessment/CodeEditorTask';
import { supabase } from '../lib/supabase';

type AssessmentStage = 'INSTRUCTIONS' | 'SIMULATION' | 'ANALYSIS' | 'COMPLETED';

const Assessment: React.FC = () => {
  const [stage, setStage] = useState<AssessmentStage>('INSTRUCTIONS');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [candidateName, setCandidateName] = useState('');
  const [responses, setResponses] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState<any>(null);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const submitAssessmentRef = useRef<() => void>(() => {});

  const stableOnAutoSubmit = useCallback(() => {
    console.log("SECURITY PROTOCOL: AUTO-SUBMITTING DATA...");
    submitAssessmentRef.current();
  }, []);

  const { strikes, enterFullscreen, isFullscreen, isTabActive } = useAntiCheat(2, stableOnAutoSubmit);
  const maxStrikes = 2;

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) throw error || new Error('No data');
        setMission(data);
      } catch (err) {
        console.warn('Mission retrieval failed, using demo mission:', err);
        const getMockMission = (missionId: string) => {
          const mockMissions: Record<string, any> = {
            m1: {
              title: 'Senior React Developer',
              company: 'TechFlow',
              clearance: 'Gamma',
              tasks: [
                { id: 't1', type: 'MCQ', question: 'What is the primary benefit of React Fragments?', options: ['Performance', 'Cleaner DOM', 'State management', 'CSS scoping'], correctAnswer: 'Cleaner DOM' },
                { id: 't2', type: 'CODE', title: 'Array Flattening', description: 'Write a function to flatten a nested array.', initialCode: 'function flatten(arr) {\n  // Your code\n}', solution: 'return arr.flat(Infinity);' }
              ]
            },
            m2: {
              title: 'Frontend Engineer',
              company: 'Zentry',
              clearance: 'Beta',
              tasks: [
                { id: 't1', type: 'MCQ', question: 'Which CSS property is used for grid layout?', options: ['flex', 'grid', 'table', 'block'], correctAnswer: 'grid' },
                { id: 't2', type: 'CODE', title: 'Reverse String', description: 'Reverse a given string.', initialCode: 'function reverse(s) {\n  // Your code\n}', solution: "return s.split('').reverse().join('');" }
              ]
            },
            m12: {
              title: 'AI/ML Engineer',
              company: 'NeuralPath',
              clearance: 'Gamma',
              tasks: [
                { id: 't1', type: 'MCQ', question: 'What does CNN stand for in ML?', options: ['Central Neural Net', 'Convolutional Neural Network', 'Computer Node Network', 'Complex Neural Node'], correctAnswer: 'Convolutional Neural Network' },
                { id: 't2', type: 'CODE', title: 'Mean Squared Error', description: 'Calculate MSE for two arrays.', initialCode: 'function mse(a, b) {\n  // Your code\n}', solution: 'return a.reduce((s, v, i) => s + Math.pow(v - b[i], 2), 0) / a.length;' }
              ]
            }
          };

          return mockMissions[missionId] || {
            title: 'Quantum Systems Architect',
            company: 'Qubit Dynamics',
            clearance: 'Gamma',
            tasks: [
              {
                id: 't1',
                type: 'MCQ',
                question: 'Which architectural pattern is best suited for a high-availability, globally distributed quantum ledger?',
                options: ['Event Sourcing', 'CQRS', 'Sharded Mesh', 'Monolithic'],
                correctAnswer: 'Sharded Mesh'
              },
              {
                id: 't2',
                type: 'MCQ',
                question: "In a 'Cat State' quantum cluster, what is the primary cause of sudden decoherence when performing multi-qubit gates?",
                options: ['Thermal Noise', 'Photonic Leakage', 'Superposition Collapse', 'External Observation'],
                correctAnswer: 'Thermal Noise'
              },
              {
                id: 't3',
                type: 'CODE',
                title: 'Qubit State Stabilization',
                description: 'Implement a function stabilizeQubits(register) where state > 0.95 snaps to 1.0 and < 0.05 snaps to 0.0.',
                initialCode: 'function stabilizeQubits(register) {\n  // Your code here\n}',
                solution: 'return register.map(s => s > 0.95 ? 1.0 : (s < 0.05 ? 0.0 : s));'
              }
            ]
          };
        };

        const mockMissionData = getMockMission(id);
        setMission({
          ...mockMissionData,
          id: id
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const currentTask = mission?.tasks?.[currentTaskIndex];

  const submitAssessment = useCallback(async () => {
    if (!candidateId) return;

    // Calculate Scores (Simulated for this implementation)
    const technicalScore = Math.floor(Math.random() * 30) + 65; // 65-95
    const logicScore = Math.floor(Math.random() * 30) + 60; // 60-90
    const integrityScore = Math.max(0, 100 - (strikes * 15));
    const totalScore = Math.floor((technicalScore * 0.4) + (logicScore * 0.4) + (integrityScore * 0.2));

    const aiAnalysis = `Candidate ${candidateName} demonstrated a remarkably ${totalScore > 80 ? 'systematic and robust' : 'competent'} approach to the ${mission?.title} simulation.`;

    try {
      await supabase.from('vjsa_reports').insert([{
        candidate_id: candidateId,
        mission_id: mission?.id,
        total_score: totalScore,
        technical_score: technicalScore,
        logic_score: logicScore,
        integrity_score: integrityScore,
        strikes: strikes,
        ai_analysis: aiAnalysis,
        raw_responses: responses,
        completed_at: new Date().toISOString()
      }]);

      await supabase.from('candidates').update({ status: 'COMPLETED' }).eq('id', candidateId);
      setStage('COMPLETED');
    } catch (err) {
      console.error('Submission failed:', err);
      setStage('COMPLETED'); // Proceed to results anyway in demo mode
    }
  }, [candidateId, candidateName, mission, responses, strikes]);

  useEffect(() => {
    submitAssessmentRef.current = () => {
      setStage('ANALYSIS');
      submitAssessment();
    };
  }, [submitAssessment]);

  const startAssessment = async () => {
    if (!candidateName || !mission) return;
    
    try {
      // Register candidate in DB
      const { data } = await supabase
        .from('candidates')
        .insert([{ 
          full_name: candidateName, 
          email: `${candidateName.replace(/\s/g, '').toLowerCase()}_${Date.now()}@jobyte.com`,
          mission_id: mission.id,
          status: 'IN_PROGRESS'
        }])
        .select()
        .single();

      // If data is null (dummy client) or error, we use a fallback ID for demo
      const id = data?.id || 'demo-candidate-' + Date.now();
      setCandidateId(id);
      
      await enterFullscreen();
      setStage('SIMULATION');
    } catch (err) {
      console.error('Registration failure:', err);
      // Fallback for Demo/Testing: Allow starting anyway
      setCandidateId('demo-candidate-' + Date.now());
      await enterFullscreen();
      setStage('SIMULATION');
    }
  };

  const handleTaskComplete = (answer: string) => {
    const nextResponses = [...responses, { taskId: currentTask.id, answer }];
    setResponses(nextResponses);
    
    if (currentTaskIndex < mission.tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else {
      setStage('ANALYSIS');
      handleSubmitResults();
    }
  };

  const handleSubmitResults = async () => {
    if (!candidateId || !mission) return;

    try {
      const { data, error } = await supabase.functions.invoke('score-vjsa', {
        body: {
          candidateId,
          missionId: mission.id,
          responses,
          strikes
        }
      });

      if (error) throw error;
      setAiReport(data);
      setStage('COMPLETED');
    } catch (err) {
      console.error('Evaluation failed:', err);
      setTimeout(() => {
        setAiReport({
          total_score: 82,
          technical: 88,
          logic: 75,
          integrity: 100 - (strikes * 50),
          analysis_summary: "Candidate shows strong proficiency in core concepts. Evaluation complete.",
          verdict: "YES"
        });
        setStage('COMPLETED');
      }, 3000);
    }
  };

  const getLevelLabel = (clearance: string) => {
    const mapping: Record<string, string> = {
      'Alpha': 'Junior Level',
      'Beta': 'Mid Level',
      'Gamma': 'Senior Level'
    };
    return mapping[clearance] || clearance || 'Mid Level';
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCandidateName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '');
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      
      <div className="relative pt-24 pb-12 px-6 flex items-center justify-center min-h-[calc(100vh-64px)]">

        {/* Fullscreen Enforcer Overlay */}
        <AnimatePresence>
          {stage === 'SIMULATION' && (!isFullscreen || !isTabActive) && strikes < maxStrikes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center"
            >
              <div className="max-w-md w-full bg-surface-900 border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl shadow-red-500/10">
                <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="text-red-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Security Warning</h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                  <p className="text-red-400 font-bold text-sm uppercase tracking-widest">
                    Violation {strikes} of {maxStrikes}
                  </p>
                </div>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  The secure assessment environment has been interrupted. 
                  {strikes === 1 ? (
                    <span><strong>This is your ONLY warning.</strong> Exiting the screen again will result in <strong>automatic submission</strong> and termination of your test.</span>
                  ) : (
                    <span>Security protocol compromised. Initializing emergency data save...</span>
                  )}
                </p>
                <button
                  onClick={enterFullscreen}
                  className="w-full btn-primary h-14 rounded-2xl font-bold flex items-center justify-center gap-2 group"
                >
                  Return to Secure Environment <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-slate-500 text-sm font-medium animate-pulse">Initializing Virtual Assessment...</p>
            </motion.div>
          ) : stage === 'INSTRUCTIONS' ? (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-3xl w-full"
            >
              <div className="bg-surface-900 border border-white/5 rounded-[2.5rem] p-10 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/20">
                    <ShieldCheck className="text-primary" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold font-display">Virtual Skills Assessment (VJSA)</h1>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                       {mission?.company} <ChevronRight size={14} className="text-slate-600" /> {mission?.title}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[10px] font-bold uppercase tracking-wider mb-8">
                  {getLevelLabel(mission?.clearance)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Assessment Rules</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-sm">
                        <ShieldCheck size={18} className="text-green-500 shrink-0" />
                        <span><strong>Full-Screen Required:</strong> The assessment runs in a protected environment.</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
                        <span><strong>Integrity Check:</strong> Exiting the window or switching tabs will be recorded as a violation.</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <Lock size={18} className="text-indigo-500 shrink-0" />
                        <span><strong>No Re-entry:</strong> Once started, the assessment cannot be paused or restarted.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Platform Features</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-sm">
                        <Brain size={18} className="text-primary shrink-0" />
                        <span><strong>AI Evaluation:</strong> Your reasoning and technical approach are analyzed in real-time.</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <Clock size={18} className="text-slate-400 shrink-0" />
                        <span><strong>Estimated Time:</strong> Approximately 20-30 minutes required for completion.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-surface-800/50 border border-white/10 rounded-2xl p-6 mb-10">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Confirm Identity</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter your full name to authorize..."
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full bg-surface-900 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={!candidateName}
                  onClick={startAssessment}
                  className="w-full btn-primary h-16 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold group shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Professional Assessment <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </button>
              </div>
            </motion.div>
          ) : stage === 'SIMULATION' ? (
            <motion.div
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-5xl"
            >
              <div className="bg-surface-900 border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                      <Layout size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{mission?.title}</h2>
                      <p className="text-xs text-slate-500">Task {currentTaskIndex + 1} of {mission?.tasks?.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Integrity Score</p>
                      <p className={`text-sm font-bold font-mono ${strikes > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {100 - (strikes * 50)}%
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  </div>
                </div>

                {currentTask?.type === 'MCQ' ? (
                  <MCQTask 
                    task={currentTask} 
                    onComplete={handleTaskComplete} 
                  />
                ) : (
                  <CodeEditorTask 
                    task={currentTask} 
                    onComplete={handleTaskComplete} 
                  />
                )}
              </div>
            </motion.div>
          ) : stage === 'ANALYSIS' ? (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="text-primary animate-pulse" size={32} />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Analyzing Assessment Profile</h2>
                <p className="text-slate-400">Our VJSA reasoning engine is evaluating your performance data...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full text-center"
            >
              <div className="bg-surface-900 border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full -z-10" />
                
                <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                  <CheckCircle className="text-green-500" size={40} />
                </div>
                
                <h1 className="text-4xl font-bold mb-4">Assessment Complete</h1>
                <p className="text-slate-400 mb-10 leading-relaxed">
                  Your results have been securely transmitted to <span className="text-white font-bold">{mission?.company}</span>. 
                  A detailed performance report has been generated for their recruitment team.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Technical</p>
                    <p className="text-xl font-bold text-white">{aiReport?.technical}%</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Logic</p>
                    <p className="text-xl font-bold text-white">{aiReport?.logic}%</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Overall</p>
                    <p className="text-xl font-bold text-primary">{aiReport?.total_score}%</p>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/applicant/dashboard')}
                  className="w-full btn-primary h-14 rounded-2xl font-bold"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;

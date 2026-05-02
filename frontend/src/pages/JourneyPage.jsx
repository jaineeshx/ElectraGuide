import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, ClipboardList, UserCheck, Vote as VoteIcon, Loader2, Bell } from 'lucide-react';
import api from '../services/api';

const steps = [
  { id: 'register', title: 'Register to Vote', desc: 'Check if you are on the electoral roll or apply for Form 6.', icon: ClipboardList, date: 'ASAP' },
  { id: 'verify', title: 'Verify Details', desc: 'Ensure your name, address, and photo are correct in the EPIC card.', icon: UserCheck, date: 'Ongoing' },
  { id: 'booth', title: 'Know Your Booth', desc: 'Find your designated polling booth and candidate list.', icon: Calendar, date: 'Election Week' },
  { id: 'vote', title: 'Cast Your Vote', desc: 'Go to your booth with a valid ID and vote!', icon: VoteIcon, date: 'Polling Day' },
];

export default function JourneyPage() {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [syncingStep, setSyncingStep] = useState(null);
  const [syncedSteps, setSyncedSteps] = useState([]);

  const toggleStep = (id) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSync = async (e, step) => {
    e.stopPropagation();
    setSyncingStep(step.id);
    try {
      await api.post('/calendar/sync', {
        eventTitle: step.title,
        eventDate: step.date
      });
      setSyncedSteps(prev => [...prev, step.id]);
    } catch (error) {
      console.error('Sync failed');
    } finally {
      setSyncingStep(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-navy-chakra mb-4">Your Election Journey</h1>
        <p className="text-slate-500 text-lg">Follow these steps to ensure you're ready to vote.</p>
        
        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-saffron">{completedSteps.length}/{steps.length}</div>
            <div className="text-sm text-slate-400">Steps Completed</div>
          </div>
          <div className="w-px h-12 bg-slate-200"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-election">{Math.round((completedSteps.length / steps.length) * 100)}%</div>
            <div className="text-sm text-slate-400">Readiness Score</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 -z-10"></div>
        
        <div className="space-y-12">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isSynced = syncedSteps.includes(step.id);
            const isSyncing = syncingStep === step.id;
            const Icon = step.icon;
            
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-8 group"
              >
                <button 
                  onClick={() => toggleStep(step.id)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-green-election text-white shadow-lg shadow-green-200' : 'bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <Icon className="w-8 h-8" />
                  {isCompleted && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -bottom-1 bg-white dark:bg-slate-900 rounded-full text-green-election"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                  )}
                </button>
                
                <div className={`flex-1 glass p-6 rounded-2xl transition-all cursor-pointer hover:border-saffron ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`} onClick={() => toggleStep(step.id)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-xl font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-navy-chakra dark:text-white'}`}>{step.title}</h3>
                    <div className="flex gap-2">
                      {isSynced ? (
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                          <Bell className="w-3 h-3" /> CALENDAR SYNCED
                        </span>
                      ) : (
                        <button 
                          onClick={(e) => handleSync(e, step)}
                          disabled={isSyncing}
                          className="text-[10px] font-bold text-slate-400 hover:text-saffron transition-colors flex items-center gap-1 border border-slate-200 px-2 py-1 rounded-full"
                        >
                          {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Calendar className="w-3 h-3" />} SYNC GOOGLE CALENDAR
                        </button>
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider text-saffron bg-saffron/10 px-3 py-1 rounded-full">{step.date}</span>
                    </div>
                  </div>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

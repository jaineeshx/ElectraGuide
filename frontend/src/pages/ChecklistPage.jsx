import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Info, ShieldCheck, FileText, Fingerprint } from 'lucide-react';

const checklistItems = [
  { id: 'id_card', title: 'Voter ID (EPIC Card)', desc: 'Carry your physical EPIC card or a digital copy.', icon: Fingerprint },
  { id: 'address_proof', title: 'Identity Proof', desc: 'Aadhaar, Passport, or DL as an alternative identity proof.', icon: ShieldCheck },
  { id: 'slip', title: 'Voter Slip', desc: 'Download your voter information slip from the NVSP portal.', icon: FileText },
  { id: 'booth_info', title: 'Booth Location', desc: 'Confirm your booth address and room number.', icon: CheckSquare },
];

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleItem = (id) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const progress = (checkedItems.length / checklistItems.length) * 100;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-navy-chakra mb-2">Voter Readiness Checklist</h1>
        <p className="text-slate-500">Ensure you have everything ready before heading to the polling station.</p>
        
        <div className="mt-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-400">YOUR READINESS</span>
            <span className="text-2xl font-bold text-saffron">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-saffron"
            ></motion.div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {checklistItems.map((item) => {
          const isChecked = checkedItems.includes(item.id);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`glass p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-start gap-4 ${
                isChecked ? 'border-green-election bg-green-50/50' : 'border-transparent'
              }`}
            >
              <div className={`mt-1 flex-shrink-0 ${isChecked ? 'text-green-election' : 'text-slate-300'}`}>
                {isChecked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isChecked ? 'text-green-election' : 'text-slate-400'}`} />
                  <h3 className={`font-bold ${isChecked ? 'text-green-election' : 'text-navy-chakra'}`}>{item.title}</h3>
                </div>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 p-6 glass border-saffron/20 rounded-2xl flex gap-4 items-start">
        <Info className="w-6 h-6 text-saffron flex-shrink-0" />
        <div>
          <h4 className="font-bold text-navy-chakra mb-1">Pro Tip</h4>
          <p className="text-sm text-slate-500">Mobile phones are not allowed inside the polling booth. Leave them with a trusted person or in your vehicle.</p>
        </div>
      </div>
    </div>
  );
}

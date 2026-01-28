
import React, { useState } from 'react';
import { CarType, CarCondition, ExtraService, CarDetails } from '../types';
import { EXTRAS_LIST, ICONS } from '../constants';

interface WizardProps {
  onComplete: (details: CarDetails) => void;
  onCancel: () => void;
}

export const RecommendationWizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<CarDetails>({
    type: CarType.SEDAN,
    year: '',
    make: '',
    model: '',
    condition: CarCondition.LIGHT,
    extras: []
  });

  const TOTAL_STEPS = 3;

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else onComplete(details);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  const toggleExtra = (extra: ExtraService) => {
    setDetails(prev => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter(e => e !== extra)
        : [...prev.extras, extra]
    }));
  };

  const isStepValid = () => {
    if (step === 1) return !!details.type;
    if (step === 2) {
      return (
        details.year.trim().length >= 4 &&
        details.make.trim().length > 0 &&
        details.model.trim().length > 0 &&
        !!details.condition
      );
    }
    return true;
  };

  return (
    <div className="glass-card p-12 md:p-16 rounded-[4rem] border-white/5 max-w-4xl mx-auto shadow-3xl">
      <div className="flex items-center justify-between mb-16">
        <div className="flex gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-all duration-700 ${i <= step ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white/5'}`}></div>
          ))}
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Phase {step} of {TOTAL_STEPS}</span>
      </div>

      {step === 1 && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tight uppercase">Define Your <span className="text-blue-500">Machine.</span></h2>
            <p className="text-slate-400 font-medium">Select the chassis profile that matches your vehicle.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.values(CarType).map(type => (
              <button
                key={type}
                onClick={() => setDetails(prev => ({ ...prev, type }))}
                className={`p-8 text-[10px] font-black rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center gap-4 ${
                  details.type === type 
                    ? 'border-blue-600 bg-blue-600/10 text-white shadow-2xl shadow-blue-500/20' 
                    : 'border-white/5 bg-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div className={`p-3 rounded-xl ${details.type === type ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                   <ICONS.Car className="w-6 h-6" />
                </div>
                <span className="uppercase tracking-widest text-center">{type}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tight uppercase">Technical <span className="text-blue-500">Specs.</span></h2>
            <p className="text-slate-400 font-medium">Identity verification for precise chemical matching.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Year', key: 'year', placeholder: '2024' },
              { label: 'Make', key: 'make', placeholder: 'PORSCHE' },
              { label: 'Model', key: 'model', placeholder: '911 GT3 RS' }
            ].map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{field.label}</label>
                <input 
                  type="text" 
                  placeholder={field.placeholder}
                  value={(details as any)[field.key]}
                  onChange={e => setDetails(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-white uppercase tracking-widest placeholder:text-slate-800"
                />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Surface Contamination Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.values(CarCondition).map(level => (
                <button
                  key={level}
                  onClick={() => setDetails(prev => ({ ...prev, condition: level }))}
                  className={`p-5 text-xs font-black rounded-2xl border transition-all duration-300 flex items-center justify-center gap-3 ${
                    details.condition === level 
                      ? 'border-blue-600 bg-blue-600/10 text-white shadow-lg' 
                      : 'border-white/5 bg-white/5 hover:border-white/10 text-slate-500'
                  }`}
                >
                  <span className="uppercase tracking-widest">{level}</span>
                  {details.condition === level && <ICONS.Check className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tight uppercase">Custom <span className="text-blue-500">Modules.</span></h2>
            <p className="text-slate-400 font-medium">Augment your detailing protocol with specialized services.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {EXTRAS_LIST.map(extra => (
              <button
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className={`p-8 flex items-center justify-between text-sm font-black rounded-3xl border transition-all duration-500 group ${
                  details.extras.includes(extra.id) 
                    ? 'border-blue-600 bg-blue-600/10 text-white' 
                    : 'border-white/5 bg-white/5 hover:border-white/10 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-3 rounded-xl transition-all ${details.extras.includes(extra.id) ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                    <ICONS.Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="uppercase tracking-widest">{extra.label}</p>
                    <p className={`text-[10px] mt-1 font-bold ${details.extras.includes(extra.id) ? 'text-blue-400' : 'text-slate-600'}`}>+ R{extra.price} UNIT COST</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${details.extras.includes(extra.id) ? 'border-blue-600 bg-blue-600' : 'border-white/10'}`}>
                  {details.extras.includes(extra.id) && <ICONS.Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-6 mt-20">
        <button 
          onClick={prevStep} 
          className="flex-1 py-6 px-10 rounded-2xl border border-white/10 font-black text-slate-500 text-xs uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all"
        >
          Back
        </button>
        <button 
          onClick={nextStep} 
          disabled={!isStepValid()}
          className="flex-[2] py-6 px-10 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {step === TOTAL_STEPS ? 'Initialize Recommendation' : 'Next Phase'}
        </button>
      </div>
    </div>
  );
};

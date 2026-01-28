
import React from 'react';
import { ICONS } from '../constants';
import { AppStep } from '../types';

interface NavbarProps {
  onNavigate: (step: AppStep) => void;
  currentStep: AppStep;
  onHoverChat: (isHovering: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentStep, onHoverChat }) => (
  <header className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <button 
        onClick={() => onNavigate(AppStep.HOME)}
        className="flex items-center gap-3 text-blue-500 group text-left"
      >
        <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all">
          <ICONS.Droplets className="w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold tracking-tighter text-white leading-none">AQUAGLOW</span>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.15em] mt-1 leading-none">Auto Spa Car Wash</span>
        </div>
      </button>
      
      <nav className="hidden md:flex items-center gap-8">
        {[
          { label: 'Home', step: AppStep.HOME },
          { label: 'Services', step: AppStep.SERVICES },
          { label: 'Gallery', step: AppStep.GALLERY },
          { label: 'Equipment', step: AppStep.EQUIPMENT },
          { label: 'Contact', step: AppStep.CONTACT }
        ].map((item, idx) => (
          <button 
            key={`${item.label}-${idx}`}
            onClick={() => onNavigate(item.step)}
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all px-2 py-1 ${
              currentStep === item.step ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div 
          onMouseEnter={() => onHoverChat(true)}
          onMouseLeave={() => onHoverChat(false)}
          className="relative"
        >
          <button 
            className="p-3 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-glow flex items-center justify-center border border-blue-500/20"
          >
            <ICONS.ChatBubble className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ICONS, WASH_PACKAGES } from '../constants';
import { CarType } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;           // New: called when user clicks the X button
}

type ChatStage = 'INITIAL' | 'ASK_SIZE' | 'ASK_CONDITION' | 'ASK_MODEL' | 'RECOMMEND' | 'FINAL';

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm your AquaGlow Assistant. How can I help you preserve your vehicle's beauty today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState<ChatStage>('INITIAL');
  const [tempDetails, setTempDetails] = useState<any>({
    type: '',
    size: '',
    condition: '',
    model: ''
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customInput?: string, nextStage?: ChatStage, detailUpdate?: any) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;
    
    const userMsg = textToSend;
    if (!customInput) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const updatedDetails = detailUpdate ? { ...tempDetails, ...detailUpdate } : tempDetails;
    if (detailUpdate) {
      setTempDetails(updatedDetails);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let contextPrompt = `You are an elite car detailing assistant for AquaGlow Auto Detailing.
      CRITICAL: Your response MUST BE UNDER 30 WORDS.
      
      Context: User has a ${updatedDetails.size || 'unknown'} ${updatedDetails.type || 'unknown'} (${updatedDetails.model || 'unknown'}) in ${updatedDetails.condition || 'unknown'} condition.
      
      Packages available:
      1. Basic (R350): Surface refresh.
      2. Deluxe (R650): Meticulous refresh + Interior.
      3. Premium (R1200): Deep restorative clean + Protection.

      User said: "${userMsg}"
      `;

      if (nextStage === 'ASK_SIZE') {
        contextPrompt += "Acknowledge the vehicle type and ask which size category it fits: Compact, Mid-Size, or Large.";
      } else if (nextStage === 'ASK_CONDITION') {
        contextPrompt += "Ask how dirty the vehicle is: Light dust, Moderate grime, or Heavy contamination.";
      } else if (nextStage === 'ASK_MODEL') {
        contextPrompt += "Ask for the specific model and year of their vehicle.";
      } else if (nextStage === 'RECOMMEND') {
        contextPrompt += "Provide a tailored recommendation. Compare two packages (e.g. Deluxe vs Premium) explaining the advantage of each for their specific car/dirt level. Keep it to 30 words max.";
      } else {
        contextPrompt += "Help the user book or answer any final detailing questions concisely.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contextPrompt,
        config: {
          temperature: 0.7,
        }
      });

      const responseText = response.text || "Systems are adjusting. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
      if (nextStage) setStage(nextStage);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Systems offline. Please contact us via phone for elite service." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  const renderOptions = () => {
    if (isTyping) return null;

    if (stage === 'INITIAL') {
      return (
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Select Chassis:</p>
          {Object.values(CarType).map(type => (
            <button 
              key={type}
              onClick={() => handleSend(`My vehicle is a ${type}.`, 'ASK_SIZE', { type })}
              className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              {type}
            </button>
          ))}
        </div>
      );
    }

    if (stage === 'ASK_SIZE') {
      return (
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Choose Scale:</p>
          {['Compact', 'Mid-Size', 'Large'].map(size => (
            <button 
              key={size}
              onClick={() => handleSend(`It is a ${size} vehicle.`, 'ASK_CONDITION', { size })}
              className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              {size}
            </button>
          ))}
        </div>
      );
    }

    if (stage === 'ASK_CONDITION') {
      return (
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current State:</p>
          {['Light Dust', 'Moderate Grime', 'Heavy Contamination'].map(cond => (
            <button 
              key={cond}
              onClick={() => handleSend(`It has ${cond}.`, 'ASK_MODEL', { condition: cond })}
              className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              {cond}
            </button>
          ))}
        </div>
      );
    }

    if (stage === 'ASK_MODEL') {
      return (
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Common Specs:</p>
          {['2024 BMW X5', 'Mercedes C-Class', 'VW Polo'].map(model => (
            <button 
              key={model}
              onClick={() => handleSend(`It is a ${model}. What do you recommend?`, 'RECOMMEND', { model })}
              className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              {model}
            </button>
          ))}
        </div>
      );
    }

    if (stage === 'RECOMMEND') {
      return (
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Choose Protocol:</p>
          {WASH_PACKAGES.map(pkg => (
            <button 
              key={pkg.id}
              onClick={() => handleSend(`I choose the ${pkg.name}. How do I book?`, 'FINAL')}
              className="text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-500 transition-all shadow-glow"
            >
              Select {pkg.name}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className="fixed bottom-10 right-10 w-96 h-[600px] z-[100] flex flex-col glass-card border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] rounded-[2.5rem] overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500"
    >
      <div className="p-6 bg-blue-600 flex items-center justify-between shadow-xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ICONS.Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">AquaAssistant</h3>
            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-tighter animate-pulse mt-1">AI Protocol Engine</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 focus:outline-none p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close chatbot"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow p-6 space-y-4 overflow-y-auto bg-slate-900/40 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Synthesizing response...
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-950/80 border-t border-white/5 space-y-4">
        {renderOptions()}
        
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder={stage === 'ASK_MODEL' ? 'Type Year/Make/Model...' : 'Ask your concierge...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(undefined, stage === 'ASK_MODEL' ? 'RECOMMEND' : undefined)}
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 uppercase tracking-widest"
          />
          <button 
            onClick={() => handleSend(undefined, stage === 'ASK_MODEL' ? 'RECOMMEND' : undefined)}
            disabled={isTyping}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            <ICONS.ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
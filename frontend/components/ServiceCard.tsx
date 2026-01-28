
import React from 'react';
import { WashPackage, CarType } from '../types';
import { ICONS, CAR_TYPE_BASE_PRICES } from '../constants';

interface ServiceCardProps {
  pkg: WashPackage;
  carType?: CarType;
  onSelect?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ pkg, carType, onSelect }) => {
  const currentBase = carType ? CAR_TYPE_BASE_PRICES[carType] : CAR_TYPE_BASE_PRICES[CarType.SEDAN];
  const totalPrice = currentBase + pkg.price;

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden group hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full shadow-2xl">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={pkg.image} 
          alt={pkg.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-6 left-6">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
            {pkg.duration}
          </span>
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-white mb-2 leading-tight">{pkg.name}</h3>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{pkg.description}</p>
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-4xl font-black text-blue-400">R{totalPrice}</span>
          {!carType && <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Starting from</span>}
        </div>

        <ul className="space-y-4 mb-8 flex-grow">
          {pkg.features.slice(0, 4).map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ICONS.Check className="w-3.5 h-3.5 text-blue-400" />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <button 
          onClick={onSelect} 
          className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-2 group/btn"
        >
          Select Package
          <ICONS.ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

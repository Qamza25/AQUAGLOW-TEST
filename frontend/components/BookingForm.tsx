
import React, { useState, useMemo } from 'react';
import { WashPackage, BookingDetails, AppointmentType, CarDetails } from '../types';
import { ICONS, CAR_TYPE_BASE_PRICES, EXTRAS_LIST } from '../constants';

interface BookingFormProps {
  selectedPackage: WashPackage;
  carDetails: CarDetails | null;
  onConfirm: (details: BookingDetails) => void;
  onBack: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ selectedPackage, carDetails, onConfirm, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  
  const [form, setForm] = useState<BookingDetails>({
    date: '',
    time: '',
    customerName: '',
    customerEmail: '',
    appointmentType: AppointmentType.STUDIO
  });

  const totalPrice = useMemo(() => {
    if (!carDetails) return selectedPackage.price;
    const base = CAR_TYPE_BASE_PRICES[carDetails.type] || 100;
    const extrasTotal = carDetails.extras.reduce((acc, extraId) => {
      const extra = EXTRAS_LIST.find(e => e.id === extraId);
      return acc + (extra?.price || 0);
    }, 0);
    return base + selectedPackage.price + extrasTotal;
  }, [carDetails, selectedPackage]);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(form.date);
    
    if (!form.date) {
      errors.date = "Select Date";
    } else if (selectedDate < today) {
      errors.date = "Invalid Date";
    }

    if (!form.time) {
      errors.time = "Select Slot";
    }

    if (!form.customerName.trim()) {
      errors.customerName = "Name Required";
    }

    if (!form.customerEmail.trim()) {
      errors.customerEmail = "Email Required";
    } else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) {
      errors.customerEmail = "Invalid Email";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      setError("Please rectify data validation errors.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onConfirm(form);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="lg:col-span-7 glass-card p-12 md:p-16 rounded-[4rem] border-white/5 shadow-3xl">
        <div className="mb-12 space-y-6">
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">Lock Your <span className="text-blue-500">Slot.</span></h2>
          <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
            <p className="text-slate-300 font-medium leading-relaxed italic">
              "That’s fantastic! We’d be thrilled to give your vehicle the AquaGlow treatment and restore its showroom shine. To get your appointment secured, please let us know your preferred date and time."
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-xs font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Appointment Strategy</label>
            <div className="grid grid-cols-2 gap-4">
              {Object.values(AppointmentType).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, appointmentType: type }))}
                  className={`py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                    form.appointmentType === type 
                      ? 'border-blue-600 bg-blue-600/10 text-white' 
                      : 'border-white/5 bg-white/5 text-slate-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Target Date</label>
              <input 
                type="date" required 
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-blue-600 font-bold text-white uppercase tracking-widest"
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Selected Hour</label>
              <select 
                required
                className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-blue-600 font-bold text-white uppercase tracking-widest"
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              >
                <option value="" className="bg-slate-900">Select Slot</option>
                <option className="bg-slate-900">09:00 AM</option>
                <option className="bg-slate-900">11:00 AM</option>
                <option className="bg-slate-900">01:00 PM</option>
                <option className="bg-slate-900">03:00 PM</option>
              </select>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Full Identifier</label>
              <input 
                type="text" placeholder="NAME" required
                className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-blue-600 font-bold text-white uppercase tracking-widest"
                onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Digital Address</label>
              <input 
                type="email" placeholder="EMAIL" required
                className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-blue-600 font-bold text-white uppercase tracking-widest"
                onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-6 pt-10">
            <button type="button" onClick={onBack} className="flex-1 py-6 font-black text-slate-500 text-xs uppercase tracking-widest border border-white/10 rounded-3xl hover:bg-white/5 hover:text-white transition-all">
              Back
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-[2] py-6 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl hover:bg-blue-500 transition-all shadow-glow flex items-center justify-center">
              {isSubmitting ? 'PROCESSING...' : 'Register Appointment'}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className="glass-card p-12 rounded-[3.5rem] border-white/5 shadow-2xl sticky top-32">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10">Protocol Brief</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Package</span>
              <span className="font-black text-white text-lg">{selectedPackage.name}</span>
            </div>
            {carDetails && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Machine Type</span>
                <span className="font-black text-white text-sm uppercase tracking-widest">{carDetails.type}</span>
              </div>
            )}
            <div className="pt-6 border-t border-white/5">
              <div className="flex justify-between items-center text-2xl font-black text-blue-400">
                <span>Total Due</span>
                <span>R{totalPrice}</span>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 italic leading-relaxed">
                Review your machine's tailored preservation strategy before final transmission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

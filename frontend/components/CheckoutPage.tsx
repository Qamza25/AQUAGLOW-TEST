
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { WashPackage, BookingDetails } from '../types';

interface CheckoutProps {
  pkg: WashPackage;
  booking: BookingDetails;
  totalPrice: number;
  onSuccess: () => void;
}

export const CheckoutPage: React.FC<CheckoutProps> = ({ pkg, booking, totalPrice, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardData, setCardData] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const validate = () => {
    if (paymentMethod === 'cash') return true;
    
    const newErrors = [];
    if (!cardData.holder.trim()) newErrors.push("Card Holder name is required.");
    if (!cardData.number.trim() || cardData.number.replace(/\s/g, '').length < 12) newErrors.push("Valid Card Number is required.");
    if (!cardData.expiry.trim() || !cardData.expiry.includes('/')) newErrors.push("Valid Expiry (MM/YY) is required.");
    if (!cardData.cvv.trim() || cardData.cvv.length < 3) newErrors.push("Security Code (CVV) is required.");
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;

    setIsProcessing(true);
    // Simulate high-security API processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-12 inline-block">
          <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-30 rounded-full animate-pulse"></div>
          <div className="relative w-32 h-32 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-glow shadow-blue-500/40 rotate-6 border-4 border-white/20">
            <ICONS.Check className="w-16 h-16 stroke-[4]" />
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Payment <br />
            <span className="text-blue-500">Successful.</span>
          </h2>
          <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20 max-w-md mx-auto space-y-4">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Transaction Verified</p>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reference</span>
              <span className="text-[10px] font-black text-white">AG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</span>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">R{totalPrice}.00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                Confirmed
              </span>
            </div>
          </div>
          <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
            Your booking for the <span className="text-white font-black">{pkg.name}</span> has been synchronized. A confirmation has been transmitted to <span className="text-white">{booking.customerEmail}</span>.
          </p>
        </div>

        <button 
          onClick={onSuccess}
          className="px-16 py-6 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-glow active:scale-95"
        >
          Complete Process
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase"><span className="text-blue-500">Payment.</span></h2>
        <p className="text-slate-400 font-medium">Select your preferred settlement method for this protocol.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Payment Summary */}
        <div className="glass-card p-10 rounded-[3rem] border-white/10 space-y-8 flex flex-col">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Protocol Summary</h3>
            <p className="text-2xl font-black text-white">{pkg.name}</p>
          </div>

          <div className="space-y-4 flex-grow">
             {[
               { label: "Date", value: booking.date },
               { label: "Time Slot", value: booking.time },
               { label: "Vehicle", value: "Registered Machine" },
               { label: "Location", value: "Sandton Detailing Hub" }
             ].map((item, i) => (
               <div key={i} className="flex justify-between py-3 border-b border-white/5">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                 <span className="text-xs font-black text-white">{item.value}</span>
               </div>
             ))}
          </div>

          <div className="pt-8 border-t border-white/5 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount Due</span>
              <span className="text-5xl font-black text-blue-400">R{totalPrice}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium italic">VAT Inclusive detailing charges applied.</p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => { setPaymentMethod('card'); setErrors([]); }}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${
                paymentMethod === 'card' ? 'bg-blue-600 text-white shadow-glow' : 'text-slate-500 hover:text-white'
              }`}
            >
              <ICONS.CreditCard className="w-5 h-5" />
              Secured Card
            </button>
            <button 
              onClick={() => { setPaymentMethod('cash'); setErrors([]); }}
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${
                paymentMethod === 'cash' ? 'bg-blue-600 text-white shadow-glow' : 'text-slate-500 hover:text-white'
              }`}
            >
              <ICONS.Check className="w-5 h-5" />
              Pay at Wash
            </button>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-white/10 min-h-[350px] flex flex-col justify-center">
            {paymentMethod === 'card' ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                {errors.length > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    {errors.map((err, idx) => (
                      <p key={idx} className="text-[9px] font-black text-red-400 uppercase tracking-widest">{err}</p>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Card Holder</label>
                  <input 
                    name="holder"
                    type="text" 
                    placeholder="NAME ON ACCOUNT" 
                    value={cardData.holder}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white uppercase tracking-widest text-xs outline-none focus:border-blue-500 placeholder:text-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Card Number</label>
                  <input 
                    name="number"
                    type="text" 
                    placeholder="XXXX XXXX XXXX XXXX" 
                    value={cardData.number}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs outline-none focus:border-blue-500 placeholder:text-slate-700" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Expiry</label>
                    <input 
                      name="expiry"
                      type="text" 
                      placeholder="MM/YY" 
                      value={cardData.expiry}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs outline-none focus:border-blue-500 placeholder:text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">CVV</label>
                    <input 
                      name="cvv"
                      type="password" 
                      placeholder="XXX" 
                      value={cardData.cvv}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs outline-none focus:border-blue-500 placeholder:text-slate-700" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8 animate-in zoom-in duration-500 flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/20 mb-4">
                   <ICONS.Check className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">On-Site Settlement</h4>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[250px] mx-auto uppercase tracking-wider">
                    You have chosen to settle the balance of <span className="text-white font-black">R{totalPrice}</span> in person at the Sandton Detailing Hub.
                  </p>
                  <div className="pt-4 flex flex-col gap-2">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">CASH • DEBIT • CREDIT CARD</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">ALL METHODS ACCEPTED ON ARRIVAL</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-sm hover:bg-blue-500 transition-all shadow-glow flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                VERIFYING...
              </>
            ) : (
              paymentMethod === 'card' ? `Process Payment R${totalPrice}` : 'Confirm Booking & Pay Later'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

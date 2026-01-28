import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ServiceCard } from './components/ServiceCard';
import { RecommendationWizard } from './components/RecommendationWizard';
import { BookingForm } from './components/BookingForm';
import { Chatbot } from './components/Chatbot';
import { CheckoutPage } from './components/CheckoutPage';
import { 
  AppStep, 
  CarDetails, 
  CarCondition, 
  CarType, 
  ExtraService, 
  WashPackage, 
  BookingDetails 
} from './types';
import { WASH_PACKAGES, GALLERY_DEMOS, ICONS, CONTACT_INFO, CAR_TYPE_BASE_PRICES, EXTRAS_LIST } from './constants';
import { getAIRecommendation } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.HOME);
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [recommendedPkg, setRecommendedPkg] = useState<WashPackage | null>(null);
  const [aiText, setAiText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  
  // Chatbot state – now controlled by click instead of hover
  const [isChatOpen, setIsChatOpen] = useState(false);

  const calculateTotalPrice = useCallback((pkg: WashPackage, details: CarDetails | null) => {
    if (!details) return CAR_TYPE_BASE_PRICES[CarType.SEDAN] + pkg.price;
    const base = CAR_TYPE_BASE_PRICES[details.type] || 100;
    const extrasTotal = details.extras.reduce((acc, extraId) => {
      const extra = EXTRAS_LIST.find(e => e.id === extraId);
      return acc + (extra?.price || 0);
    }, 0);
    return base + pkg.price + extrasTotal;
  }, []);

  const handleRecommendation = async (details: CarDetails) => {
    setCarDetails(details);
    setIsLoading(true);
    setStep(AppStep.RESULT);

    let pkg = WASH_PACKAGES[1]; // Deluxe
    if (details.condition === CarCondition.HEAVY || details.type === CarType.TRUCK || details.extras.includes(ExtraService.ENGINE)) {
      pkg = WASH_PACKAGES[2]; // Premium
    } else if (details.condition === CarCondition.LIGHT && details.type === CarType.SEDAN && details.extras.length === 0) {
      pkg = WASH_PACKAGES[0]; // Basic
    }

    setRecommendedPkg(pkg);
    const text = await getAIRecommendation(details);
    setAiText(text);
    setIsLoading(false);
  };

  const handleReset = () => {
    setStep(AppStep.HOME);
    setCarDetails(null);
    setRecommendedPkg(null);
    setAiText('');
    setBooking(null);
  };

  const renderHome = () => (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-40 animate-in fade-in zoom-in duration-1000">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="images/fresh.jpg"
          className="w-full h-full object-cover opacity-30 blur-[2px] scale-105"
          alt="Car wash background"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950"></div>
      </div>

      <div className="relative z-10 max-w-5xl space-y-14 mt-12">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
          ELITE CARE FOR <br />
          <span className="text-gradient">YOUR MACHINE.</span>
        </h1>
        
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
          Experience the future of car care. Our intelligence-driven platform analyzes your vehicle's condition to deliver a showroom finish, every time.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
          <button 
            onClick={() => setStep(AppStep.WIZARD)}
            className="px-12 py-6 bg-blue-600 text-white rounded-full font-black text-lg uppercase tracking-widest hover:bg-blue-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );

  const renderServices = () => (
    <div className="py-24 space-y-24 animate-in fade-in slide-in-from-right-8 duration-700 max-w-7xl mx-auto px-6">
      <div className="text-center space-y-6">
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">The Precision <span className="text-blue-500">Fleet.</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Handcrafted detailing protocols designed for maximum paint protection and interior luxury.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {WASH_PACKAGES.map(pkg => (
          <ServiceCard 
            key={pkg.id} 
            pkg={pkg} 
            carType={carDetails?.type}
            onSelect={() => {
              setRecommendedPkg(pkg);
              setStep(AppStep.BOOKING);
            }} 
          />
        ))}
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="py-24 space-y-20 animate-in fade-in slide-in-from-left-8 duration-700 max-w-7xl mx-auto px-6">
      <div className="text-center space-y-4">
        <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Visual Benchmarks</h2>
        <h3 className="text-6xl font-black text-white tracking-tight uppercase">Mastery in <span className="text-blue-500">Motion.</span></h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {GALLERY_DEMOS.map((demo, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-[3rem] glass-card border-white/5 aspect-[4/5] shadow-2xl">
            <img 
              src={demo.image} 
              alt={demo.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90"></div>
            <div className="absolute bottom-12 left-12 right-12 space-y-3">
              <h4 className="text-3xl font-black text-white tracking-tight">{demo.title}</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{demo.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="py-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center px-6">
      <div className="relative rounded-[4rem] overflow-hidden aspect-square shadow-2xl border border-white/5 group">
        <img 
          src="images/equip.jpg" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          alt="Detailing action" 
        />
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
        <div className="absolute bottom-12 left-12 glass-card p-10 rounded-[2.5rem] max-w-xs space-y-3 border-blue-500/20">
          <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest">Nano-Ceramic Lab</p>
          <p className="text-white font-black text-xl leading-tight">Molecular protection for the ultimate shield.</p>
        </div>
      </div>
      
      <div className="space-y-16">
        <div className="space-y-6">
          <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tight uppercase">Precision <br /><span className="text-blue-500">Equipment.</span></h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">We utilize PH-neutral chemical engineering and microscopic analysis to ensure your vehicle's factory finish remains uncompromised.</p>
        </div>

        <div className="space-y-12">
          {[
            { icon: <ICONS.Droplets />, title: "Deionized Water Loop", desc: "No mineral spots. Ever. We use triple-filtered deionized water for a crystalline finish." },
            { icon: <ICONS.Sparkles />, title: "Non-Linear Decontamination", desc: "Our multi-stage clay bar process extracts microscopic pollutants from the clear coat." },
            { icon: <ICONS.Clock />, title: "Precision Workflows", desc: "Algorithmically optimized detailing ensures elite quality in record time." }
          ].map((feature, i) => (
            <div key={i} className="flex gap-8 group">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-white uppercase tracking-tight">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-100 selection:bg-blue-500/30 selection:text-blue-200 flex flex-col">
      <Navbar 
        onNavigate={setStep} 
        currentStep={step} 
        // We pass a toggle function instead of hover
        onToggleChat={() => setIsChatOpen(prev => !prev)}
      />
      
      <main className="flex-grow w-full overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {step === AppStep.HOME && renderHome()}
          {step === AppStep.SERVICES && renderServices()}
          {step === AppStep.GALLERY && renderGallery()}
          {step === AppStep.EQUIPMENT && renderEquipment()}
          {step === AppStep.CONTACT && (
            <div className="py-24 px-6">
               <div className="glass-card rounded-[4rem] p-12 md:p-20 text-center space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto border-blue-500/10">
                  <h2 className="text-7xl font-black text-white tracking-tighter uppercase">Connect <br/><span className="text-blue-500">Hub.</span></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                     <div className="space-y-2">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Digital HQ</p>
                       <p className="text-2xl font-bold text-white">{CONTACT_INFO.email}</p>
                     </div>
                     <div className="space-y-2">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Concierge Line</p>
                       <p className="text-2xl font-bold text-white">{CONTACT_INFO.phone}</p>
                     </div>
                     <div className="md:col-span-2 space-y-2">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Studio Address</p>
                       <p className="text-2xl font-bold text-white max-w-md">{CONTACT_INFO.address}</p>
                     </div>
                  </div>
               </div>
            </div>
          )}
          
          {step === AppStep.WIZARD && (
            <div className="py-12 px-6">
              <RecommendationWizard onComplete={handleRecommendation} onCancel={() => setStep(AppStep.HOME)} />
            </div>
          )}
          
          {step === AppStep.RESULT && (
            <div className="py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
               {isLoading ? (
                 <div className="flex flex-col items-center justify-center py-40 space-y-8">
                    <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="font-black uppercase tracking-[0.5em] text-blue-500 text-xs">Computing Machine Profile...</p>
                 </div>
               ) : (
                 <div className="max-w-3xl mx-auto text-center space-y-12">
                    <h2 className="text-6xl font-black uppercase text-white tracking-tighter">Recommended Profile</h2>
                    <div className="p-8 bg-blue-500/5 rounded-[3rem] border border-blue-500/10">
                      <p className="text-xl text-slate-300 italic font-medium leading-relaxed">"{aiText}"</p>
                    </div>
                    <div className="glass-card p-12 rounded-[4rem] border-blue-500/20 flex flex-col md:flex-row items-center gap-12 shadow-3xl overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full scan-line opacity-30"></div>
                      <img src={recommendedPkg?.image} className="w-56 h-56 object-cover rounded-[2.5rem] shadow-2xl" alt="Package" />
                      <div className="text-left space-y-4">
                        <h4 className="text-4xl font-black text-white">{recommendedPkg?.name}</h4>
                        <p className="text-blue-400 text-6xl font-black">
                          R{recommendedPkg ? calculateTotalPrice(recommendedPkg, carDetails) : 0}
                        </p>
                        <button onClick={() => setStep(AppStep.BOOKING)} className="mt-6 px-12 py-5 bg-blue-600 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all shadow-glow active:scale-95">Lock This Protocol</button>
                      </div>
                    </div>
                 </div>
               )}
            </div>
          )}
          
          {step === AppStep.BOOKING && recommendedPkg && (
            <div className="py-12 px-6">
              <BookingForm 
                selectedPackage={recommendedPkg} 
                carDetails={carDetails}
                onBack={() => setStep(AppStep.RESULT)} 
                onConfirm={(details) => {
                  setBooking(details);
                  setStep(AppStep.CONFIRMATION);
                }} 
              />
            </div>
          )}
          
          {step === AppStep.CONFIRMATION && (
            <div className="text-center py-24 space-y-12 animate-in fade-in zoom-in duration-1000 max-w-3xl mx-auto px-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-40 rounded-full"></div>
                <div className="relative w-40 h-40 bg-blue-600 text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl rotate-12">
                  <ICONS.Check className="w-20 h-20 stroke-[3]" />
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-7xl font-black text-white tracking-tighter uppercase">Slot <span className="text-blue-500">Secured.</span></h2>
                <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                  Encryption verified. Proceed to final payment to synchronize your detailing window.
                </p>
              </div>
              <button 
                onClick={() => setStep(AppStep.CHECKOUT)}
                className="px-12 py-6 bg-blue-600 text-white rounded-full font-black text-sm uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-glow active:scale-95"
              >
                Go to Checkout
              </button>
            </div>
          )}
          
          {step === AppStep.CHECKOUT && recommendedPkg && booking && (
            <div className="px-6">
              <CheckoutPage 
                pkg={recommendedPkg} 
                booking={booking} 
                totalPrice={calculateTotalPrice(recommendedPkg, carDetails)}
                onSuccess={() => {
                  alert("Protocol Transmitted. See you at the hub.");
                  handleReset();
                }} 
              />
            </div>
          )}
        </div>
      </main>
      
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
      
      <footer className="border-t border-white/5 py-24 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-blue-500">
              <ICONS.Droplets className="w-10 h-10" />
              <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">AquaGlow</span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
              Redefining automotive preservation through elite equipment and chemical precision.
            </p>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Directory</h4>
            <ul className="space-y-5 text-sm font-bold text-slate-500">
              <li><button onClick={() => setStep(AppStep.HOME)} className="hover:text-blue-400 transition-colors uppercase tracking-widest">Home</button></li>
              <li><button onClick={() => setStep(AppStep.SERVICES)} className="hover:text-blue-400 transition-colors uppercase tracking-widest">Services</button></li>
              <li><button onClick={() => setStep(AppStep.GALLERY)} className="hover:text-blue-400 transition-colors uppercase tracking-widest">Gallery</button></li>
              <li><button onClick={() => setStep(AppStep.EQUIPMENT)} className="hover:text-blue-400 transition-colors uppercase tracking-widest text-left">Equipment</button></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Location Info</h4>
            <ul className="space-y-5 text-sm font-bold text-slate-500">
              <li><button onClick={() => setStep(AppStep.CONTACT)} className="hover:text-blue-400 transition-colors uppercase tracking-widest text-left">Contact Hub</button></li>
              <li className="text-slate-600 uppercase tracking-widest text-[10px] leading-relaxed">
                {CONTACT_INFO.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2024 AQUAGLOW. OPERATING OUT OF SANDTON, SOUTH AFRICA.</p>
          <div className="flex gap-8 items-center">
             <div className="h-4 w-4 rounded-full bg-blue-500 shadow-glow"></div>
             <p className="text-[10px] font-black text-white uppercase tracking-widest">Open: Everyday 08:00 - 18:00</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
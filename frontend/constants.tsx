
import React from 'react';
import { WashPackage, ExtraService, CarType } from './types';

export const CAR_TYPE_BASE_PRICES: Record<CarType, number> = {
  [CarType.SEDAN]: 100,
  [CarType.COUPE]: 120,
  [CarType.HATCHBACK]: 140,
  [CarType.SUV]: 160,
  [CarType.TRUCK]: 200,
  [CarType.LUXURY]: 250,
};

export const WASH_PACKAGES: WashPackage[] = [
  {
    id: 'basic',
    name: 'Eco Refresh',
    price: 0, // Base price only
    duration: '30 mins',
    description: 'A swift, high-pressure foam bath followed by a spot-free rinse. Perfect for regular maintenance.',
    features: ['Snow Foam Treatment', 'Wheel & Rim Scrub', 'Towel Dry', 'Tire Dressing'],
    image: 'images/fresh.jpg'
  },
  {
    id: 'deluxe',
    name: 'Aqua Glow Deluxe',
    price: 300, // Surcharge over base
    duration: '60 mins',
    description: 'Our most popular choice. Combines exterior brilliance with a deep interior vacuum and sanitization.',
    features: ['All Basic Features', 'Spray Wax Shield', 'Deep Interior Vacuum', 'AC Vents Sanitized', 'Fragrance Mist'],
    image: 'images/deluxe.jpg'
  },
  {
    id: 'premium',
    name: 'Executive Detail',
    price: 850, // Surcharge over base
    duration: '120 mins',
    description: 'Showroom-level restoration. Includes paint decontamination and premium polymer sealant protection.',
    features: ['All Deluxe Features', 'Clay Bar Paint Prep', 'Carnauba Wax Polish', 'Engine Bay Detailing', 'Steam Upholstery Clean'],
    image: 'images/executive.jpg'
  }
];

export const GALLERY_DEMOS = [
  {
    title: "Wheel Restoration",
    desc: "Non-acidic chemical cleaning for pristine alloys.",
    image: "images/wheel.jpg"
  },
  {
    title: "Interior Vacuuming",
    desc: "Industrial-grade extraction removing every trace of dust and debris.",
    image: "images/vacum.jpg"
  },
  {
    title: "Buffing",
    desc: "Multi-stage machine polishing to restore factory gloss and eliminate surface imperfections.",
    image: "images/buff.jpg"
  }
];

export const EXTRAS_LIST = [
  { id: ExtraService.INTERIOR, label: 'Interior Rejuvenation', price: 150 },
  { id: ExtraService.WAX, label: 'Nano-Ceramic Wax', price: 200 },
  { id: ExtraService.ENGINE, label: 'Precision Engine Clean', price: 300 }
];

export const CONTACT_INFO = {
  address: "124 Rivonia Road, Sandton, Johannesburg, 2196, South Africa",
  phone: "+27 11 456 7890",
  email: "hello@aquaglow.co.za",
  hours: [
    { day: "Mon - Sun", time: "08:00 - 18:00" }
  ]
};

export const ICONS = {
  Car: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  Sparkles: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  ),
  Calendar: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Check: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronRight: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Droplets: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.8 4-4 0-2.2-4-6-4-6s-4 3.8-4 6c0 2.2 1.8 4 4 4Z" />
      <path d="M17 11c1.1 0 2-.9 2-2 0-1.1-2-3-2-3s-2 1.9-2 3c0 1.1.9 2 2 2Z" />
      <path d="M15 18c1.1 0 2-.9 2-2 0-1.1-2-3-2-3s-2 1.9-2 3c0 1.1.9 2 2 2Z" />
    </svg>
  ),
  Clock: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Phone: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  MapPin: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Mail: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Brain: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
    </svg>
  ),
  ChatBubble: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  CreditCard: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  QrCode: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3" />
      <path d="M7 12h3" />
      <path d="M12 12h.01" />
      <path d="M12 17h.01" />
      <path d="M17 12h.01" />
      <path d="M17 17h3" />
    </svg>
  )
};

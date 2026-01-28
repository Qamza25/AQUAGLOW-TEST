# AquaGlow Auto Detailing – Frontend Application

## 🚀 Project Overview
**AquaGlow** is a premium car detailing service platform featuring an AI-powered recommendation engine, an interactive booking flow, and a modern glassmorphism-inspired user interface.

The application is designed to provide users with personalized car wash recommendations, seamless booking, and a premium digital experience across all devices.

---

## 🎯 Key Features
- **AI-Powered Chatbot** – Google Gemini integration for personalized car wash recommendations  
- **Multi-Step Wizard** – Guided vehicle profiling for accurate service matching  
- **Dynamic Pricing Engine** – Real-time price calculation based on vehicle type and extras  
- **Interactive Booking System** – Date and time selection with form validation  
- **Simulated Checkout** – Payment processing with card and cash options  
- **Responsive Design** – Fully mobile-optimized using Tailwind CSS  
- **Modern UI/UX** – Glassmorphism effects, animations, and premium styling  

---

## 📁 Project Structure

<img width="579" height="324" alt="image" src="https://github.com/user-attachments/assets/ae558da6-f595-413b-b17c-ce60b8a286e4" />




---

## 🛠️ Technology Stack

| Technology | Purpose |
|----------|--------|
| React 19 | Component-based UI framework |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| Google Gemini AI | Intelligent car wash recommendations |
| ES Modules | Modern browser-native imports |
| Vite (implied) | Build tool & development server |

---

## 🎨 Design System

### Colors
- **Primary:** `#3b82f6` (Blue-600)  
- **Background:** `#0f172a` (Slate-950)  
- **Glass Effect:** `rgba(30, 41, 59, 0.7)` with backdrop blur  
- **Accents:** Blue/Cyan gradients  

### Typography
- **Font:** Plus Jakarta Sans (Google Fonts)  
- **Style:** Uppercase, tracking-widest for headings  
- **Hierarchy:** 10px labels → 5xl main titles  

### Effects
- Glassmorphism (frosted glass cards)  
- Glowing blue shadows (`shadow-glow`)  
- Fade, slide, and zoom animations  
- Animated scan-line tech effects  

---

## 🔧 Component Details

### 1. BookingForm.tsx
**Purpose:** Collect customer appointment details  
**Features:**
- Date and time picker with validation  
- Customer information form with email validation  
- Dynamic price summary sidebar  
- Back/Submit flow with loading states  

### 2. Chatbot.tsx
**Purpose:** AI-powered vehicle assistant  
**Features:**
- Multi-stage conversation flow (6 stages)  
- Google Gemini API integration  
- Quick-select buttons for common inputs  
- Typing indicators and auto-scroll  
- Hover-based activation from the navbar  

### 3. RecommendationWizard.tsx
**Purpose:** Guided vehicle profiling  
**Features:**
- 3-step wizard: Type → Specs → Extras  
- Visual vehicle selector  
- Year/Make/Model input  
- Condition assessment  
- Add-on service selection with pricing  

### 4. CheckoutPage.tsx
**Purpose:** Payment processing interface  
**Features:**
- Card vs Cash payment options  
- Card detail validation  
- Transaction simulation with success screen  
- Order summary with reference number  

### 5. Navbar.tsx
**Purpose:** Navigation and step tracking  
**Features:**
- Dynamic step highlighting  
- Chatbot trigger with hover effects  
- Brand logo with animations  
- Responsive navigation menu  

### 6. App.tsx
**Purpose:** Main application orchestrator  
**Features:**
- Step-based routing (8 application steps)  
- Booking flow state management  
- AI recommendation integration  
- Conditional page rendering  

---

## 🚗 Application Flow
HOME → WIZARD → RESULT → BOOKING → CONFIRMATION → CHECKOUT → SUCCESS

yaml
Copy code

Additional Pages:
- Services
- Gallery
- Equipment
- Contact

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- Google Gemini API key
- Modern browser with ES Modules support

🛠️ Development
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build


🌐 Direct Browser Usage

The app is configured for browser-native ES modules — no build step required for development.

Simply open index.html in a modern browser to get started.

🤖 AI Integration
Gemini Service (services/geminiService.ts)

Model: gemini-3-flash-preview

Temperature: 0.7 (balanced creativity)

Prompt Engineering: Context-aware vehicle recommendations

Error Handling: Graceful fallback responses on API failure

Chatbot Prompt Strategy

Context Injection: Vehicle details and available packages

Length Control: Responses limited to under 30 words

Stage Awareness: Different prompts per conversation phase

💰 Pricing Model
Base Prices by Vehicle Type
Vehicle Type	Base Price
Sedan	R100
Coupe	R120
Hatchback	R140
SUV	R160
Truck	R200
Luxury	R250
Service Packages

Eco Refresh (R0 surcharge) – Basic exterior wash

Aqua Glow Deluxe (R300 surcharge) – Interior + exterior

Executive Detail (R850 surcharge) – Premium restoration

Extra Services

Interior Rejuvenation: R150

Nano-Ceramic Wax: R200

Precision Engine Clean: R300

Total Price Formula
Base Price + Package Surcharge + Extras Total

📱 Responsive Design
Breakpoint	Layout
Mobile (< 640px)	Single column, stacked
Tablet (640px–1024px)	2-column grids
Desktop (1024px+)	Multi-column, sidebars
Touch Optimization

Adequate tap targets (minimum 44px)

Gesture-friendly spacing

Mobile-first animations

🔐 Security & Best Practices
Implemented

API keys via environment variables

Client-side form validation

TypeScript for type safety

Error boundaries for AI failures

Recommended for Production

HTTPS enforcement

Content Security Policy (CSP) headers

Rate limiting on API calls

Payment gateway integration (Stripe / PayPal)

📈 Backlog & Roadmap
High Priority

AG-001: Refine Gemini prompting for better recommendations

AG-006: Secure payment gateway integration

Medium Priority

AG-003: Geolocation for mobile service radius

AG-004: Text-to-speech for confirmation

Low Priority

AG-005: Loyalty points program

🎯 Performance Optimizations
Implemented

useMemo for price calculations

useCallback for stable function references

Lazy image loading

Conditional component rendering

Potential Improvements

Code splitting by route

Image optimization pipeline

Service worker for offline capabilities

🐛 Troubleshooting
Common Issues

Gemini API Errors: Check API_KEY environment variable

Styles Not Loading: Verify Tailwind CDN in index.html

Module Import Errors: Ensure browser supports ES modules

Date Validation Issues: Check timezone settings

Debug Tools

Browser DevTools for React

Network tab for API requests

Console for TypeScript errors

📄 License & Attribution

Icons: Custom SVG components

Fonts: Google Fonts (Plus Jakarta Sans)

Colors: Tailwind CSS palette

AI: Google Gemini API

© 2024 AquaGlow Auto Spa. All rights reserved.

🚀 Quick Start

Clone the repository

Add your Gemini API key to environment variables

Open index.html in a modern browser

Click "Book Now" to start the flow

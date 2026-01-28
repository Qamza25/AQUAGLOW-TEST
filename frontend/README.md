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

### Environment Variables
```bash
API_KEY=your_gemini_api_key_here


### Development
npm install
npm run dev
npm run build


### Direct Browser Usage
The application supports browser-native ES modules and can run without a build step for development.

### 🤖 AI Integration
Gemini Service (services/geminiService.ts)

-Model: gemini-3-flash-preview
-Context-aware recommendations
-Graceful fallback handling on API failure

### Prompt Strategy

-Vehicle context injection
-Responses limited to under 30 words
-Stage-aware prompts per conversation phase

### 💰 Pricing Model
Base Prices
Vehicle Type	Base Price
Sedan	R100
Coupe	R120
Hatchback	R140
SUV	R160
Truck	R200
Luxury	R250

Service Packages
Eco Refresh: R0

Aqua Glow Deluxe: R300

Executive Detail: R850

Extra Services
Interior Rejuvenation: R150

Nano-Ceramic Wax: R200

Precision Engine Clean: R300

Total Price Formula:

mathematica
Copy code
Base Price + Package Surcharge + Extras
📱 Responsive Design
Breakpoint	Layout
Mobile (<640px)	Single column
Tablet (640–1024px)	Two-column grids
Desktop (1024px+)	Multi-column layouts

Touch-optimized with large tap targets and mobile-first animations.

🔐 Security & Best Practices
Implemented
Environment variables for API keys

Client-side form validation

TypeScript for type safety

Error handling for AI failures

Recommended for Production
HTTPS enforcement

Content Security Policy (CSP)

API rate limiting

Payment gateway integration (Stripe/PayPal)

📈 Backlog & Roadmap
High Priority
AG-001: Improve Gemini prompting

AG-006: Secure payment gateway integration

Medium Priority
AG-003: Geolocation support

AG-004: Text-to-speech confirmations

Low Priority
AG-005: Loyalty points program

🎯 Performance Optimizations
Implemented
useMemo for pricing calculations

useCallback for stable references

Lazy loading

Conditional rendering

Planned Improvements
Route-based code splitting

Image optimization pipeline

Service worker for offline support

🐛 Troubleshooting
Common Issues
Gemini API errors: Verify API_KEY

Styles not loading: Check Tailwind CDN

Module import errors: Ensure ES module support

Date validation issues: Check timezone settings

Debug Tools
Browser DevTools

Network tab for API calls

Console for TypeScript errors

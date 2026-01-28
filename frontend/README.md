# AquaGlow Auto Detailing – Frontend Application

## 🚀 Project Overview

**AquaGlow** is a premium car detailing service platform featuring an AI-powered recommendation engine, an interactive booking flow, and a modern glassmorphism-inspired user interface.

The application delivers personalized car wash recommendations, seamless booking, and a polished digital experience across all devices.

---

## 🎯 Key Features

* **AI-Powered Chatbot** – Google Gemini integration for personalized car wash recommendations
* **Multi-Step Wizard** – Guided vehicle profiling for accurate service matching
* **Dynamic Pricing Engine** – Real-time price calculation based on vehicle type and selected extras
* **Interactive Booking System** – Date and time selection with built-in form validation
* **Simulated Checkout** – Payment flow with card and cash options
* **Responsive Design** – Fully mobile-optimized using Tailwind CSS
* **Modern UI/UX** – Glassmorphism effects, animations, and premium styling

---

## 📁 Project Structure

```
AQUAGLOW/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BookingForm.tsx
│   │   ├── Chatbot.tsx
│   │   ├── RecommendationWizard.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── Navbar.tsx
│   ├── services/
│   │   └── geminiService.ts
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

---

## 🛠️ Technology Stack

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| React 19         | Component-based UI framework         |
| TypeScript       | Type-safe development                |
| Tailwind CSS     | Utility-first styling                |
| Google Gemini AI | Intelligent car wash recommendations |
| ES Modules       | Modern browser-native imports        |
| Vite             | Development server and build tool    |

---

## 🎨 Design System

### Colors

* **Primary:** `#3b82f6` (Blue-600)
* **Background:** `#0f172a` (Slate-950)
* **Glass Effect:** `rgba(30, 41, 59, 0.7)` with backdrop blur
* **Accents:** Blue/Cyan gradients

### Typography

* **Font:** Plus Jakarta Sans (Google Fonts)
* **Style:** Uppercase headings with `tracking-widest`
* **Hierarchy:** 10px labels → 5xl main titles

### Visual Effects

* Glassmorphism (frosted glass cards)
* Glowing blue shadows (`shadow-glow`)
* Fade, slide, and zoom animations
* Animated scan-line tech effects

---

## 🔧 Component Overview

### BookingForm.tsx

**Purpose:** Collects customer appointment details

* Date and time picker with validation
* Customer details with email validation
* Dynamic price summary sidebar
* Back/Submit flow with loading states

### Chatbot.tsx

**Purpose:** AI-powered vehicle assistant

* 6-stage guided conversation flow
* Google Gemini API integration
* Quick-select buttons for faster input
* Typing indicators and auto-scroll
* Hover-based activation from the navbar

### RecommendationWizard.tsx

**Purpose:** Guided vehicle profiling

* 3-step wizard: Vehicle Type → Specifications → Extras
* Visual vehicle selector
* Year/Make/Model inputs
* Condition assessment
* Add-on services with real-time pricing

### CheckoutPage.tsx

**Purpose:** Payment processing interface

* Card and cash payment options
* Card detail validation
* Transaction simulation with success state
* Order summary with reference number

### Navbar.tsx

**Purpose:** Navigation and step tracking

* Dynamic step highlighting
* Chatbot trigger with hover effects
* Animated brand logo
* Responsive navigation menu

### App.tsx

**Purpose:** Main application orchestrator

* Step-based routing (8 application steps)
* Global booking state management
* AI recommendation integration
* Conditional page rendering

---

## 🚗 Application Flow

```
HOME → WIZARD → RESULT → BOOKING → CONFIRMATION → CHECKOUT → SUCCESS
```

**Additional Pages:**

* Services
* Gallery
* Equipment
* Contact

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js 18+
* Google Gemini API key
* Modern browser with ES Modules support

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🌐 Direct Browser Usage

The application supports browser-native ES modules.

For development without a build step:

1. Add your Gemini API key to environment variables
2. Open `index.html` in a modern browser
3. Start using the application

---

## 🤖 AI Integration

**Gemini Service:** `services/geminiService.ts`

* **Model:** `gemini-3-flash-preview`
* **Temperature:** `0.7` (balanced creativity)
* **Prompt Strategy:** Context-aware vehicle recommendations
* **Error Handling:** Graceful fallback responses on API failure

### Chatbot Prompt Strategy

* Context injection using vehicle details and service packages
* Responses limited to under 30 words
* Stage-aware prompts per conversation phase

---

## 💰 Pricing Model

### Base Prices by Vehicle Type

| Vehicle Type | Base Price |
| ------------ | ---------- |
| Sedan        | R100       |
| Coupe        | R120       |
| Hatchback    | R140       |
| SUV          | R160       |
| Truck        | R200       |
| Luxury       | R250       |

### Service Packages

* **Eco Refresh** (R0 surcharge) – Basic exterior wash
* **Aqua Glow Deluxe** (R300 surcharge) – Interior + exterior
* **Executive Detail** (R850 surcharge) – Premium restoration

### Extra Services

* Interior Rejuvenation: R150
* Nano-Ceramic Wax: R200
* Precision Engine Clean: R300

**Total Price Formula:**

```
Base Price + Package Surcharge + Extras Total
```

---

## 📱 Responsive Design

| Breakpoint            | Layout                            |
| --------------------- | --------------------------------- |
| Mobile (< 640px)      | Single-column, stacked layout     |
| Tablet (640px–1024px) | Two-column grids                  |
| Desktop (1024px+)     | Multi-column layout with sidebars |

### Touch Optimization

* Minimum tap targets of 44px
* Gesture-friendly spacing
* Mobile-first animations

---

## 🔐 Security & Best Practices

### Implemented

* API keys managed via environment variables
* Client-side form validation
* TypeScript for type safety
* Error boundaries for AI failures

### Recommended for Production

* HTTPS enforcement
* Content Security Policy (CSP) headers
* API rate limiting
* Secure payment gateway integration (Stripe / PayPal)

---

## 📈 Backlog & Roadmap

### High Priority

* **AG-001:** Refine Gemini prompting for improved recommendations
* **AG-006:** Secure payment gateway integration

### Medium Priority

* **AG-003:** Geolocation-based mobile service radius
* **AG-004:** Text-to-speech confirmation messages

### Low Priority

* **AG-005:** Loyalty and rewards program

---

## 🎯 Performance Optimizations

### Implemented

* `useMemo` for pricing calculations
* `useCallback` for stable function references
* Lazy loading for images
* Conditional component rendering

### Potential Improvements

* Route-based code splitting
* Image optimization pipeline
* Service worker for offline support

---

## 🐛 Troubleshooting

### Common Issues

* **Gemini API Errors:** Verify `API_KEY` configuration
* **Styles Not Loading:** Confirm Tailwind CDN or build setup
* **Module Import Errors:** Ensure ES module support in browser
* **Date Validation Issues:** Check local timezone settings

### Debugging Tools

* Browser DevTools (React inspection)
* Network tab for API requests
* Console for TypeScript errors

---

## 📄 License & Attribution

* **Icons:** Custom SVG components
* **Fonts:** Google Fonts – Plus Jakarta Sans
* **Colors:** Tailwind CSS palette
* **AI:** Google Gemini API

© 2024 AquaGlow Auto Spa. All rights reserved.

---

## 🚀 Quick Start

1. Clone the repository
2. Add your Google Gemini API key to environment variables
3. Install dependencies and run the dev server, or open `index.html` directly
4. Click **“Book Now”** to begin the booking flow

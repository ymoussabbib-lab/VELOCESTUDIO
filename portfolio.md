# Got it—everything has been consolidated below into a single, fully self-contained Markdown specification file ready to copy and pass directly to your AI agent.

# 

# ```markdown

# \# 🚀 MASTER AUTONOMOUS SPECIFICATION: VELOCE STUDIO PORTFOLIO

# 

# > \*\*DIRECTIVE FOR AI CODING AGENT (Cursor / Claude 3.5 Sonnet / Copilot Workspace):\*\*

# > You are acting as the Lead Full-Stack Engineer and UX Designer. Execute this specification end-to-end autonomously. Create all project files, configuration files, script files, UI components, and App Router pages exactly as defined below. Do not leave placeholders, truncation, or request manual user setup.

# 

# \---

# 

# \## 1. AGENT INITIALIZATION PROMPT

# 

# Read this specification document completely. Create the Next.js 14+ App Router project structure, install the required npm/python dependencies, write all source code files, run the screenshot automation script using Playwright, and verify that `npm run build` succeeds without errors.

# 

# \---

# 

# \## 2. DESIGN SYSTEM \& TAILWIND CONFIGURATION

# 

# \### File: `tailwind.config.js`

# ```javascript

# /\*\* @type {import('tailwindcss').Config} \*/

# module.exports = {

# &#x20; content: \[

# &#x20;   "./pages/\*\*/\*.{js,ts,jsx,tsx,mdx}",

# &#x20;   "./components/\*\*/\*.{js,ts,jsx,tsx,mdx}",

# &#x20;   "./app/\*\*/\*.{js,ts,jsx,tsx,mdx}",

# &#x20; ],

# &#x20; theme: {

# &#x20;   extend: {

# &#x20;     colors: {

# &#x20;       obsidian: "#0B0F17",

# &#x20;       surface: "#161E2E",

# &#x20;       surfaceHover: "#1E293B",

# &#x20;       accentCyan: "#06B6D4",

# &#x20;       accentTeal: "#14B8A6",

# &#x20;       statusEmerald: "#10B981",

# &#x20;       mutedText: "#94A3B8",

# &#x20;       brightText: "#F8FAFC",

# &#x20;     },

# &#x20;   },

# &#x20; },

# &#x20; plugins: \[],

# };

# 

# ```

# 

# \### File: `app/globals.css`

# 

# ```css

# @tailwind base;

# @tailwind components;

# @tailwind utilities;

# 

# :root {

# &#x20; --background: #0B0F17;

# &#x20; --foreground: #F8FAFC;

# }

# 

# body {

# &#x20; color: var(--foreground);

# &#x20; background: var(--background);

# &#x20; font-family: Arial, Helvetica, sans-serif;

# }

# 

# ```

# 

# \---

# 

# \## 3. SCREENSHOT AUTOMATION SCRIPT

# 

# \### File: `scripts/capture\_screenshots.py`

# 

# ```python

# import os

# import asyncio

# from playwright.async\_api import async\_playwright

# 

# TARGET\_APPS = \[

# &#x20;   {"name": "fitpulse", "url": "\[https://appfit-plus.netlify.app](https://appfit-plus.netlify.app)"},

# &#x20;   {"name": "estatepulse", "url": "\[https://appreal-estate.netlify.app](https://appreal-estate.netlify.app)"},

# &#x20;   {"name": "salonflow", "url": "\[https://salonbeautyapp.netlify.app](https://salonbeautyapp.netlify.app)"},

# &#x20;   {"name": "restaurant-kds", "url": "\[https://appmanagerestaurant.netlify.app](https://appmanagerestaurant.netlify.app)"},

# &#x20;   {"name": "restaurant-menu", "url": "\[https://rastaurant-app.netlify.app](https://rastaurant-app.netlify.app)"}

# ]

# 

# async def capture\_all\_screenshots():

# &#x20;   output\_dir = os.path.join(os.getcwd(), "public", "screenshots")

# &#x20;   os.makedirs(output\_dir, exist\_ok=True)

# 

# &#x20;   async with async\_playwright() as p:

# &#x20;       browser = await p.chromium.launch(headless=True)

# 

# &#x20;       for app in TARGET\_APPS:

# &#x20;           # Desktop Capture (1440x900)

# &#x20;           desktop\_context = await browser.new\_context(viewport={"width": 1440, "height": 900})

# &#x20;           desktop\_page = await desktop\_context.new\_page()

# &#x20;           print(f"Capturing Desktop: {app\['name']}...")

# &#x20;           await desktop\_page.goto(app\["url"], wait\_until="networkidle")

# &#x20;           await desktop\_page.screenshot(path=os.path.join(output\_dir, f"{app\['name']}-desktop.png"))

# &#x20;           await desktop\_context.close()

# 

# &#x20;           # Mobile Capture (390x844 - iPhone 13)

# &#x20;           mobile\_context = await browser.new\_context(

# &#x20;               viewport={"width": 390, "height": 844},

# &#x20;               is\_mobile=True,

# &#x20;               user\_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15\_0 like Mac OS X) AppleWebKit/605.1.15"

# &#x20;           )

# &#x20;           mobile\_page = await mobile\_context.new\_page()

# &#x20;           print(f"Capturing Mobile: {app\['name']}...")

# &#x20;           await mobile\_page.goto(app\["url"], wait\_until="networkidle")

# &#x20;           await mobile\_page.screenshot(path=os.path.join(output\_dir, f"{app\['name']}-mobile.png"))

# &#x20;           await mobile\_context.close()

# 

# &#x20;       await browser.close()

# &#x20;       print("✅ Screenshots successfully saved to public/screenshots/")

# 

# if \_\_name\_\_ == "\_\_main\_\_":

# &#x20;   asyncio.run(capture\_all\_screenshots())

# 

# ```

# 

# \---

# 

# \## 4. DATA MODEL \& CONTENT SCHEMA

# 

# \### File: `data/projects.ts`

# 

# ```typescript

# export interface ProjectWorkflow {

# &#x20; step: number;

# &#x20; title: string;

# &#x20; description: string;

# }

# 

# export interface Project {

# &#x20; slug: string;

# &#x20; name: string;

# &#x20; category: string;

# &#x20; tagline: string;

# &#x20; liveUrl: string;

# &#x20; secondLiveUrl?: string;

# &#x20; description: string;

# &#x20; heroImage: string;

# &#x20; screenshots: {

# &#x20;   desktop: string\[];

# &#x20;   mobile: string\[];

# &#x20; };

# &#x20; workflows: ProjectWorkflow\[];

# &#x20; features: string\[];

# &#x20; techStack: string\[];

# &#x20; isEcosystem?: boolean;

# }

# 

# export const PROJECTS\_DATA: Project\[] = \[

# &#x20; {

# &#x20;   slug: "fitpulse-pro",

# &#x20;   name: "FitPulse PRO",

# &#x20;   category: "Fitness \& Wellness SaaS",

# &#x20;   tagline: "Gym Management \& Member Operations OS",

# &#x20;   liveUrl: "\[https://appfit-plus.netlify.app](https://appfit-plus.netlify.app)",

# &#x20;   description: "Complete gym management platform unifying front-desk QR access terminals with recurring billing engines, member portals, and trainer scheduling.",

# &#x20;   heroImage: "/screenshots/fitpulse-desktop.png",

# &#x20;   screenshots: {

# &#x20;     desktop: \["/screenshots/fitpulse-desktop.png"],

# &#x20;     mobile: \["/screenshots/fitpulse-mobile.png"]

# &#x20;   },

# &#x20;   workflows: \[

# &#x20;     { step: 1, title: "Member Onboarding", description: "Collect client profile data, assign active plan, and match with trainer." },

# &#x20;     { step: 2, title: "QR Access Terminal", description: "Scan digital pass at reception terminal for automated entry validation." },

# &#x20;     { step: 3, title: "Automated POS \& Billing", description: "Process recurring membership payments and log digital invoices." },

# &#x20;     { step: 4, title: "Retention Engine", description: "Trigger automated alerts for expiring passes and renewal offers." }

# &#x20;   ],

# &#x20;   features: \["QR Access Control", "Member CRM", "Subscription POS", "Expiring Alerts", "Class Booking"],

# &#x20;   techStack: \["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma ORM", "Recharts"]

# &#x20; },

# &#x20; {

# &#x20;   slug: "estatepulse",

# &#x20;   name: "EstatePulse",

# &#x20;   category: "Real Estate Technology",

# &#x20;   tagline: "Real Estate Marketplace \& Sales CRM Pipeline",

# &#x20;   liveUrl: "\[https://appreal-estate.netlify.app](https://appreal-estate.netlify.app)",

# &#x20;   description: "End-to-end real estate solution connecting public buyer map discovery with an agent sales pipeline CRM and private tour booking.",

# &#x20;   heroImage: "/screenshots/estatepulse-desktop.png",

# &#x20;   screenshots: {

# &#x20;     desktop: \["/screenshots/estatepulse-desktop.png"],

# &#x20;     mobile: \["/screenshots/estatepulse-mobile.png"]

# &#x20;   },

# &#x20;   workflows: \[

# &#x20;     { step: 1, title: "Map Discovery", description: "Buyers filter active property listings via interactive map interface." },

# &#x20;     { step: 2, title: "Lead Ingestion", description: "Inquiry submissions automatically populate agent CRM pipelines." },

# &#x20;     { step: 3, title: "Kanban Pipeline", description: "Agents drag leads through inspection, offer, and closing stages." },

# &#x20;     { step: 4, title: "Tour Scheduling", description: "Automated booking calendar synchronized with agent availability." }

# &#x20;   ],

# &#x20;   features: \["Interactive Map Search", "Kanban CRM Pipeline", "Tour Scheduler", "Listing Builder", "Client Portal"],

# &#x20;   techStack: \["Next.js 14", "TypeScript", "Tailwind CSS", "Mapbox GL", "Prisma ORM"]

# &#x20; },

# &#x20; {

# &#x20;   slug: "salonflow",

# &#x20;   name: "SalonFlow",

# &#x20;   category: "Beauty \& Wellness Operations",

# &#x20;   tagline: "Salon Booking, POS \& Staff Scheduling System",

# &#x20;   liveUrl: "\[https://salonbeautyapp.netlify.app](https://salonbeautyapp.netlify.app)",

# &#x20;   description: "Real-time salon appointment platform linked with specialist scheduling, POS terminal checkout, and client lifetime value tracking.",

# &#x20;   heroImage: "/screenshots/salonflow-desktop.png",

# &#x20;   screenshots: {

# &#x20;     desktop: \["/screenshots/salonflow-desktop.png"],

# &#x20;     mobile: \["/screenshots/salonflow-mobile.png"]

# &#x20;   },

# &#x20;   workflows: \[

# &#x20;     { step: 1, title: "Service Selection", description: "Clients pick treatment packages, staff specialists, and live open slots." },

# &#x20;     { step: 2, title: "Double-Booking Guard", description: "Calendar lock system prevents overlapping staff appointments." },

# &#x20;     { step: 3, title: "POS Checkout", description: "Staff process payments, apply service add-ons, and send digital receipts." },

# &#x20;     { step: 4, title: "Client Retention", description: "Track visit cadence and dispatch automated re-booking reminders." }

# &#x20;   ],

# &#x20;   features: \["Live Slot Calculation", "Staff Calendar", "POS Checkout", "Double-Booking Guard", "Client CRM"],

# &#x20;   techStack: \["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Zod"]

# &#x20; },

# &#x20; {

# &#x20;   slug: "restaurant-ecosystem",

# &#x20;   name: "Restaurant Software Ecosystem",

# &#x20;   category: "Restaurant Operations \& CX",

# &#x20;   tagline: "Connected Digital Menu, Kitchen Display \& Order Ops",

# &#x20;   liveUrl: "\[https://rastaurant-app.netlify.app](https://rastaurant-app.netlify.app)",

# &#x20;   secondLiveUrl: "\[https://appmanagerestaurant.netlify.app](https://appmanagerestaurant.netlify.app)",

# &#x20;   isEcosystem: true,

# &#x20;   description: "Synchronized dual-app restaurant platform: Customer QR ordering menu (il Piatto) connected directly to a Kitchen KDS \& Delivery Terminal (Dajjaj Hamoud).",

# &#x20;   heroImage: "/screenshots/restaurant-menu-desktop.png",

# &#x20;   screenshots: {

# &#x20;     desktop: \["/screenshots/restaurant-menu-desktop.png", "/screenshots/restaurant-kds-desktop.png"],

# &#x20;     mobile: \["/screenshots/restaurant-menu-mobile.png", "/screenshots/restaurant-kds-mobile.png"]

# &#x20;   },

# &#x20;   workflows: \[

# &#x20;     { step: 1, title: "Table QR Scan", description: "Guests scan table QR codes to view menus and select dishes." },

# &#x20;     { step: 2, title: "Direct Dispatch", description: "Orders transmit directly to kitchen screens or WhatsApp." },

# &#x20;     { step: 3, title: "Kitchen KDS Tracking", description: "Chefs manage preparation stage timers across line stations." },

# &#x20;     { step: 4, title: "Delivery \& Register Ops", description: "Assign drivers, complete cash transactions, and audit sales." }

# &#x20;   ],

# &#x20;   features: \["QR Digital Menu", "WhatsApp Direct Order", "Kitchen KDS Screen", "Driver Dispatch", "Daily Cash POS"],

# &#x20;   techStack: \["Next.js 14", "TypeScript", "Tailwind CSS", "Lucide Icons", "WebSockets"]

# &#x20; }

# ];

# 

# ```

# 

# \---

# 

# \## 5. FULL REACT COMPONENTS

# 

# \### File: `components/Navbar.tsx`

# 

# ```tsx

# "use client";

# import React from 'react';

# import Link from 'next/link';

# import { Terminal, ArrowUpRight } from 'lucide-react';

# 

# interface NavbarProps {

# &#x20; onOpenConsult: () => void;

# }

# 

# export const Navbar: React.FC<NavbarProps> = ({ onOpenConsult }) => {

# &#x20; return (

# &#x20;   <header className="sticky top-0 z-40 w-full border-b border-surfaceHover bg-obsidian/80 backdrop-blur-md">

# &#x20;     <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

# &#x20;       <Link className="flex items-center gap-3 group" href="/">

# &#x20;         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accentCyan to-accentTeal text-obsidian shadow-lg shadow-accentCyan/20 group-hover:scale-105 transition-transform">

# &#x20;           <Terminal className="h-5 w-5 stroke-\[2.5]"/>

# &#x20;         </div>

# &#x20;         <span className="text-xl font-bold tracking-tight text-brightText">VELOCE<span className="text-accentCyan">STUDIO</span></span>

# &#x20;       </Link>

# &#x20;       

# &#x20;       <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-mutedText">

# &#x20;         <a href="#capabilities" className="hover:text-accentCyan transition-colors">Capabilities</a>

# &#x20;         <a href="#showcase" className="hover:text-accentCyan transition-colors">Work Portfolio</a>

# &#x20;         <a href="#process" className="hover:text-accentCyan transition-colors">How We Build</a>

# &#x20;       </nav>

# 

# &#x20;       <button

# &#x20;         onClick={onOpenConsult}

# &#x20;         className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accentCyan to-accentTeal px-5 py-2.5 text-sm font-semibold text-obsidian shadow-md shadow-accentCyan/20 hover:opacity-95 transition-opacity"

# &#x20;       >

# &#x20;         <span>Book Consult</span>

# &#x20;         <ArrowUpRight className="h-4 w-4"/>

# &#x20;       </button>

# &#x20;     </div>

# &#x20;   </header>

# &#x20; );

# };

# 

# ```

# 

# \### File: `components/Hero.tsx`

# 

# ```tsx

# "use client";

# import React from 'react';

# import { Sparkles, ArrowRight } from 'lucide-react';

# 

# interface HeroProps {

# &#x20; onOpenConsult: () => void;

# }

# 

# export const Hero: React.FC<HeroProps> = ({ onOpenConsult }) => {

# &#x20; return (

# &#x20;   <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">

# &#x20;     <div className="mx-auto max-w-7xl px-6 lg:px-8">

# &#x20;       <div className="mx-auto max-w-3xl text-center">

# &#x20;         <div className="inline-flex items-center gap-2 rounded-full border border-accentCyan/30 bg-accentCyan/10 px-4 py-1.5 text-xs font-semibold text-accentCyan mb-8">

# &#x20;           <Sparkles className="h-3.5 w-3.5"/>

# &#x20;           <span>5 Live Deployed B2B Systems</span>

# &#x20;         </div>

# &#x20;         

# &#x20;         <h1 className="text-4xl font-extrabold tracking-tight text-brightText sm:text-6xl leading-\[1.15]">

# &#x20;           Custom software built around how your business <span className="bg-gradient-to-r from-accentCyan to-accentTeal bg-clip-text text-transparent">actually works</span>.

# &#x20;         </h1>

# &#x20;         

# &#x20;         <p className="mt-6 text-lg leading-8 text-mutedText">

# &#x20;           We engineer bespoke web applications, customer portals, QR ordering systems, and operational management platforms designed to eliminate manual bottlenecks.

# &#x20;         </p>

# 

# &#x20;         <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

# &#x20;           <a

# &#x20;             href="#showcase"

# &#x20;             className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-surface hover:bg-surfaceHover border border-surfaceHover px-7 py-3.5 text-sm font-semibold text-brightText transition-all"

# &#x20;           >

# &#x20;             <span>Explore Deployed Apps</span>

# &#x20;             <ArrowRight className="h-4 w-4 text-accentCyan"/>

# &#x20;           </a>

# &#x20;           <button

# &#x20;             onClick={onOpenConsult}

# &#x20;             className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accentCyan to-accentTeal px-7 py-3.5 text-sm font-semibold text-obsidian shadow-lg shadow-accentCyan/20 hover:opacity-95 transition-all"

# &#x20;           >

# &#x20;             <span>Schedule Architecture Audit</span>

# &#x20;           </button>

# &#x20;         </div>

# &#x20;       </div>

# 

# &#x20;       <div className="mt-16 relative rounded-2xl border border-surfaceHover bg-surface/50 p-3 backdrop-blur-xl shadow-2xl">

# &#x20;         <div className="flex items-center gap-2 px-3 py-2 border-b border-surfaceHover/50 mb-3">

# &#x20;           <div className="h-3 w-3 rounded-full bg-red-500/80" />

# &#x20;           <div className="h-3 w-3 rounded-full bg-yellow-500/80" />

# &#x20;           <div className="h-3 w-3 rounded-full bg-green-500/80" />

# &#x20;           <div className="ml-4 rounded-md bg-obsidian px-4 py-1 text-xs text-mutedText font-mono">\[https://veloce.studio/live-ecosystem](https://veloce.studio/live-ecosystem)</div>

# &#x20;         </div>

# &#x20;         <div className="relative aspect-\[16/9] overflow-hidden rounded-xl bg-obsidian border border-surfaceHover">

# &#x20;           <img 

# &#x20;             src="/screenshots/fitpulse-desktop.png" 

# &#x20;             alt="Live Production Ecosystem Preview"

# &#x20;             className="object-cover w-full h-full opacity-90"

# &#x20;             onError={(e) => { e.currentTarget.style.display = 'none'; }}

# &#x20;           />

# &#x20;           <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />

# &#x20;           <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-mutedText border-t border-surfaceHover/60 pt-4">

# &#x20;             <span className="flex items-center gap-2 text-statusEmerald font-medium"><span className="h-2 w-2 rounded-full bg-statusEmerald animate-pulse" /> Live Production Environments</span>

# &#x20;             <span>Next.js 14 • TypeScript • Tailwind CSS</span>

# &#x20;           </div>

# &#x20;         </div>

# &#x20;       </div>

# &#x20;     </div>

# &#x20;   </section>

# &#x20; );

# };

# 

# ```

# 

# \### File: `components/CapabilityMatrix.tsx`

# 

# ```tsx

# "use client";

# import React from 'react';

# import { Calendar, Users, QrCode, CreditCard, LayoutDashboard, Zap } from 'lucide-react';

# 

# const CAPABILITIES = \[

# &#x20; { icon: Calendar, title: "24/7 Booking \& Scheduling", desc: "Real-time calendar locking, specialist allocation, and slot guard algorithms." },

# &#x20; { icon: Users, title: "Customer \& Member CRMs", desc: "Unified profile portals, client visit tracking, and retention automation." },

# &#x20; { icon: QrCode, title: "QR Pass Access \& Menus", desc: "Mobile digital check-in terminals and contactless menu ordering workflows." },

# &#x20; { icon: CreditCard, title: "POS \& Billing Engines", desc: "Integrated card collection, recurring membership subscriptions, and invoicing." },

# &#x20; { icon: LayoutDashboard, title: "Operational KDS \& Dashboards", desc: "Real-time kitchen display screens, line dispatch timers, and sales analytics." },

# &#x20; { icon: Zap, title: "Notification Automations", desc: "Automated WhatsApp notifications, pass expiry alerts, and pipeline webhooks." }

# ];

# 

# export const CapabilityMatrix: React.FC = () => {

# &#x20; return (

# &#x20;   <section id="capabilities" className="py-20 bg-obsidian border-y border-surfaceHover">

# &#x20;     <div className="mx-auto max-w-7xl px-6 lg:px-8">

# &#x20;       <div className="text-center max-w-2xl mx-auto mb-16">

# &#x20;         <h2 className="text-xs font-semibold tracking-widest text-accentCyan uppercase">Capabilities Matrix</h2>

# &#x20;         <p className="mt-3 text-3xl font-bold tracking-tight text-brightText sm:text-4xl">Core Business Automation Pillars</p>

# &#x20;       </div>

# 

# &#x20;       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

# &#x20;         {CAPABILITIES.map((cap, i) => (

# &#x20;           <div key={i} className="rounded-2xl border border-surfaceHover bg-surface/40 p-8 hover:border-accentCyan/50 transition-colors group">

# &#x20;             <div className="h-12 w-12 rounded-xl bg-accentCyan/10 text-accentCyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">

# &#x20;               <cap.icon className="h-6 w-6" />

# &#x20;             </div>

# &#x20;             <h3 className="text-xl font-bold text-brightText mb-3">{cap.title}</h3>

# &#x20;             <p className="text-sm text-mutedText leading-relaxed">{cap.desc}</p>

# &#x20;           </div>

# &#x20;         ))}

# &#x20;       </div>

# &#x20;     </div>

# &#x20;   </section>

# &#x20; );

# };

# 

# ```

# 

# \### File: `components/WorkflowStepper.tsx`

# 

# ```tsx

# "use client";

# import React, { useState } from 'react';

# import { ProjectWorkflow } from '@/data/projects';

# import { CheckCircle2 } from 'lucide-react';

# 

# interface WorkflowStepperProps {

# &#x20; workflows: ProjectWorkflow\[];

# }

# 

# export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ workflows }) => {

# &#x20; const \[activeStep, setActiveStep] = useState(0);

# 

# &#x20; return (

# &#x20;   <div className="rounded-2xl border border-surfaceHover bg-surface/30 p-6 md:p-8">

# &#x20;     <div className="flex flex-wrap gap-2 mb-8 border-b border-surfaceHover pb-4">

# &#x20;       {workflows.map((w, idx) => (

# &#x20;         <button

# &#x20;           key={w.step}

# &#x20;           onClick={() => setActiveStep(idx)}

# &#x20;           className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${

# &#x20;             activeStep === idx 

# &#x20;               ? 'bg-accentCyan text-obsidian shadow-md shadow-accentCyan/20' 

# &#x20;               : 'bg-obsidian border border-surfaceHover text-mutedText hover:text-brightText'

# &#x20;           }`}

# &#x20;         >

# &#x20;           <span>Step {w.step}</span>

# &#x20;           {activeStep === idx \&\& <CheckCircle2 className="h-3.5 w-3.5"/>}

# &#x20;         </button>

# &#x20;       ))}

# &#x20;     </div>

# 

# &#x20;     <div className="min-h-\[100px]">

# &#x20;       <h4 className="text-lg font-bold text-brightText mb-2">

# &#x20;         {workflows\[activeStep].step}. {workflows\[activeStep].title}

# &#x20;       </h4>

# &#x20;       <p className="text-sm text-mutedText leading-relaxed">

# &#x20;         {workflows\[activeStep].description}

# &#x20;       </p>

# &#x20;     </div>

# &#x20;   </div>

# &#x20; );

# };

# 

# ```

# 

# \### File: `components/ProjectCard.tsx`

# 

# ```tsx

# "use client";

# import React from 'react';

# import Link from 'next/link';

# import { Project } from '@/data/projects';

# import { ExternalLink, ArrowRight, Layers } from 'lucide-react';

# 

# interface ProjectCardProps {

# &#x20; project: Project;

# }

# 

# export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

# &#x20; return (

# &#x20;   <div className="flex flex-col rounded-2xl border border-surfaceHover bg-surface/50 overflow-hidden hover:border-accentCyan/40 transition-all">

# &#x20;     <div className="relative aspect-\[16/10] bg-obsidian border-b border-surfaceHover overflow-hidden">

# &#x20;       <img 

# &#x20;         src={project.heroImage} 

# &#x20;         alt={project.name}

# &#x20;         className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"

# &#x20;         onError={(e) => { e.currentTarget.src = '\[https://placehold.co/800x500/161E2E/F8FAFC?text=](https://placehold.co/800x500/161E2E/F8FAFC?text=)' + encodeURIComponent(project.name); }}

# &#x20;       />

# &#x20;       <div className="absolute top-4 left-4 rounded-full bg-obsidian/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-accentCyan border border-accentCyan/20">

# &#x20;         {project.category}

# &#x20;       </div>

# &#x20;     </div>

# 

# &#x20;     <div className="flex flex-1 flex-col p-6 lg:p-8">

# &#x20;       <div className="flex items-center justify-between mb-2">

# &#x20;         <h3 className="text-2xl font-bold text-brightText">{project.name}</h3>

# &#x20;         {project.isEcosystem \&\& (

# &#x20;           <span className="flex items-center gap-1 rounded-md bg-accentTeal/10 px-2 py-1 text-\[10px] font-bold uppercase tracking-wider text-accentTeal border border-accentTeal/30">

# &#x20;             <Layers className="h-3 w-3"/> Dual Ecosystem

# &#x20;           </span>

# &#x20;         )}

# &#x20;       </div>

# &#x20;       

# &#x20;       <p className="text-xs font-semibold text-accentCyan mb-4">{project.tagline}</p>

# &#x20;       <p className="text-sm text-mutedText leading-relaxed mb-6 flex-1">{project.description}</p>

# 

# &#x20;       <div className="mb-6 rounded-xl bg-obsidian/60 p-3 border border-surfaceHover">

# &#x20;         <span className="text-\[10px] font-bold uppercase tracking-widest text-mutedText block mb-2">Workflow Progression</span>

# &#x20;         <div className="flex items-center gap-1.5 text-xs text-brightText overflow-x-auto pb-1">

# &#x20;           {project.workflows.map((w, i) => (

# &#x20;             <React.Fragment key="{i}">

# &#x20;               <span className="whitespace-nowrap rounded bg-surface px-2 py-0.5">{w.title}</span>

# &#x20;               {i < project.workflows.length - 1 \&\& <span className="text-accentCyan">➔</span>}

# &#x20;             </React.Fragment>

# &#x20;           ))}

# &#x20;         </div>

# &#x20;       </div>

# 

# &#x20;       <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-surfaceHover">

# &#x20;         <a

# &#x20;           href={project.liveUrl}

# &#x20;           target="\_blank"

# &#x20;           rel="noopener noreferrer"

# &#x20;           className="flex items-center gap-1.5 rounded-xl bg-accentCyan/10 border border-accentCyan/30 px-4 py-2 text-xs font-semibold text-accentCyan hover:bg-accentCyan hover:text-obsidian transition-colors"

# &#x20;         >

# &#x20;           <span>Live App</span>

# &#x20;           <ExternalLink className="h-3.5 w-3.5"/>

# &#x20;         </a>

# 

# &#x20;         {project.secondLiveUrl \&\& (

# &#x20;           <a

# &#x20;             href={project.secondLiveUrl}

# &#x20;             target="\_blank"

# &#x20;             rel="noopener noreferrer"

# &#x20;             className="flex items-center gap-1.5 rounded-xl bg-accentTeal/10 border border-accentTeal/30 px-4 py-2 text-xs font-semibold text-accentTeal hover:bg-accentTeal hover:text-obsidian transition-colors"

# &#x20;           >

# &#x20;             <span>Kitchen KDS</span>

# &#x20;             <ExternalLink className="h-3.5 w-3.5"/>

# &#x20;           </a>

# &#x20;         )}

# 

# &#x20;         <Link className="ml-auto flex items-center gap-1 text-xs font-semibold text-brightText hover:text-accentCyan transition-colors" href="{`/projects/${project.slug}`}">

# &#x20;           <span>Case Study</span>

# &#x20;           <ArrowRight className="h-3.5 w-3.5"/>

# &#x20;         </Link>

# &#x20;       </div>

# &#x20;     </div>

# &#x20;   </div>

# &#x20; );

# };

# 

# ```

# 

# \### File: `components/ContactModal.tsx`

# 

# ```tsx

# "use client";

# import React, { useState } from 'react';

# import { X, Send, CheckCircle } from 'lucide-react';

# 

# interface ContactModalProps {

# &#x20; isOpen: boolean;

# &#x20; onClose: () => void;

# }

# 

# export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {

# &#x20; const \[submitted, setSubmitted] = useState(false);

# 

# &#x20; if (!isOpen) return null;

# 

# &#x20; const handleSubmit = (e: React.FormEvent) => {

# &#x20;   e.preventDefault();

# &#x20;   setSubmitted(true);

# &#x20;   setTimeout(() => {

# &#x20;     setSubmitted(false);

# &#x20;     onClose();

# &#x20;   }, 2000);

# &#x20; };

# 

# &#x20; return (

# &#x20;   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md">

# &#x20;     <div className="relative w-full max-w-lg rounded-2xl border border-surfaceHover bg-surface p-6 sm:p-8 shadow-2xl">

# &#x20;       <button onClick={onClose} className="absolute top-4 right-4 text-mutedText hover:text-brightText">

# &#x20;         <X className="h-5 w-5"/>

# &#x20;       </button>

# 

# &#x20;       {submitted ? (

# &#x20;         <div className="py-12 text-center">

# &#x20;           <CheckCircle className="mx-auto h-12 w-12 text-statusEmerald mb-4"/>

# &#x20;           <h3 className="text-2xl font-bold text-brightText">Audit Request Received</h3>

# &#x20;           <p className="mt-2 text-sm text-mutedText">We will evaluate your requirements and contact you within 24 hours.</p>

# &#x20;         </div>

# &#x20;       ) : (

# &#x20;         <>

# &#x20;           <h3 className="text-2xl font-bold text-brightText">Schedule Architecture Audit</h3>

# &#x20;           <p className="mt-1 text-xs text-mutedText">Describe your business model and manual operational bottlenecks.</p>

# 

# &#x20;           <form onSubmit={handleSubmit} className="mt-6 space-y-4">

# &#x20;             <div>

# &#x20;               <label className="block text-xs font-semibold text-brightText mb-1">Full Name</label>

# &#x20;               <input required type="text" placeholder="Alex Morgan" className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none" />

# &#x20;             </div>

# 

# &#x20;             <div>

# &#x20;               <label className="block text-xs font-semibold text-brightText mb-1">Business Email</label>

# &#x20;               <input required type="email" placeholder="alex@company.com" className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none" />

# &#x20;             </div>

# 

# &#x20;             <div>

# &#x20;               <label className="block text-xs font-semibold text-brightText mb-1">Industry Vertical</label>

# &#x20;               <select className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none">

# &#x20;                 <option>Fitness \& Gym Operations</option>

# &#x20;                 <option>Real Estate \& Marketplace</option>

# &#x20;                 <option>Salon \& Spa Booking</option>

# &#x20;                 <option>Restaurant \& QR Ordering Ecosystem</option>

# &#x20;                 <option>Custom Enterprise Automation</option>

# &#x20;               </select>

# &#x20;             </div>

# 

# &#x20;             <div>

# &#x20;               <label className="block text-xs font-semibold text-brightText mb-1">Bottlenecks \& Goals</label>

# &#x20;               <textarea rows={3} placeholder="Describe processes you want automated..." className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none" />

# &#x20;             </div>

# 

# &#x20;             <button

# &#x20;               type="submit"

# &#x20;               className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accentCyan to-accentTeal py-3 text-sm font-semibold text-obsidian shadow-lg shadow-accentCyan/20 hover:opacity-95 transition-opacity"

# &#x20;             >

# &#x20;               <span>Submit Audit Request</span>

# &#x20;               <Send className="h-4 w-4"/>

# &#x20;             </button>

# &#x20;           </form>

# &#x20;         </>

# &#x20;       )}

# &#x20;     </div>

# &#x20;   </div>

# &#x20; );

# };

# 

# ```

# 

# \---

# 

# \## 6. APPLICATION PAGES \& ROUTING

# 

# \### File: `app/layout.tsx`

# 

# ```tsx

# import type { Metadata } from 'next';

# import './globals.css';

# 

# export const metadata: Metadata = {

# &#x20; title: 'Veloce Studio | Custom B2B Software Engineering',

# &#x20; description: 'Production-ready web platforms, internal CRMs, booking engines, and customer management systems.',

# };

# 

# export default function RootLayout({

# &#x20; children,

# }: {

# &#x20; children: React.ReactNode;

# }) {

# &#x20; return (

# &#x20;   <html lang="en" className="dark scroll-smooth">

# &#x20;     <body className="bg-obsidian text-brightText antialiased selection:bg-accentCyan selection:text-obsidian">

# &#x20;       {children}

# &#x20;     </body>

# &#x20;   </html>

# &#x20; );

# }

# 

# ```

# 

# \### File: `app/page.tsx`

# 

# ```tsx

# "use client";

# import React, { useState } from 'react';

# import { Navbar } from '@/components/Navbar';

# import { Hero } from '@/components/Hero';

# import { CapabilityMatrix } from '@/components/CapabilityMatrix';

# import { ProjectCard } from '@/components/ProjectCard';

# import { ContactModal } from '@/components/ContactModal';

# import { PROJECTS\_DATA } from '@/data/projects';

# 

# export default function Home() {

# &#x20; const \[isConsultOpen, setIsConsultOpen] = useState(false);

# &#x20; const \[activeCategory, setActiveCategory] = useState('ALL');

# 

# &#x20; const categories = \['ALL', 'Fitness \& Wellness SaaS', 'Real Estate Technology', 'Beauty \& Wellness Operations', 'Restaurant Operations \& CX'];

# 

# &#x20; const filteredProjects = activeCategory === 'ALL'

# &#x20;   ? PROJECTS\_DATA

# &#x20;   : PROJECTS\_DATA.filter(p => p.category === activeCategory);

# 

# &#x20; return (

# &#x20;   <main className="min-h-screen bg-obsidian">

# &#x20;     <Navbar onOpenConsult="{()"> setIsConsultOpen(true)} />

# &#x20;     <Hero onOpenConsult="{()"> setIsConsultOpen(true)} />

# &#x20;     <CapabilityMatrix/>

# 

# &#x20;     <section id="showcase" className="py-24">

# &#x20;       <div className="mx-auto max-w-7xl px-6 lg:px-8">

# &#x20;         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">

# &#x20;           <div>

# &#x20;             <h2 className="text-xs font-semibold tracking-widest text-accentCyan uppercase">Production Solutions</h2>

# &#x20;             <p className="mt-2 text-3xl font-bold tracking-tight text-brightText sm:text-4xl">Deployed B2B Platforms</p>

# &#x20;           </div>

# 

# &#x20;           <div className="mt-6 md:mt-0 flex flex-wrap gap-2">

# &#x20;             {categories.map((cat) => (

# &#x20;               <button

# &#x20;                 key={cat}

# &#x20;                 onClick={() => setActiveCategory(cat)}

# &#x20;                 className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${

# &#x20;                   activeCategory === cat

# &#x20;                     ? 'bg-accentCyan text-obsidian shadow-md shadow-accentCyan/20'

# &#x20;                     : 'bg-surface border border-surfaceHover text-mutedText hover:text-brightText'

# &#x20;                 }`}

# &#x20;               >

# &#x20;                 {cat === 'ALL' ? 'All Systems' : cat}

# &#x20;               </button>

# &#x20;             ))}

# &#x20;           </div>

# &#x20;         </div>

# 

# &#x20;         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

# &#x20;           {filteredProjects.map((project) => (

# &#x20;             <ProjectCard key="{project.slug}" project="{project}"/>

# &#x20;           ))}

# &#x20;         </div>

# &#x20;       </div>

# &#x20;     </section>

# 

# &#x20;     <section id="process" className="py-20 border-t border-surfaceHover bg-surface/30">

# &#x20;       <div className="mx-auto max-w-7xl px-6 lg:px-8">

# &#x20;         <div className="text-center max-w-2xl mx-auto mb-16">

# &#x20;           <h2 className="text-xs font-semibold tracking-widest text-accentCyan uppercase">Execution Strategy</h2>

# &#x20;           <p className="mt-2 text-3xl font-bold tracking-tight text-brightText sm:text-4xl">How We Build Your Software</p>

# &#x20;         </div>

# 

# &#x20;         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

# &#x20;           {\[

# &#x20;             { step: "01", title: "Workflow Audit", desc: "We map your operational steps and identify manual friction points." },

# &#x20;             { step: "02", title: "UX Blueprint", desc: "Designing low-friction interfaces for internal team members and buyers." },

# &#x20;             { step: "03", title: "Full-Stack Dev", desc: "Engineered with Next.js 14, TypeScript, and database integrations." },

# &#x20;             { step: "04", title: "Launch \& Support", desc: "Connect WhatsApp messaging, POS terminal gateways, and live cloud hosting." }

# &#x20;           ].map((p, i) => (

# &#x20;             <div key={i} className="rounded-2xl border border-surfaceHover bg-obsidian p-6">

# &#x20;               <span className="text-3xl font-black text-accentCyan/40 block mb-4">{p.step}</span>

# &#x20;               <h3 className="text-lg font-bold text-brightText mb-2">{p.title}</h3>

# &#x20;               <p className="text-xs text-mutedText leading-relaxed">{p.desc}</p>

# &#x20;             </div>

# &#x20;           ))}

# &#x20;         </div>

# &#x20;       </div>

# &#x20;     </section>

# 

# &#x20;     <footer className="border-t border-surfaceHover bg-obsidian py-12">

# &#x20;       <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

# &#x20;         <p className="text-xs text-mutedText">© 2026 VELOCE STUDIO. Custom B2B Software Engineering.</p>

# &#x20;         <div className="flex items-center gap-6 text-xs text-mutedText">

# &#x20;           <a href="#capabilities" className="hover:text-brightText">Capabilities</a>

# &#x20;           <a href="#showcase" className="hover:text-brightText">Work Portfolio</a>

# &#x20;           <button onClick={() => setIsConsultOpen(true)} className="hover:text-accentCyan">Book Consult</button>

# &#x20;         </div>

# &#x20;       </div>

# &#x20;     </footer>

# 

# &#x20;     <ContactModal isOpen="{isConsultOpen}" onClose="{()"> setIsConsultOpen(false)} />

# &#x20;   </main>

# &#x20; );

# }

# 

# ```

# 

# \### File: `app/projects/\[slug]/page.tsx`

# 

# ```tsx

# import React from 'react';

# import { PROJECTS\_DATA } from '@/data/projects';

# import { WorkflowStepper } from '@/components/WorkflowStepper';

# import { ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';

# import Link from 'next/link';

# import { notFound } from 'next/navigation';

# 

# export async function generateStaticParams() {

# &#x20; return PROJECTS\_DATA.map((p) => ({

# &#x20;   slug: p.slug,

# &#x20; }));

# }

# 

# export default function ProjectPage({ params }: { params: { slug: string } }) {

# &#x20; const project = PROJECTS\_DATA.find((p) => p.slug === params.slug);

# 

# &#x20; if (!project) {

# &#x20;   notFound();

# &#x20; }

# 

# &#x20; return (

# &#x20;   <main className="min-h-screen bg-obsidian pb-24">

# &#x20;     <header className="border-b border-surfaceHover bg-surface/40 py-8">

# &#x20;       <div className="mx-auto max-w-7xl px-6 lg:px-8">

# &#x20;         <Link className="inline-flex items-center gap-2 text-xs font-semibold text-accentCyan mb-6 hover:underline" href="/">

# &#x20;           <ArrowLeft className="h-4 w-4"/> Back to Overview

# &#x20;         </Link>

# &#x20;         

# &#x20;         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

# &#x20;           <div>

# &#x20;             <span className="text-xs font-bold text-accentCyan uppercase tracking-widest">{project.category}</span>

# &#x20;             <h1 className="mt-1 text-4xl font-extrabold text-brightText sm:text-5xl">{project.name}</h1>

# &#x20;             <p className="mt-2 text-lg text-mutedText">{project.tagline}</p>

# &#x20;           </div>

# 

# &#x20;           <div className="flex flex-wrap gap-3">

# &#x20;             <a

# &#x20;               href={project.liveUrl}

# &#x20;               target="\_blank"

# &#x20;               rel="noopener noreferrer"

# &#x20;               className="flex items-center gap-2 rounded-xl bg-accentCyan px-6 py-3 text-xs font-bold text-obsidian shadow-lg shadow-accentCyan/20 hover:opacity-95"

# &#x20;             >

# &#x20;               <span>Launch Live Application</span>

# &#x20;               <ExternalLink className="h-4 w-4"/>

# &#x20;             </a>

# &#x20;           </div>

# &#x20;         </div>

# &#x20;       </div>

# &#x20;     </header>

# 

# &#x20;     <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 space-y-16">

# &#x20;       <div className="rounded-2xl border border-surfaceHover bg-surface overflow-hidden shadow-2xl">

# &#x20;         <img 

# &#x20;           src={project.heroImage} 

# &#x20;           alt={project.name} 

# &#x20;           className="w-full object-cover"

# &#x20;           onError={(e) => { e.currentTarget.src = '\[https://placehold.co/1200x600/161E2E/F8FAFC?text=](https://placehold.co/1200x600/161E2E/F8FAFC?text=)' + encodeURIComponent(project.name); }}

# &#x20;         />

# &#x20;       </div>

# 

# &#x20;       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

# &#x20;         <div className="rounded-2xl border border-surfaceHover bg-surface/30 p-8">

# &#x20;           <h3 className="text-lg font-bold text-brightText mb-3">The Operational Bottleneck</h3>

# &#x20;           <p className="text-sm text-mutedText leading-relaxed">

# &#x20;             Traditional businesses lose efficiency due to disconnected software systems, manual verification tasks, physical paper scheduling, and delayed payment logging.

# &#x20;           </p>

# &#x20;         </div>

# 

# &#x20;         <div className="rounded-2xl border border-accentCyan/30 bg-accentCyan/5 p-8">

# &#x20;           <h3 className="text-lg font-bold text-accentCyan mb-3">The Software Solution</h3>

# &#x20;           <p className="text-sm text-mutedText leading-relaxed">

# &#x20;             {project.description}

# &#x20;           </p>

# &#x20;         </div>

# &#x20;       </div>

# 

# &#x20;       <div>

# &#x20;         <h3 className="text-2xl font-bold text-brightText mb-6">End-to-End System Workflow</h3>

# &#x20;         <WorkflowStepper workflows="{project.workflows}"/>

# &#x20;       </div>

# 

# &#x20;       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

# &#x20;         <div className="rounded-2xl border border-surfaceHover bg-surface/40 p-8">

# &#x20;           <h3 className="text-xl font-bold text-brightText mb-6">Engineered Features</h3>

# &#x20;           <ul className="space-y-3">

# &#x20;             {project.features.map((feat, i) => (

# &#x20;               <li key={i} className="flex items-center gap-3 text-sm text-mutedText">

# &#x20;                 <CheckCircle2 className="h-4 w-4 text-statusEmerald"/>

# &#x20;                 <span>{feat}</span>

# &#x20;               </li>

# &#x20;             ))}

# &#x20;           </ul>

# &#x20;         </div>

# 

# &#x20;         <div className="rounded-2xl border border-surfaceHover bg-surface/40 p-8">

# &#x20;           <h3 className="text-xl font-bold text-brightText mb-6">Technologies Implemented</h3>

# &#x20;           <div className="flex flex-wrap gap-2">

# &#x20;             {project.techStack.map((tech, i) => (

# &#x20;               <span key={i} className="rounded-xl border border-surfaceHover bg-obsidian px-4 py-2 text-xs font-semibold text-accentCyan">

# &#x20;                 {tech}

# &#x20;               </span>

# &#x20;             ))}

# &#x20;           </div>

# &#x20;         </div>

# &#x20;       </div>

# &#x20;     </div>

# &#x20;   </main>

# &#x20; );

# }

# 

# ```

# 

# \---

# 

# \## 7. AUTOMATED TERMINAL EXECUTION COMMANDS

# 

# Execute these commands in sequence to set up dependencies, generate screenshot assets, and build the full application:

# 

# ```bash

# \# 1. Install standard npm packages

# npm install lucide-react framer-motion clsx tailwind-merge

# 

# \# 2. Install Playwright for Python and capture screenshots automatically

# pip install playwright

# playwright install chromium

# python scripts/capture\_screenshots.py

# 

# \# 3. Compile and build Next.js App Router project

# npm run build

# 

# ```

# 

# ```

# 

# ```


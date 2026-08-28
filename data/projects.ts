export interface ProjectWorkflow {
  step: number;
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  liveUrl: string;
  secondLiveUrl?: string;
  description: string;
  heroImage: string;
  screenshots: {
    desktop: string[];
    mobile: string[];
  };
  workflows: ProjectWorkflow[];
  features: string[];
  techStack: string[];
  isEcosystem?: boolean;
}

export const PROJECTS_DATA: Project[] = [
  {
    slug: "fitpulse-pro",
    name: "FitPulse PRO",
    category: "Fitness & Wellness SaaS",
    tagline: "Gym Management & Member Operations OS",
    liveUrl: "https://appfit-plus.netlify.app",
    description: "Complete gym management platform unifying front-desk QR access terminals with recurring billing engines, member portals, and trainer scheduling.",
    heroImage: "/screenshots/fitpulse-desktop.png",
    screenshots: {
      desktop: ["/screenshots/fitpulse-desktop.png"],
      mobile: ["/screenshots/fitpulse-mobile.png"]
    },
    workflows: [
      { step: 1, title: "Member Onboarding", description: "Collect client profile data, assign active plan, and match with trainer." },
      { step: 2, title: "QR Access Terminal", description: "Scan digital pass at reception terminal for automated entry validation." },
      { step: 3, title: "Automated POS & Billing", description: "Process recurring membership payments and log digital invoices." },
      { step: 4, title: "Retention Engine", description: "Trigger automated alerts for expiring passes and renewal offers." }
    ],
    features: ["QR Access Control", "Member CRM", "Subscription POS", "Expiring Alerts", "Class Booking"],
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma ORM", "Recharts"]
  },
  {
    slug: "estatepulse",
    name: "EstatePulse",
    category: "Real Estate Technology",
    tagline: "Real Estate Marketplace & Sales CRM Pipeline",
    liveUrl: "https://appreal-estate.netlify.app",
    description: "End-to-end real estate solution connecting public buyer map discovery with an agent sales pipeline CRM and private tour booking.",
    heroImage: "/screenshots/estatepulse-desktop.png",
    screenshots: {
      desktop: ["/screenshots/estatepulse-desktop.png"],
      mobile: ["/screenshots/estatepulse-mobile.png"]
    },
    workflows: [
      { step: 1, title: "Map Discovery", description: "Buyers filter active property listings via interactive map interface." },
      { step: 2, title: "Lead Ingestion", description: "Inquiry submissions automatically populate agent CRM pipelines." },
      { step: 3, title: "Kanban Pipeline", description: "Agents drag leads through inspection, offer, and closing stages." },
      { step: 4, title: "Tour Scheduling", description: "Automated booking calendar synchronized with agent availability." }
    ],
    features: ["Interactive Map Search", "Kanban CRM Pipeline", "Tour Scheduler", "Listing Builder", "Client Portal"],
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Mapbox GL", "Prisma ORM"]
  },
  {
    slug: "salonflow",
    name: "SalonFlow",
    category: "Beauty & Wellness Operations",
    tagline: "Salon Booking, POS & Staff Scheduling System",
    liveUrl: "https://salonbeautyapp.netlify.app",
    description: "Real-time salon appointment platform linked with specialist scheduling, POS terminal checkout, and client lifetime value tracking.",
    heroImage: "/screenshots/salonflow-desktop.png",
    screenshots: {
      desktop: ["/screenshots/salonflow-desktop.png"],
      mobile: ["/screenshots/salonflow-mobile.png"]
    },
    workflows: [
      { step: 1, title: "Service Selection", description: "Clients pick treatment packages, staff specialists, and live open slots." },
      { step: 2, title: "Double-Booking Guard", description: "Calendar lock system prevents overlapping staff appointments." },
      { step: 3, title: "POS Checkout", description: "Staff process payments, apply service add-ons, and send digital receipts." },
      { step: 4, title: "Client Retention", description: "Track visit cadence and dispatch automated re-booking reminders." }
    ],
    features: ["Live Slot Calculation", "Staff Calendar", "POS Checkout", "Double-Booking Guard", "Client CRM"],
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Zod"]
  },
  {
    slug: "restaurant-ecosystem",
    name: "Restaurant Software Ecosystem",
    category: "Restaurant Operations & CX",
    tagline: "Connected Digital Menu, Kitchen Display & Order Ops",
    liveUrl: "https://rastaurant-app.netlify.app",
    secondLiveUrl: "https://appmanagerestaurant.netlify.app",
    isEcosystem: true,
    description: "Synchronized dual-app restaurant platform: Customer QR ordering menu (il Piatto) connected directly to a Kitchen KDS & Delivery Terminal (Dajjaj Hamoud).",
    heroImage: "/screenshots/restaurant-menu-desktop.png",
    screenshots: {
      desktop: ["/screenshots/restaurant-menu-desktop.png", "/screenshots/restaurant-kds-desktop.png"],
      mobile: ["/screenshots/restaurant-menu-mobile.png", "/screenshots/restaurant-kds-mobile.png"]
    },
    workflows: [
      { step: 1, title: "Table QR Scan", description: "Guests scan table QR codes to view menus and select dishes." },
      { step: 2, title: "Direct Dispatch", description: "Orders transmit directly to kitchen screens or WhatsApp." },
      { step: 3, title: "Kitchen KDS Tracking", description: "Chefs manage preparation stage timers across line stations." },
      { step: 4, title: "Delivery & Register Ops", description: "Assign drivers, complete cash transactions, and audit sales." }
    ],
    features: ["QR Digital Menu", "WhatsApp Direct Order", "Kitchen KDS Screen", "Driver Dispatch", "Daily Cash POS"],
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Lucide Icons", "WebSockets"]
  }
];

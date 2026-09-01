import { ASSETS, type MarketingAsset } from './assetManifest';
import { CONTACT_MESSAGES } from '@/lib/contact';

export type ProjectAudience = 'manager' | 'client';

export interface Project {
  slug: string;
  legacySlugs: string[];
  name: string;
  category: string;
  label: string;
  accent: string;
  shortPromise: string;
  problem: string;
  audience: string[];
  managerModules: string[];
  clientModules: string[];
  workflows: string[];
  automations: string[];
  outcomes: string[];
  customization: string[];
  implementation: string[];
  managerAssets: MarketingAsset[];
  clientAssets: MarketingAsset[];
  demoUrl: string;
  secondaryDemoUrl?: string;
  ctaLabel: string;
  whatsappMessage: string;
}

export interface BusinessSolution {
  key: string;
  label: string;
  heading: string;
  painPoints: string[];
  modules: string[];
  workflow: string[];
  projectSlug?: string;
  ctaLabel: string;
  visual: MarketingAsset;
  whatsappMessage: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'fitpulse-pro',
    legacySlugs: ['fitpulse'],
    name: 'FitPulse PRO',
    category: 'Fitness & Wellness',
    label: '01 - FITNESS / WELLNESS',
    accent: '#0F7B5A',
    shortPromise: 'The operating system for gym memberships, attendance and daily operations.',
    problem: 'Memberships expire in different weeks. Payments arrive through cash, card and transfer. Attendance is tracked separately. Staff need a simple view of who is active today and who needs follow-up before the renewal is missed.',
    audience: ['gym owners', 'front desk teams', 'trainers', 'members'],
    managerModules: ['Members', 'Membership plans', 'Payments', 'Expiry tracking', 'QR check-in', 'Attendance', 'Trainers', 'Notifications', 'Revenue'],
    clientModules: ['Member profile', 'Membership status', 'QR pass', 'Class planning', 'Payment history', 'Notifications'],
    workflows: ['Member scans QR', 'System validates membership', 'Attendance is recorded', 'Dashboard updates', 'Owner reviews the day'],
    automations: ['Membership expiry reminder', 'Unpaid balance follow-up', 'QR access validation', 'Attendance log update'],
    outcomes: ['Staff spend less time checking spreadsheets and more time running the floor.', 'Owners see membership and attendance work from one operating view.'],
    customization: ['Branding', 'Membership rules', 'Roles and permissions', 'Languages', 'Notifications', 'Payment workflow'],
    implementation: ['Setup and configuration', 'Branding', 'Data import where applicable', 'Deployment', 'Team onboarding', 'Initial support'],
    managerAssets: [ASSETS.fitpulse.manager.dashboard, ASSETS.fitpulse.manager.members, ASSETS.fitpulse.manager.payments, ASSETS.fitpulse.manager.qrCheckin, ASSETS.fitpulse.manager.reminders],
    clientAssets: [ASSETS.fitpulse.client.checkin, ASSETS.fitpulse.client.schedule, ASSETS.fitpulse.client.paymentHistory],
    demoUrl: 'https://appfit-plus.netlify.app',
    ctaLabel: 'Explore FitPulse',
    whatsappMessage: CONTACT_MESSAGES.gym,
  },
  {
    slug: 'estatepulse',
    legacySlugs: [],
    name: 'EstatePulse',
    category: 'Real Estate',
    label: '02 - REAL ESTATE',
    accent: '#1B4DE4',
    shortPromise: 'A property and lead system for agencies that need stock, buyers, visits and follow-ups in one place.',
    problem: 'Properties sit in folders, leads arrive on personal phones, and follow-ups depend on memory. The agency needs a shared property database and a visible pipeline so every buyer request becomes traceable work.',
    audience: ['agency owners', 'agents', 'sales teams', 'buyers'],
    managerModules: ['Property inventory', 'Lead pipeline', 'Client files', 'Visit scheduling', 'Follow-ups', 'Reports'],
    clientModules: ['Property browsing', 'Property detail', 'Search', 'Visit request', 'Favorites'],
    workflows: ['Buyer explores properties', 'Interest becomes a lead', 'Agent qualifies request', 'Visit is scheduled', 'Follow-up is tracked'],
    automations: ['New lead notification', 'Visit follow-up reminder', 'Unassigned lead alert', 'Property status update'],
    outcomes: ['Agents stop losing context in WhatsApp threads.', 'Owners can see which properties and leads need attention.'],
    customization: ['Branding', 'Property types', 'Pipeline stages', 'Roles and permissions', 'Languages', 'Lead sources'],
    implementation: ['Property data setup', 'Pipeline configuration', 'Branding', 'Deployment', 'Team onboarding', 'Initial support'],
    managerAssets: [ASSETS.estatepulse.manager.dashboard, ASSETS.estatepulse.manager.properties, ASSETS.estatepulse.manager.pipeline, ASSETS.estatepulse.manager.leads],
    clientAssets: [ASSETS.estatepulse.client.propertyList, ASSETS.estatepulse.client.visitBooking],
    demoUrl: 'https://appreal-estate.netlify.app',
    ctaLabel: 'Explore EstatePulse',
    whatsappMessage: CONTACT_MESSAGES.realEstate,
  },
  {
    slug: 'salonflow',
    legacySlugs: [],
    name: 'SalonFlow',
    category: 'Beauty & Wellness',
    label: '03 - BEAUTY / WELLNESS',
    accent: '#A31C4B',
    shortPromise: 'Booking, calendar, client history and service operations for salons and spas.',
    problem: 'Bookings arrive through messages, appointments can overlap, and client history lives in the receptionist’s memory. A salon needs booking logic that understands services, staff availability and the customer record.',
    audience: ['salon owners', 'reception teams', 'stylists', 'clients'],
    managerModules: ['Calendar', 'Services', 'Customers', 'Team hours', 'Appointments', 'Finance view', 'Reminders'],
    clientModules: ['Service browsing', 'Booking', 'Appointment status', 'Client profile', 'Confirmation'],
    workflows: ['Client selects service', 'Available slot is shown', 'Booking is confirmed', 'Team calendar updates', 'Reminder is sent'],
    automations: ['Booking confirmation', 'Appointment reminder', 'Missed appointment flag', 'Client follow-up'],
    outcomes: ['Reception stops being the only place where the schedule is understood.', 'Clients can book without waiting for a message reply.'],
    customization: ['Branding', 'Services and durations', 'Staff skills', 'Working hours', 'Languages', 'Reminder rules'],
    implementation: ['Service setup', 'Calendar configuration', 'Branding', 'Deployment', 'Team onboarding', 'Initial support'],
    managerAssets: [ASSETS.salonflow.manager.dashboard, ASSETS.salonflow.manager.calendar, ASSETS.salonflow.manager.customers, ASSETS.salonflow.manager.services, ASSETS.salonflow.manager.team],
    clientAssets: [ASSETS.salonflow.client.services, ASSETS.salonflow.client.appointments],
    demoUrl: 'https://salonbeautyapp.netlify.app',
    ctaLabel: 'Explore SalonFlow',
    whatsappMessage: CONTACT_MESSAGES.salon,
  },
  {
    slug: 'restaurant-ecosystem',
    legacySlugs: ['restaurant'],
    name: 'Restaurant Ecosystem',
    category: 'Restaurant Operations',
    label: '04 - RESTAURANT / CAFE',
    accent: '#C7371A',
    shortPromise: 'A QR menu, ordering flow and manager workspace for restaurants that need fewer handoffs.',
    problem: 'Menus change, orders are repeated manually, and the kitchen often receives information late. A restaurant system should connect the guest action to the order queue, menu control and owner reporting.',
    audience: ['restaurant owners', 'front-of-house teams', 'kitchen teams', 'guests'],
    managerModules: ['Dashboard', 'Orders', 'Menu manager', 'Kitchen queue', 'Delivery', 'Analytics'],
    clientModules: ['Digital menu', 'Table selection', 'QR entry', 'Checkout path', 'Order status'],
    workflows: ['Guest scans QR', 'Table is selected', 'Order is sent', 'Kitchen queue updates', 'Manager tracks service'],
    automations: ['Order status update', 'Kitchen queue update', 'Menu availability change', 'Delivery tracking alert'],
    outcomes: ['Waiters stop retyping the same order into multiple places.', 'The owner sees service and sales activity from one operating view.'],
    customization: ['Branding', 'Menu categories', 'Table rules', 'Kitchen states', 'Languages', 'Delivery workflow'],
    implementation: ['Menu setup', 'QR table setup', 'Manager configuration', 'Deployment', 'Team onboarding', 'Initial support'],
    managerAssets: [ASSETS.restaurant.manager.dashboard, ASSETS.restaurant.manager.orders, ASSETS.restaurant.manager.menuManager, ASSETS.restaurant.manager.delivery, ASSETS.restaurant.manager.analytics],
    clientAssets: [ASSETS.restaurant.client.digitalMenu, ASSETS.restaurant.client.tableSelection, ASSETS.restaurant.client.qrCode, ASSETS.restaurant.client.signIn],
    demoUrl: 'https://rastaurant-app.netlify.app',
    secondaryDemoUrl: 'https://appmanagerestaurant.netlify.app',
    ctaLabel: 'Explore Restaurant Ecosystem',
    whatsappMessage: CONTACT_MESSAGES.restaurant,
  },
];

export const BUSINESS_SOLUTIONS: BusinessSolution[] = [
  {
    key: 'gym',
    label: 'Gym',
    heading: 'FitPulse PRO handles the day-to-day gym operation.',
    painPoints: ['Renewals are forgotten', 'Attendance is checked by hand', 'Payments are disconnected from member status'],
    modules: PROJECTS[0].managerModules,
    workflow: PROJECTS[0].workflows,
    projectSlug: PROJECTS[0].slug,
    ctaLabel: 'Explore FitPulse',
    visual: PROJECTS[0].managerAssets[0],
    whatsappMessage: PROJECTS[0].whatsappMessage,
  },
  {
    key: 'salon',
    label: 'Salon / Spa',
    heading: 'SalonFlow turns bookings, services and client history into one system.',
    painPoints: ['Bookings depend on WhatsApp', 'Double booking risk', 'No shared client history'],
    modules: PROJECTS[2].managerModules,
    workflow: PROJECTS[2].workflows,
    projectSlug: PROJECTS[2].slug,
    ctaLabel: 'Explore SalonFlow',
    visual: PROJECTS[2].managerAssets[0],
    whatsappMessage: PROJECTS[2].whatsappMessage,
  },
  {
    key: 'restaurant',
    label: 'Restaurant / Cafe',
    heading: 'Restaurant Ecosystem connects the QR menu to the service workflow.',
    painPoints: ['Printed menus go out of date', 'Orders are repeated manually', 'Kitchen and service teams lose status'],
    modules: PROJECTS[3].managerModules,
    workflow: PROJECTS[3].workflows,
    projectSlug: PROJECTS[3].slug,
    ctaLabel: 'Explore Restaurant',
    visual: PROJECTS[3].managerAssets[0],
    whatsappMessage: PROJECTS[3].whatsappMessage,
  },
  {
    key: 'real-estate',
    label: 'Real Estate',
    heading: 'EstatePulse gives agencies a property database with a sales pipeline.',
    painPoints: ['Leads sit in phones', 'Property stock is scattered', 'Follow-ups are easy to miss'],
    modules: PROJECTS[1].managerModules,
    workflow: PROJECTS[1].workflows,
    projectSlug: PROJECTS[1].slug,
    ctaLabel: 'Explore EstatePulse',
    visual: PROJECTS[1].managerAssets[0],
    whatsappMessage: PROJECTS[1].whatsappMessage,
  },
  {
    key: 'custom',
    label: 'Custom Business',
    heading: 'Custom systems replace the manual workflow specific to your operation.',
    painPoints: ['One person remembers the process', 'Data is typed twice', 'Owners cannot see what is happening now'],
    modules: ['Custom interface', 'Admin dashboard', 'Database', 'Roles', 'Notifications', 'Reports', 'Mobile experience'],
    workflow: ['Workflow is mapped', 'Screens are designed', 'System is built', 'Team is onboarded', 'Support continues'],
    ctaLabel: 'Book a workflow audit',
    visual: PROJECTS[0].managerAssets[0],
    whatsappMessage: CONTACT_MESSAGES.general,
  },
];

export const PROJECT_BY_SLUG = new Map(PROJECTS.map((project) => [project.slug, project]));

export const LEGACY_PROJECT_SLUGS: Record<string, string> = PROJECTS.reduce<Record<string, string>>((acc, project) => {
  acc[project.slug] = project.slug;
  project.legacySlugs.forEach((slug) => {
    acc[slug] = project.slug;
  });
  return acc;
}, {});

export function getProject(slug: string) {
  return PROJECT_BY_SLUG.get(slug);
}

export interface SystemDef {
  key: string;
  name: string;
  color: string;
  from: number;
  to: number;
}

export interface DialEvent {
  h: number;
  s: number;
  t: string;
}

export interface SpecItem {
  k: string;
  v: string;
}

export interface ChapterItem {
  label: string;
  title: string;
  paras: string[];
  hasList?: boolean;
  list?: SpecItem[];
}

export interface WorkflowItem {
  no: string;
  step: string;
  detail: string;
}

export interface ProjectData {
  slug: string;
  no: string;
  name: string;
  sector: string;
  status: string;
  shot: string;
  url: string;
  windowLabel: string;
  accent: string;
  oneLine: string;
  tags: string[];
  shotCaption: string;
  loadNote: string;
  spec: SpecItem[];
  chapters: ChapterItem[];
  flow: WorkflowItem[];
  liveUrl?: string;
  secondLiveUrl?: string;
}

export interface RemovalItem {
  no: string;
  title: string;
  body: string;
  replacedBy: string;
}

export interface MethodItem {
  no: string;
  dur: string;
  title: string;
  body: string;
}

export const SYSTEMS: SystemDef[] = [
  { key: 'fitpulse', name: 'FitPulse PRO', color: '#0F7B5A', from: 6, to: 23 },
  { key: 'estatepulse', name: 'EstatePulse', color: '#1B4DE4', from: 9, to: 19 },
  { key: 'salonflow', name: 'SalonFlow', color: '#A31C4B', from: 9, to: 20 },
  { key: 'piatto', name: 'Il Piatto', color: '#C7371A', from: 11, to: 24 },
  { key: 'kds', name: 'Dajjaj KDS', color: '#7A5C00', from: 11, to: 24 }
];

export const EVENTS: DialEvent[] = [
  { h: 6.25, s: 0, t: 'QR pass scanned — member through the door before staff arrive' },
  { h: 8.0, s: 0, t: 'Billing run executes across 148 active memberships' },
  { h: 9.5, s: 2, t: 'Coloration booked — only the colourist who can do it is offered' },
  { h: 10.1, s: 1, t: 'Map search converts to a lead, attached to a named buyer' },
  { h: 11.75, s: 3, t: 'Table 7 scans the QR and opens the menu bound to that table' },
  { h: 11.78, s: 4, t: 'Ticket lands on the kitchen screen, timer starts' },
  { h: 13.4, s: 0, t: 'Front desk sells a day pass; invoice issued in MAD' },
  { h: 15.3, s: 1, t: 'Private tour scheduled against real agent availability' },
  { h: 17.0, s: 2, t: 'POS checkout recorded against the appointment, not a loose sale' },
  { h: 18.5, s: 0, t: 'WhatsApp fires: three passes expire inside seven days' },
  { h: 20.2, s: 3, t: 'Delivery order joins the same dispatch queue as dine-in' },
  { h: 21.75, s: 4, t: 'Slow ticket flagged at fourteen minutes, while it still matters' },
  { h: 23.4, s: 0, t: 'Last check-in of the day; the dashboard closes the book' }
];

export const LOAD_PROFILES: Record<string, number[]> = {
  fitpulse: [0, 0, 0, 0, 0, 0, 0.35, 0.72, 0.9, 0.55, 0.4, 0.38, 0.5, 0.45, 0.35, 0.4, 0.6, 0.85, 1, 0.9, 0.62, 0.4, 0.22, 0.1],
  estatepulse: [0, 0, 0, 0, 0, 0, 0, 0.1, 0.3, 0.7, 0.95, 0.8, 0.5, 0.6, 0.85, 1, 0.8, 0.6, 0.35, 0.15, 0, 0, 0, 0],
  salonflow: [0, 0, 0, 0, 0, 0, 0, 0.1, 0.4, 0.85, 1, 0.9, 0.6, 0.7, 0.9, 0.95, 0.85, 0.7, 0.5, 0.3, 0.12, 0, 0, 0],
  restaurant: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.4, 0.9, 1, 0.6, 0.3, 0.35, 0.5, 0.75, 1, 0.95, 0.7, 0.4, 0.18]
};

export const PROJECTS: ProjectData[] = [
  {
    slug: 'fitpulse',
    no: '01',
    name: 'FitPulse PRO',
    sector: 'Fitness & wellness',
    status: 'In production',
    shot: '/assets/proj-fitpulse.png',
    url: 'veloce.studio/fitpulse-pro',
    windowLabel: '06:00 → 23:00',
    accent: '#0F7B5A',
    oneLine: 'The operating system for a gym: memberships, QR door access, billing and trainer schedules in one place.',
    tags: ['Member CRM', 'QR access terminal', 'Recurring billing', 'MAD invoicing'],
    shotCaption: 'Owner dashboard — MRR, live check-ins, expiring memberships',
    loadNote: 'Two peaks, not one: the pre-work crowd and the post-work crowd. The door terminal has to hold both without a person standing at it, which is why access is enforced by the membership record rather than by the desk.',
    liveUrl: 'https://appfit-plus.netlify.app',
    spec: [
      { k: 'Client', v: 'Club de fitness, Casablanca' },
      { k: 'Surfaces', v: 'Owner dashboard · front desk · door terminal · member portal' },
      { k: 'Stack', v: 'Next.js 14, TypeScript, Tailwind' },
      { k: 'Currency / locale', v: 'MAD · French' },
      { k: 'Status', v: 'Live, in daily use' }
    ],
    chapters: [
      {
        label: 'The bottleneck',
        title: 'Membership was a notebook and the door was a person.',
        paras: [
          'Renewals were tracked on paper, so nobody knew who had lapsed until they walked in and argued about it. Access control was whoever happened to be at the desk. Revenue was a monthly guess assembled from receipt books.',
          'The owner did not need a website. He needed to know, at any hour, how many members are active, how much money is actually committed this month, and who is inside the building right now.'
        ]
      },
      {
        label: 'The decision',
        title: 'One record per member, everything else reads from it.',
        paras: [
          'We refused a multi-tool setup. Every surface — the QR terminal at the door, the front-desk screen, the billing run, the trainer calendar — reads and writes the same member record. A membership that expires stops opening the door without anyone doing anything.'
        ],
        hasList: true,
        list: [
          { k: 'Access', v: 'QR pass scanned at a wall terminal; expiry enforced at the door, not the desk.' },
          { k: 'Billing', v: 'Recurring subscription runs with card collection and MAD invoices.' },
          { k: 'Scheduling', v: 'Trainer availability with slot locking so two coaches cannot be double-booked.' },
          { k: 'Notifications', v: 'WhatsApp alerts for pass expiry and unpaid invoices.' }
        ]
      },
      {
        label: 'What it does now',
        title: 'The dashboard is the first thing opened and the last thing closed.',
        paras: [
          'Active members, committed monthly revenue, today’s check-ins, passes expiring inside seven days and payments still outstanding sit on one screen in MAD. The live entry feed shows each scan at the QR portico as it happens.',
          'Front desk staff were trained in an afternoon, because the interface is built around the four things they actually do rather than around the database.'
        ]
      }
    ],
    flow: [
      { no: '01', step: 'Member onboarding', detail: 'Profile, plan, payment method captured once.' },
      { no: '02', step: 'QR access terminal', detail: 'Pass scanned at the door; expiry enforced automatically.' },
      { no: '03', step: 'Automated POS & billing', detail: 'Recurring charges, MAD invoices, outstanding tracking.' },
      { no: '04', step: 'Retention signals', detail: 'Lapse and expiry alerts pushed over WhatsApp.' }
    ]
  },
  {
    slug: 'estatepulse',
    no: '02',
    name: 'EstatePulse',
    sector: 'Real estate',
    status: 'In production',
    shot: '/assets/proj-estatepulse.png',
    url: 'veloce.studio/estatepulse',
    windowLabel: '09:00 → 19:00',
    accent: '#1B4DE4',
    oneLine: 'A property marketplace with a real sales pipeline behind it — public buyers on one side, agents working leads on the other.',
    tags: ['Map discovery', 'Lead intake', 'Kanban pipeline', '3D tours'],
    shotCaption: 'Public buyer search — map discovery with virtual tour listings',
    loadNote: 'Buyers browse late morning and again mid-afternoon, which is exactly when agents are out on viewings. That gap is why lead capture had to be automatic rather than someone noticing a message.',
    liveUrl: 'https://appreal-estate.netlify.app',
    spec: [
      { k: 'Client', v: 'Agence immobilière, Morocco' },
      { k: 'Surfaces', v: 'Public marketplace · agent CRM · tour scheduler' },
      { k: 'Stack', v: 'Next.js 14, TypeScript, Tailwind' },
      { k: 'Currency / locale', v: 'MAD · French' },
      { k: 'Status', v: 'Live, in daily use' }
    ],
    chapters: [
      {
        label: 'The bottleneck',
        title: 'Listings lived on portals; leads died in WhatsApp.',
        paras: [
          'Enquiries arrived as messages on personal phones. Whoever saw one first answered it, or nobody did. There was no record of which buyer had seen which property, so agents re-pitched flats people had already rejected.',
          'The business was losing deals in the gap between a buyer’s interest and an agent noticing it.'
        ]
      },
      {
        label: 'The decision',
        title: 'Treat the marketplace and the CRM as one system, not two products.',
        paras: [
          'Every action a buyer takes on the public side becomes a typed event on the agent side. A search, a saved property, a tour request — all of it lands in the pipeline attached to a named buyer, with the property they were looking at.',
          'Discovery is map-first because that is how people actually shop for a home: neighbourhood before feature list.'
        ],
        hasList: true,
        list: [
          { k: 'Discovery', v: 'Map-based search with filters on city, type, budget in MAD.' },
          { k: 'Listing depth', v: '3D virtual tours so buyers self-qualify before a visit.' },
          { k: 'Pipeline', v: 'Kanban stages from new lead to offer, one card per buyer.' },
          { k: 'Scheduling', v: 'Private tour booking against agent availability.' }
        ]
      },
      {
        label: 'What it does now',
        title: 'An agent opens one board and knows the day.',
        paras: [
          'Leads arrive with context attached instead of as a bare phone number. Tours are booked into real availability rather than negotiated over five messages. Nothing sits unassigned, because an unowned lead is visible as an unowned lead.'
        ]
      }
    ],
    flow: [
      { no: '01', step: 'Map discovery', detail: 'Public buyers filter by area, type and budget.' },
      { no: '02', step: 'Lead ingestion', detail: 'Interest becomes a typed event on a named buyer.' },
      { no: '03', step: 'Kanban pipeline', detail: 'Agents move cards through stages to offer.' },
      { no: '04', step: 'Tour scheduling', detail: 'Private viewings booked against agent calendars.' }
    ]
  },
  {
    slug: 'salonflow',
    no: '03',
    name: 'SalonFlow',
    sector: 'Beauty & wellness',
    status: 'In production',
    shot: '/assets/proj-salonflow.png',
    url: 'veloce.studio/salonflow',
    windowLabel: '09:00 → 20:00',
    accent: '#A31C4B',
    oneLine: 'Salon booking that knows which stylist can actually do the service, plus the POS and the client history behind the chair.',
    tags: ['Specialist scheduling', 'Double-booking guard', 'POS checkout', 'Client history'],
    shotCaption: 'Client-facing booking — service selection and specialist availability',
    loadNote: 'The salon runs near capacity for most of the day with a dip at lunch. When every hour is nearly full, a single double-booking cascades through the rest of the day — which is why the constraint is modelled, not the calendar.',
    liveUrl: 'https://salonbeautyapp.netlify.app',
    spec: [
      { k: 'Client', v: 'Salon de coiffure & soins, Casablanca' },
      { k: 'Surfaces', v: 'Client booking · reception · POS terminal · staff rota' },
      { k: 'Stack', v: 'Next.js 14, TypeScript, Tailwind' },
      { k: 'Currency / locale', v: 'MAD · French' },
      { k: 'Status', v: 'Live, in daily use' }
    ],
    chapters: [
      {
        label: 'The bottleneck',
        title: 'A shared calendar cannot know that only two people cut curly hair.',
        paras: [
          'Generic booking tools sold the salon a slot as if any staff member could fill it. In practice a colour treatment needs a specific colourist, takes ninety minutes, and blocks a basin. Overbooking meant clients waiting in reception while a stylist finished someone else’s appointment.',
          'Reception was the real system: a person holding the true schedule in their head.'
        ]
      },
      {
        label: 'The decision',
        title: 'Model the constraint, not the calendar.',
        paras: [
          'Services carry a duration, a required skill and a resource. Availability is computed from staff who hold that skill and the resources still free. The slot a client sees is a slot that can genuinely be delivered.',
          'Checkout was pulled into the same system so the visit, the service performed and the payment stay one record — which is what makes client lifetime value real rather than estimated.'
        ],
        hasList: true,
        list: [
          { k: 'Booking', v: 'Service-first selection, then only the specialists who can perform it.' },
          { k: 'Guard', v: 'Double-booking prevented at slot level, including shared resources.' },
          { k: 'Checkout', v: 'POS tied to the appointment, MAD receipts.' },
          { k: 'History', v: 'Per-client visit and treatment record for retention.' }
        ]
      },
      {
        label: 'What it does now',
        title: 'Reception stopped being the database.',
        paras: [
          'Clients book without a phone call. Stylists see their own day. The owner sees which services and which staff actually generate revenue, and which clients have not come back.'
        ]
      }
    ],
    flow: [
      { no: '01', step: 'Service selection', detail: 'Client picks the treatment, not a generic slot.' },
      { no: '02', step: 'Double-booking guard', detail: 'Skill and resource constraints applied to availability.' },
      { no: '03', step: 'POS checkout', detail: 'Payment recorded against the appointment.' },
      { no: '04', step: 'Client retention', detail: 'Visit history drives follow-up and lifetime value.' }
    ]
  },
  {
    slug: 'restaurant',
    no: '04',
    name: 'Restaurant ecosystem',
    sector: 'Restaurant ops',
    status: 'Dual system, live',
    shot: '/assets/proj-restaurant.png',
    url: 'veloce.studio/restaurant-ecosystem',
    windowLabel: '11:00 → 24:00',
    accent: '#C7371A',
    oneLine: 'Two connected apps: a QR menu guests order from, and a kitchen terminal that dispatches and tracks every ticket.',
    tags: ['Table QR ordering', 'Kitchen display', 'Direct dispatch', 'Delivery register'],
    shotCaption: 'Guest-facing QR menu — Il Piatto Gastronomy ordering surface',
    loadNote: 'Two hard services, lunch and dinner, with dinner the heavier of the two. Everything in the design answers one question: how many minutes has this ticket been waiting, and can the room see it.',
    liveUrl: 'https://rastaurant-app.netlify.app',
    secondLiveUrl: 'https://appmanagerestaurant.netlify.app',
    spec: [
      { k: 'Deployments', v: 'Il Piatto (guest menu) · Dajjaj Hamoud (kitchen terminal)' },
      { k: 'Surfaces', v: 'Table QR menu · kitchen display · delivery register' },
      { k: 'Stack', v: 'Next.js 14, TypeScript, Tailwind' },
      { k: 'Currency / locale', v: 'MAD · French' },
      { k: 'Status', v: 'Live, two connected apps' }
    ],
    chapters: [
      {
        label: 'The bottleneck',
        title: 'The order was retyped three times before it reached a pan.',
        paras: [
          'A guest told a waiter, the waiter wrote a ticket, someone shouted it into the kitchen, and a runner guessed which table it belonged to. Every retype was a chance to lose a modifier or a table number, and at peak nobody could say how long a ticket had been waiting.'
        ]
      },
      {
        label: 'The decision',
        title: 'The guest’s tap is the kitchen’s ticket. No step in between.',
        paras: [
          'Scanning the QR at the table opens the menu bound to that table. Sending the order writes it straight to the kitchen display with the table, the items and the modifiers intact. Two separate apps, one shared order model — which is why a change on either side stays consistent.',
          'Kitchen staff work a screen designed for a hot, loud room: large type, ticket age visible, one tap to advance a state.'
        ],
        hasList: true,
        list: [
          { k: 'Guest app', v: 'Table-bound QR menu with categories, photos and modifiers.' },
          { k: 'Kitchen display', v: 'Live tickets with dispatch timers and state advance.' },
          { k: 'Delivery', v: 'Register for off-premise orders alongside dine-in.' },
          { k: 'Consistency', v: 'One order model shared by both applications.' }
        ]
      },
      {
        label: 'What it does now',
        title: 'Nobody retypes an order.',
        paras: [
          'Waiters stop being couriers for information. Tickets are timestamped, so slow tickets are visible while there is still time to act on them. Menu changes are made once and appear on every table.'
        ]
      }
    ],
    flow: [
      { no: '01', step: 'Table QR scan', detail: 'Menu opens bound to the specific table.' },
      { no: '02', step: 'Direct dispatch', detail: 'Order written straight to the kitchen, no retyping.' },
      { no: '03', step: 'Kitchen KDS tracking', detail: 'Ticket age and state on a large-format screen.' },
      { no: '04', step: 'Delivery register', detail: 'Off-premise orders handled in the same flow.' }
    ]
  }
];

export const REMOVALS: RemovalItem[] = [
  {
    no: '01',
    title: 'The spreadsheet that only one person understands',
    body: 'Every business we have worked with had a workbook holding the real state of things — bookings, stock, who owes what. It is fragile, it is one person’s memory, and it does not survive that person taking a holiday.',
    replacedBy: 'A system of record with roles'
  },
  {
    no: '02',
    title: 'Information retyped between people',
    body: 'An order told to a waiter and written on a pad. A membership renewal noted on paper then entered later. Each retype is a chance to lose data and an hour nobody bills for.',
    replacedBy: 'One entry, many surfaces'
  },
  {
    no: '03',
    title: 'Decisions made on a monthly guess',
    body: 'Owners we build for could not answer simple questions — committed revenue this month, who lapsed, which service earns most — without an afternoon of adding up receipts.',
    replacedBy: 'Live operational dashboards'
  }
];

export const METHOD: MethodItem[] = [
  {
    no: '01',
    dur: 'Week 1',
    title: 'Workflow audit',
    body: 'We sit with the people doing the manual work and map every step, including the ones nobody documents.'
  },
  {
    no: '02',
    dur: 'Week 1–2',
    title: 'Interface blueprint',
    body: 'Low-friction screens for staff and for customers, designed around the handful of actions each one repeats all day.'
  },
  {
    no: '03',
    dur: 'Week 2–6',
    title: 'Full-stack build',
    body: 'Next.js 14 and TypeScript, with the integrations the operation needs: card collection, WhatsApp, POS hardware.'
  },
  {
    no: '04',
    dur: 'Ongoing',
    title: 'Launch & run',
    body: 'Staff training on site, then hosting and support while the system is load-bearing for the business.'
  }
];

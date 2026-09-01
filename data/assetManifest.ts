export interface MarketingAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

const asset = (src: string, width: number, height: number, alt: string, caption: string): MarketingAsset => ({
  src,
  width,
  height,
  alt,
  caption,
});

export const ASSETS = {
  fitpulse: {
    manager: {
      dashboard: asset('/assets/better-quality/fitpulse-pro/manager/dashboard.png', 1920, 1026, 'FitPulse PRO manager dashboard showing membership, attendance and payment operations.', 'Dashboard view for memberships, attendance and revenue signals.'),
      members: asset('/assets/better-quality/fitpulse-pro/manager/members.png', 1920, 877, 'FitPulse PRO member CRM screen.', 'Member records keep plans, contact details and status in one place.'),
      payments: asset('/assets/better-quality/fitpulse-pro/manager/payments.png', 1920, 877, 'FitPulse PRO payments and cashier screen.', 'Payments and cash desk activity stay attached to the member profile.'),
      qrCheckin: asset('/assets/better-quality/fitpulse-pro/manager/qr-checkin.png', 1920, 915, 'FitPulse PRO QR check-in management screen.', 'QR check-in validates membership before recording attendance.'),
      reminders: asset('/assets/better-quality/fitpulse-pro/manager/expiry-reminders.png', 1920, 877, 'FitPulse PRO membership renewal reminder screen.', 'Expiry reminders make renewal work visible before access becomes a problem.'),
    },
    client: {
      checkin: asset('/assets/better-quality/fitpulse-pro/client/checkin.png', 1920, 893, 'FitPulse member QR code screen.', 'Members can present a QR pass for fast check-in.'),
      paymentHistory: asset('/assets/better-quality/fitpulse-pro/client/payment-history.png', 1920, 877, 'FitPulse member payment history screen.', 'Payment history gives members and staff the same record.'),
      schedule: asset('/assets/better-quality/fitpulse-pro/client/schedule.png', 1920, 877, 'FitPulse class and planning screen.', 'Class planning makes the member experience more than a static account page.'),
    },
  },
  estatepulse: {
    manager: {
      dashboard: asset('/assets/better-quality/estatepulse/manager/dashboard.png', 1920, 1251, 'EstatePulse manager dashboard overview.', 'The agency sees property inventory, leads and visits from one workspace.'),
      properties: asset('/assets/better-quality/estatepulse/manager/properties.png', 1920, 1236, 'EstatePulse property inventory screen.', 'Property records replace scattered folders and personal notes.'),
      pipeline: asset('/assets/better-quality/estatepulse/manager/pipeline.png', 1920, 1015, 'EstatePulse lead pipeline screen.', 'The lead pipeline tracks buyer interest and follow-up stages.'),
      leads: asset('/assets/better-quality/estatepulse/manager/leads.png', 1920, 919, 'EstatePulse client file screen.', 'Client files keep buyer context available to the whole team.'),
    },
    client: {
      propertyList: asset('/assets/better-quality/estatepulse/client/property-list.png', 1920, 3342, 'EstatePulse public property browsing homepage.', 'Buyers browse property stock before requesting a visit.'),
      visitBooking: asset('/assets/better-quality/estatepulse/client/visit-booking.png', 701, 712, 'EstatePulse buyer visit booking space.', 'Visit requests become structured lead activity for the agency.'),
    },
  },
  salonflow: {
    manager: {
      dashboard: asset('/assets/better-quality/salonflow/manager/dashboard.png', 1920, 1336, 'SalonFlow daily planning screen.', 'Daily planning shows appointments, timing and service load.'),
      calendar: asset('/assets/better-quality/salonflow/manager/calendar.png', 1920, 1743, 'SalonFlow weekly calendar grid.', 'The calendar protects the team from accidental double booking.'),
      customers: asset('/assets/better-quality/salonflow/manager/customers.png', 1920, 1175, 'SalonFlow customer CRM screen.', 'Customer profiles keep history attached to each appointment.'),
      services: asset('/assets/better-quality/salonflow/manager/services.png', 1920, 1448, 'SalonFlow service management screen.', 'Service setup controls durations, prices and staff capability.'),
      team: asset('/assets/better-quality/salonflow/manager/team.png', 1920, 1017, 'SalonFlow team and working hours screen.', 'Team hours make availability a business rule, not a memory task.'),
    },
    client: {
      services: asset('/assets/better-quality/salonflow/client/services.png', 1920, 3962, 'SalonFlow client service browsing page.', 'Clients can browse services and start a booking without a phone call.'),
      appointments: asset('/assets/better-quality/salonflow/client/appointments.png', 663, 779, 'SalonFlow client appointments page.', 'Clients can see their appointments and booking status.'),
    },
  },
  restaurant: {
    manager: {
      dashboard: asset('/assets/better-quality/restaurant-ecosystem/manager/dashboard.png', 1920, 912, 'Restaurant manager dashboard screen.', 'The manager sees orders, tables and service activity without retyping.'),
      orders: asset('/assets/better-quality/restaurant-ecosystem/manager/orders.png', 1920, 1106, 'Restaurant order tracking screen.', 'Order tracking keeps the kitchen and front of house on the same state.'),
      menuManager: asset('/assets/better-quality/restaurant-ecosystem/manager/menu-manager.png', 1920, 931, 'Restaurant menu and stock management screen.', 'Menu and stock updates are changed once and reflected across the system.'),
      delivery: asset('/assets/better-quality/restaurant-ecosystem/manager/delivery.png', 1920, 877, 'Restaurant delivery radar screen.', 'Delivery work can be monitored alongside dine-in service.'),
      analytics: asset('/assets/better-quality/restaurant-ecosystem/manager/analytics.png', 1920, 877, 'Restaurant sales report screen.', 'Sales reporting turns service activity into owner visibility.'),
    },
    client: {
      digitalMenu: asset('/assets/better-quality/restaurant-ecosystem/client/digital-menu.png', 1920, 4618, 'Restaurant digital menu homepage.', 'Guests open a QR menu and order from the table.'),
      tableSelection: asset('/assets/better-quality/restaurant-ecosystem/client/table-selection.png', 472, 368, 'Restaurant table selection screen.', 'Table binding keeps each order attached to the right place.'),
      qrCode: asset('/assets/better-quality/restaurant-ecosystem/client/qr-code.png', 554, 662, 'Restaurant QR code client screen.', 'QR flows make the customer entry point immediate.'),
      signIn: asset('/assets/better-quality/restaurant-ecosystem/client/sign-in.png', 548, 586, 'Restaurant client sign-in screen.', 'Customer state can be captured before ordering when needed.'),
    },
  },
};

export const ALL_MARKETING_ASSETS: MarketingAsset[] = Object.values(ASSETS).flatMap((project) => [
  ...Object.values(project.manager),
  ...Object.values(project.client),
]);

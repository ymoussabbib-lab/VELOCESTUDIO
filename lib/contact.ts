export const WHATSAPP_NUMBER = '212659592823';

export const CONTACT_MESSAGES = {
  general: 'Bonjour, je souhaite en savoir plus sur les solutions de Veloce Studio.',
  gym: 'Bonjour, je suis intéressé par votre solution de gestion pour salle de sport.',
  restaurant: 'Bonjour, je souhaite voir votre solution de menu QR et commande digitale.',
  salon: 'Bonjour, je souhaite voir la solution de réservation pour mon salon.',
  realEstate: 'Bonjour, je souhaite voir votre solution immobilière et CRM.',
};

export function createWhatsAppHref(message: string) {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${WHATSAPP_NUMBER}?${params.toString()}`;
}

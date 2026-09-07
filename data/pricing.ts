import { PROJECTS } from './projects';

export interface Pack {
  code: string;
  kicker: string;
  flagged: boolean;
  name: string;
  from: boolean;
  price: string;
  delivery: string;
  maintenance: string;
  who: string;
  painQuote: string;
  painBody: string;
  inherits?: string;
  includes: string[];
  gain: string;
}

export const PACKS: Pack[] = [
  {
    code: 'Pack 01',
    kicker: 'Le socle',
    flagged: false,
    name: 'Essentiel',
    from: false,
    price: '15 000',
    delivery: '2 semaines',
    maintenance: '500 MAD / mois',
    who: 'toute votre information vit aujourd’hui dans un cahier, un fichier Excel et des conversations WhatsApp.',
    painQuote: '« Où est l’info ? »',
    painBody:
      'Retrouver un numéro, une échéance ou un historique prend plus de temps que le travail lui-même. Et une seule personne sait vraiment où tout se trouve — quand elle n’est pas là, l’entreprise ralentit.',
    includes: [
      'Une fiche par client, adhérent ou dossier — avec tout l’historique, retrouvée en deux secondes',
      'Le planning, l’agenda ou l’inventaire de votre activité, à jour et visible par toute l’équipe',
      'Recherche instantanée sur tout : nom, téléphone, date, statut, montant',
      'Accessible depuis n’importe quel téléphone ou ordinateur, sans rien installer',
      'Vos couleurs, votre logo et vos termes métier — pas ceux d’un logiciel générique',
      'Reprise de vos données existantes (Excel, cahier, fichiers)',
      'Formation de votre équipe sur place, puis 1 mois de support inclus',
    ],
    gain: 'Vous arrêtez de chercher. Et l’entreprise cesse de dépendre de la mémoire d’une seule personne.',
  },
  {
    code: 'Pack 02',
    kicker: 'Notre recommandation',
    flagged: true,
    name: 'Business',
    from: false,
    price: '45 000',
    delivery: '4 semaines',
    maintenance: '900 MAD / mois',
    who: 'vos clients doivent vous appeler pour la moindre chose, et votre équipe ressaisit la même information à plusieurs endroits.',
    painQuote: '« Tout passe par moi. »',
    painBody:
      'Chaque réservation, chaque demande, chaque relance réclame une intervention humaine. Le soir et le week-end, l’activité s’arrête simplement parce que personne ne répond.',
    inherits: 'Tout le pack Essentiel, plus :',
    includes: [
      'Un espace client en ligne — réservation, catalogue, menu QR ou demande structurée, selon votre métier',
      'Vos clients réservent, consultent et commandent seuls, 24h/24, sans passer par vous',
      'Relances automatiques par WhatsApp et e-mail : échéance qui approche, rendez-vous de demain, devis sans réponse',
      'Comptes et rôles par poste — chacun voit ce qui le concerne, et rien d’autre',
      'Tableau de bord : ce qui rentre, ce qui est en retard, ce qui demande une décision aujourd’hui',
      'Des demandes qui arrivent complètes — plus de rappel pour redemander la date ou le budget',
      'Formation de l’équipe, puis 3 mois de support et d’ajustements inclus',
    ],
    gain: 'Vos clients se servent seuls, les relances partent sans vous, et vous récupérez vos soirées.',
  },
  {
    code: 'Pack 03',
    kicker: 'Sur mesure',
    flagged: false,
    name: 'Intégration complète',
    from: true,
    price: '90 000',
    delivery: '6 à 10 semaines',
    maintenance: 'dès 1 500 MAD / mois',
    who: 'vous avez plusieurs points de vente, plusieurs équipes, ou plusieurs outils qui ne se parlent pas.',
    painQuote: '« Je pilote à l’impression. »',
    painBody:
      'Chaque site a ses chiffres, chaque outil sa version de la vérité, et la consolidation se fait à la main en fin de mois. Les décisions arrivent avec trois semaines de retard sur les faits.',
    inherits: 'Tout le pack Business, plus :',
    includes: [
      'Multi-site et multi-agence — chaque point de vente travaille chez lui, la direction voit l’ensemble',
      'Le matériel branché au système : caisse, borne d’accès QR ou badge, écran de cuisine, imprimante tickets, lecteur code-barres',
      'Paiement en ligne et encaissement rattachés directement à la fiche client',
      'Intégration avec ce que vous utilisez déjà : comptabilité, WhatsApp Business, e-mail, exports pour votre comptable',
      'Pilotage direction : chiffre du jour par site, comparaisons, marges, alertes',
      'Modules sur mesure propres à votre métier — la règle que vous êtes seul à appliquer, et qu’aucun logiciel du marché ne connaît',
      'Formation par site, puis 6 mois de support et d’évolutions inclus',
    ],
    gain: 'Une seule vérité pour toute l’entreprise. Vous décidez sur le chiffre du jour, pas sur une impression de fin de mois.',
  },
];

export type MatrixCell = boolean | string;

export interface MatrixGroup {
  title: string;
  rows: { label: string; cells: [MatrixCell, MatrixCell, MatrixCell] }[];
}

export const MATRIX: MatrixGroup[] = [
  {
    title: 'Le socle',
    rows: [
      { label: 'Fiches clients et historique complet', cells: [true, true, true] },
      { label: 'Planning, agenda ou inventaire partagé', cells: [true, true, true] },
      { label: 'Accès téléphone et ordinateur, sans installation', cells: [true, true, true] },
      { label: 'Vos couleurs, votre logo, vos termes métier', cells: [true, true, true] },
      { label: 'Reprise de vos données existantes', cells: [true, true, true] },
    ],
  },
  {
    title: 'Vos clients et votre équipe',
    rows: [
      { label: 'Espace client en ligne (réservation, catalogue, menu QR)', cells: [false, true, true] },
      { label: 'Relances automatiques WhatsApp et e-mail', cells: [false, true, true] },
      { label: 'Comptes et rôles par poste', cells: [false, true, true] },
      { label: 'Tableau de bord de gestion', cells: [false, true, true] },
    ],
  },
  {
    title: 'Toute l’entreprise',
    rows: [
      { label: 'Multi-site et multi-agence', cells: [false, false, true] },
      { label: 'Matériel : caisse, borne QR, écran cuisine, badge', cells: [false, false, true] },
      { label: 'Paiement en ligne et encaissement', cells: [false, false, true] },
      { label: 'Intégrations (comptabilité, WhatsApp Business, exports)', cells: [false, false, true] },
      { label: 'Pilotage direction et analytics', cells: [false, false, true] },
      { label: 'Modules sur mesure propres à votre métier', cells: [false, false, true] },
    ],
  },
  {
    title: 'Mise en route',
    rows: [
      { label: 'Formation de l’équipe sur place', cells: [true, true, 'par site'] },
      { label: 'Support inclus après le lancement', cells: ['1 mois', '3 mois', '6 mois'] },
      { label: 'Délai de livraison', cells: ['2 sem.', '4 sem.', '6–10 sem.'] },
      { label: 'Maintenance mensuelle', cells: ['500', '900', 'dès 1 500'] },
    ],
  },
];

export interface DemoEntry {
  name: string;
  modules: string;
  showTo: string;
  url: string;
  accent: string;
}

const [fitpulse, estatepulse, salonflow, restaurant] = PROJECTS;

export const DEMOS: DemoEntry[] = [
  {
    name: 'FitPulse PRO',
    modules: 'Adhérents · échéances · présence',
    showTo:
      'salles de sport, centres de formation, écoles de langues, clubs — tout métier avec des adhérents, des échéances de paiement et une présence à contrôler.',
    url: fitpulse.demoUrl,
    accent: fitpulse.accent,
  },
  {
    name: 'EstatePulse',
    modules: 'Catalogue · demandes · suivi commercial',
    showTo:
      'agences immobilières et agences de voyage — tout métier avec un catalogue à présenter, des demandes qui arrivent, et des relances qui se perdent.',
    url: estatepulse.demoUrl,
    accent: estatepulse.accent,
  },
  {
    name: 'SalonFlow',
    modules: 'Réservation · calendrier · fiche client',
    showTo:
      'salons, spas, cabinets, centres esthétiques — tout métier qui fonctionne au rendez-vous et où le planning n’existe que dans la tête de l’accueil.',
    url: salonflow.demoUrl,
    accent: salonflow.accent,
  },
  {
    name: 'Il Piatto — côté client',
    modules: 'Menu QR · commande à table',
    showTo:
      'restaurants et cafés. Le client scanne le QR de sa table, consulte le menu et commande. C’est la démonstration la plus rapide à faire en rendez-vous.',
    url: restaurant.demoUrl,
    accent: restaurant.accent,
  },
  {
    name: 'Il Piatto — côté gérant',
    modules: 'Commandes · cuisine · livraison · chiffres',
    showTo:
      'le même restaurant, vu du bureau. Ouvrez-le à côté du précédent : la commande passée sur un écran apparaît sur l’autre. C’est ça, « un seul système ».',
    url: restaurant.secondaryDemoUrl ?? restaurant.demoUrl,
    accent: restaurant.accent,
  },
];

export const PROCESS = [
  {
    num: '01',
    title: 'Audit de votre fonctionnement',
    when: 'Gratuit · 1 séance',
    body: 'On regarde comment votre journée se passe réellement : qui saisit quoi, où, et combien de fois la même information est retapée. Vous repartez avec la liste écrite de vos points de friction — que vous travailliez avec nous ou non.',
  },
  {
    num: '02',
    title: 'Blueprint',
    when: 'Semaine 1 à 2',
    body: 'Les écrans de votre système, dessinés sur votre métier et avec vos mots. Vous validez avant qu’une seule ligne de code soit écrite. C’est à ce moment que le prix devient ferme — jamais avant d’avoir vu votre fonctionnement.',
  },
  {
    num: '03',
    title: 'Construction',
    when: 'Semaine 2 à 6',
    body: 'Nous développons. Chaque semaine, vous suivez l’avancement sur un lien réel que vous pouvez ouvrir et essayer vous-même — pas sur des captures d’écran ni un rapport d’avancement.',
  },
  {
    num: '04',
    title: 'Lancement et prise en main',
    when: 'Puis support inclus',
    body: 'Mise en ligne, reprise de vos données, et formation de l’équipe sur place. Nous restons disponibles pendant que le système devient l’outil de tous les jours, pas juste un logiciel de plus.',
  },
];

export const FAQ = [
  {
    q: 'Est-ce que le système m’appartient ?',
    a: 'Oui. Le code et les données sont à vous. Pas d’abonnement par utilisateur, pas de licence qui augmente quand votre équipe grandit. La maintenance mensuelle couvre l’hébergement, les sauvegardes et le support — et elle est arrêtable.',
  },
  {
    q: 'Mon équipe n’est pas à l’aise avec l’informatique.',
    a: 'C’est la contrainte de départ, pas un obstacle. Nos écrans sont conçus pour être utilisés debout, à l’accueil, entre deux clients. La formation sur place est incluse dans les trois packs, et le support répond en français comme en darija.',
  },
  {
    q: 'Combien de temps avant que ça tourne vraiment ?',
    a: 'De 2 à 10 semaines selon le pack. Et vous n’attendez pas la fin pour voir : dès la deuxième semaine, l’avancement est consultable sur un lien réel que vous pouvez essayer.',
  },
  {
    q: 'Et si mes besoins changent dans six mois ?',
    a: 'C’est un système sur mesure, pas un logiciel figé. Ajouter un module, un point de vente ou un rôle est prévu dès la conception — c’est précisément la différence avec un abonnement où vous attendez que l’éditeur décide.',
  },
  {
    q: 'Pourquoi pas un logiciel du marché, moins cher ?',
    a: 'Si un logiciel du marché fait exactement ce dont vous avez besoin, prenez-le — nous vous le dirons pendant l’audit. Nous intervenons quand votre métier a une règle qu’aucun logiciel standard ne connaît. C’est justement cette règle qui vous fait perdre du temps chaque jour.',
  },
  {
    q: 'Vos clients, c’est qui ?',
    a: 'Veloce Studio est un studio récent. Les cinq systèmes de cette page sont des applications complètes que nous avons construites et déployées, et que vous pouvez ouvrir et utiliser maintenant — c’est plus vérifiable qu’une liste de noms. C’est aussi pourquoi nos tarifs sont ceux d’un studio qui construit sa référence.',
  },
];

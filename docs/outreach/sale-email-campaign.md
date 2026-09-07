# Salé outreach — 6 verified email prospects

**Built:** 2026-09-03 · **Source:** `Sale_100_Qualified_Prospects_With_Emails.xlsx` → sheet `Email Audit`
**Sender:** Mohamed Mabsout · Veloce Studio · WhatsApp +212 659 592 823 · velocestudio.tech

---

## 0. Read this before sending

### The honesty line (non-negotiable)

`PRODUCT.md` states the four case studies — FitPulse PRO, EstatePulse, SalonFlow, Restaurant Ecosystem — are
**prototype builds with invented client names and invented metrics** ("148 active memberships", "Club de fitness,
Casablanca"). Staging that on a portfolio site is a marketing choice. Putting it in a cold email to a named
business is a factual claim made to a specific person to win a specific sale.

**Every email below therefore avoids invented client results and leans on what is verifiably real:**

| Ledger | Real? | Verified |
|---|---|---|
| 5 live demo apps, HTTP 200, clickable, fully usable | Real | curl, 2026-09-03 |
| 40 product screenshots at 1920px | Real | `public/assets/better-quality/` |
| Studio site velocestudio.tech | Real | pending DNS cutover, 2026-09-07 |
| Per-prospect audit findings in each email | Real | DNS + HTTP, 2026-09-03 |
| "We helped X grow Y%" | Invented | never used below |
| Named client testimonials | None exist | never used below |

A working system the prospect can click and drive in 20 seconds outperforms an unverifiable statistic anyway.
That is the whole strategy here: **we don't claim, we hand them the keys.**

### Pre-send checklist

1. **Send from a domain address, not Gmail.** `mabsoutmohamed989@gmail.com` → a cold B2B pitch from a free
   inbox reads as spam to a business. Set up `mohamed@velocestudio.tech` on the new domain first. This is the single
   highest-impact fix in this document.
2. **Set SPF + DKIM + DMARC** on that domain before the first send.
3. **No attachment on touch #1.** Attachments from an unknown sender raise spam score, and three of these six
   domains run self-hosted mail with blunt filters. Link the live demo in email 1; attach screenshots in
   follow-up #2 or the moment they reply.
4. **Send 2–3 per day, Tue–Thu, 09:00–10:30 Morocco time.** Not all six at once from a cold domain.
5. **Plain text or very light HTML.** No tracking pixel, no logo header, no image-only email.
6. **One thread per prospect.** Follow-ups go as replies to your own sent email, never as new threads.

### Deliverability check — all 6 verified 2026-09-03

| Domain | MX host | Note |
|---|---|---|
| gls-sprachzentrum.ma | mx1/mx2.hostinger.com | OK |
| msmvoyages.com | mail.msmvoyages.com | OK — self-hosted, filter may be blunt |
| wego-travel.ma | mail.wego-travel.ma | OK — self-hosted, filter may be blunt |
| atlantique.ma | \_dc-mx.cf151c31719d.atlantique.ma → 185.221.181.238 | OK — resolves |
| fitnesspark.ma | fitnesspark-ma.mail.protection.outlook.com | OK — Microsoft 365, strict |
| onair-fitness.ma | mx0–4.mail.ovh.net | OK — OVH |

---

## 1. Send order

| # | Prospect | Email | Fit | Verified hook | Priority |
|---|---|---|---|---|---|
| 1 | GLS Sprachenzentrum | info@gls-sprachzentrum.ma | 5 | 6 centres, 8 WhatsApp lines, 1 shared inbox | **SEND FIRST** |
| 2 | MSM Voyages | contact@msmvoyages.com | 5 | Contact form offers "Kayak"; they sell Omra | **SEND FIRST** |
| 3 | We Go Travel | contact@wego-travel.ma | 5 | Empty served HTML → dead WhatsApp link previews | **SEND FIRST** |
| 4 | Centre Atlantique Formation | sale@atlantique.ma | 4 | Their Salé subdomain is NXDOMAIN — dead | High |
| 5 | Fitness Park Salé | sale@fitnesspark.ma | 4 | Franchise — club-level ask only | Low yield |
| 6 | On Air Marina | lamarinarabatsale@onair-fitness.ma | 4 | Franchise — club-level ask only | Low yield |

Prospects 1–4 are independent operators: the owner reads the inbox and can sign. Prospects 5–6 are branches of
8- and 42-club networks — the core system is bought at HQ, so the emails below deliberately ask for something
small and club-local instead of pitching software they cannot authorise.

---

## 2. GLS Sprachenzentrum — `info@gls-sprachzentrum.ma`

**Verified 2026-09-03 on gls-sprachzentrum.ma/fr/contact:** six centres (Agadir, Casablanca, Kénitra,
Marrakech, Rabat, Salé), each with its own WhatsApp line — 8 distinct `wa.me` numbers on that one page — and a
single shared address `info@gls-sprachzentrum.ma` for all six. The site also runs levels A1→C1, ÖSD/Goethe/GLS
exams, certificate verification, attestation requests and translation tracking. Large operational surface, no
visible shared student record.

**Demo to link:** FitPulse PRO — `https://appfit-plus.netlify.app`
Structural match: members → students · membership plans → course cycles · payments/expiry → tuition
instalments · QR check-in → classroom attendance.

**Subject A:** `6 centres, 8 numéros WhatsApp, une seule boîte mail`
**Subject B:** `Le dossier étudiant qui manque entre vos 6 centres`

```
Bonjour,

Sur votre page contact, GLS affiche six centres — Agadir, Casablanca, Kénitra,
Marrakech, Rabat, Salé — avec un numéro WhatsApp par centre, et une seule
adresse, info@gls-sprachzentrum.ma, pour les six.

Ce qui veut dire qu'un étudiant qui écrit au WhatsApp de Salé, règle sa tranche
à Rabat et passe son ÖSD à Casablanca existe à trois endroits différents — et
dans aucun dossier commun.

Nous construisons exactement ce dossier commun. Voici un de nos systèmes, en
ligne, que vous pouvez ouvrir et utiliser maintenant :

https://appfit-plus.netlify.app

Ce n'est pas une maquette : c'est une application réelle, déployée et
fonctionnelle. Adhérents, échéances, paiements, pointage QR. Remplacez
« adhérent » par « étudiant » et « échéance » par « tranche d'inscription » —
c'est votre opération, centre par centre, avec une vue direction sur les six.

Si le sujet vous parle, je vous prépare gratuitement un écran « fiche étudiant
GLS » à vos couleurs, avec vos niveaux A1→C1 et vos trois examens. Répondez
simplement « écran » et je m'en occupe.

Mohamed Mabsout
Veloce Studio — systèmes de gestion sur mesure
WhatsApp : +212 659 592 823
velocestudio.tech

P.S. — Le pointage QR de la démo sert aussi à l'assiduité en salle : un scan à
l'entrée, la présence est enregistrée, et vous voyez qui décroche avant la fin
du cycle plutôt qu'après.
```

**Attach on reply / follow-up #1:** `fitpulse-pro/manager/members.png` (232 KB) +
`fitpulse-pro/manager/payments.png` (193 KB)

---

## 3. MSM Voyages — `contact@msmvoyages.com`

**Verified 2026-09-03 on msmvoyages.ma/fr/contact:** the contact form (`action="contactEmail"`) collects
**Nom et prénom, Téléphone, a dropdown labelled "Aventure" with Kayak / Randonnée / Autre, and a free message.**
No email field, no destination, no dates, no traveller count, no budget. Meanwhile the site's own top
destinations are Omra (Mawlid + October), Istanbul, Malaisie, Toubkal. Two branches: Salé and Casablanca.
Operating since 2014, positions itself as an e-tourism player.

**Demo to link:** EstatePulse — `https://appreal-estate.netlify.app`
Structural match: property inventory → départs/packages · buyer lead → voyageur · visit scheduling → date de
départ · agent pipeline → suivi entre Salé et Casablanca.

**Subject A:** `Votre formulaire propose « Kayak » — vos clients cherchent l'Omra`
**Subject B:** `Ce qui arrive vraiment quand on remplit votre formulaire`

```
Bonjour,

J'ai rempli le formulaire de contact de msmvoyages.ma, pour voir ce qui arrive
de votre côté.

Il demande le nom, le téléphone, un message — et un menu déroulant « Aventure »
proposant Kayak, Randonnée, Autre. Alors que vos destinations mises en avant
sont l'Omra, Istanbul et la Malaisie.

Concrètement : une demande d'Omra pour une famille arrive chez vous sous la
forme d'un prénom et d'un numéro. Pas de destination, pas de dates, pas de
nombre de voyageurs, pas de budget. Quelqu'un rappelle et repose toutes les
questions. Et entre Salé et Casablanca, personne ne sait qui a déjà rappelé.

Voici un système de suivi de demandes que nous avons construit — en ligne,
ouvrable tout de suite :

https://appreal-estate.netlify.app

Il est fait pour l'immobilier, mais la mécanique est la vôtre : une demande
entre qualifiée, elle est assignée à un agent, planifiée, relancée — et rien
ne se perd entre deux agences.

Quinze minutes, en visio ou sur WhatsApp, pour que je vous montre à quoi
ressemble la version « départs et voyageurs » ? Dites-moi simplement un
créneau qui vous arrange.

Mohamed Mabsout
Veloce Studio — systèmes de gestion sur mesure
WhatsApp : +212 659 592 823
velocestudio.tech

P.S. — Le correctif le plus rapide ne coûte rien et ne passe pas par nous :
ajoutez destination, dates et nombre de voyageurs à votre formulaire actuel.
Vous verrez la différence sur les rappels dès la première semaine. Je vous dis
lesquels en deux lignes si vous le souhaitez, sans contrepartie.
```

**Attach on reply / follow-up #1:** `estatepulse/manager/pipeline.png` (240 KB) +
`estatepulse/manager/leads.png` (166 KB)

---

## 4. We Go Travel — `contact@wego-travel.ma`

**Verified 2026-09-03 on www.wego-travel.ma:** the served HTML is ~10 KB and contains no content — only
`<title>` and a meta description. The entire site is rendered client-side by JavaScript. WhatsApp, Facebook
and Instagram link-preview crawlers do not execute JavaScript, so every shared circuit link falls back to the
same generic homepage title and description. Their own meta description reads *"Réservez en ligne — meilleur
prix garanti"*, yet there is no booking or inquiry form in the delivered markup. Social:
instagram.com/wegotravel, facebook.com/wegotravel.

**Demo to link:** EstatePulse — `https://appreal-estate.netlify.app` (public catalogue + inquiry + agency pipeline)

**Subject A:** `Testez : collez un lien de vos circuits dans WhatsApp`
**Subject B:** `Vos circuits perdent leur photo quand un client les partage`

```
Bonjour,

Une chose à tester en dix secondes, avant même de me répondre.

Ouvrez WhatsApp. Collez le lien d'un de vos circuits wego-travel.ma dans
n'importe quelle conversation. Regardez l'aperçu qui s'affiche.

Vous verrez le même titre et la même description pour tous vos circuits — pas
la photo du circuit, pas son prix, pas son nom.

La raison est technique : votre site est entièrement construit par JavaScript
dans le navigateur, et le HTML livré est vide. Les robots d'aperçu de WhatsApp,
Facebook et Instagram n'exécutent pas de JavaScript. Ils ne voient rien.

Au Maroc, le partage se fait sur WhatsApp. Chaque fois qu'un client satisfait
envoie votre circuit à sa famille, le lien arrive nu.

Deuxième point, plus rentable encore : votre description annonce « Réservez en
ligne ». Il n'y a pourtant aucun formulaire de réservation dans la page livrée.
Les demandes finissent donc en message privé, à traiter à la main.

Voici ce que nous construisons — en ligne, ouvrable maintenant :

https://appreal-estate.netlify.app

Catalogue public consultable, demande structurée côté client, pipeline de suivi
côté agence. C'est un système réel, pas une maquette : vous pouvez cliquer
partout.

Vingt minutes pour vous montrer la version « circuits et excursions » ?

Mohamed Mabsout
Veloce Studio — systèmes de gestion sur mesure
WhatsApp : +212 659 592 823
velocestudio.tech

P.S. — Faites d'abord le test WhatsApp. Si l'aperçu s'affiche correctement,
ignorez ce message : je me serai trompé.
```

**Why that P.S. works:** it stakes the whole email on a claim they can falsify in ten seconds. Verified false
today — the served HTML carries no per-circuit metadata — so the test lands in our favour and the credibility
transfer is immediate.

**Attach on reply / follow-up #1:** `estatepulse/manager/dashboard.png` (243 KB) +
`estatepulse/client/visit-booking.png` (117 KB).
Do **not** attach `estatepulse/client/property-list.png` (1.6 MB) or `salonflow/client/services.png`
(3.2 MB) — compress first if you want to use them.

---

## 5. Centre Atlantique Formation Salé — `sale@atlantique.ma`

**Verified 2026-09-03:** `sale.atlantique.ma` — the address published as their Salé branch contact page —
returns **NXDOMAIN from both Google DNS (8.8.8.8) and Cloudflare DNS (1.1.1.1)**. The subdomain no longer
exists. `www.atlantique.ma` returns **Cloudflare error 522** (connection timed out to origin). Only the apex
`atlantique.ma` responds 200. Mail is unaffected — the MX record resolves — so `sale@atlantique.ma` should
still deliver.

This is the strongest opener in the batch: urgent, free for them to verify, costing them money right now, and
it proves real work was done before writing.

**Demo to link:** FitPulse PRO — `https://appfit-plus.netlify.app`
Structural match: members → stagiaires · plans → sessions de formation · payments/expiry → tranches ·
QR check-in → feuille de présence.

**Subject A:** `Votre page Salé (sale.atlantique.ma) ne répond plus`
**Subject B:** `Problème technique sur atlantique.ma — vérifié ce matin`

```
Bonjour,

Je vous écris d'abord pour un point technique, pas pour vendre quoi que ce soit.

L'adresse de votre centre de Salé — sale.atlantique.ma — ne résout plus. Le nom
de domaine n'existe plus du tout côté DNS ; je l'ai vérifié ce matin sur les
serveurs de Google (8.8.8.8) et de Cloudflare (1.1.1.1) : les deux répondent
« domaine inexistant ».

Par ailleurs, www.atlantique.ma renvoie une erreur Cloudflare 522. Seul
atlantique.ma, sans le www, fonctionne encore.

Résultat concret : toute personne qui cherche votre centre de Salé et clique sur
un ancien lien, un résultat Google ou un lien partagé tombe sur une page
d'erreur. Vos e-mails, eux, fonctionnent — c'est pour ça que celui-ci arrive.

C'est réparable en une heure par votre hébergeur. Je vous le signale sans
contrepartie, faites-en ce que vous voulez.

Deuxième raison de vous écrire, et vous pouvez vous arrêter ici si le sujet ne
vous intéresse pas. Nous construisons des systèmes de gestion pour les centres
de formation : inscriptions, sessions, présence, tranches de paiement. Un de nos
systèmes est en ligne, vous pouvez l'ouvrir et l'utiliser maintenant :

https://appfit-plus.netlify.app

Il est bâti pour une salle de sport, mais la structure est identique à la vôtre :
une fiche par personne, un cycle avec une date de fin, des paiements échelonnés,
et un pointage à l'entrée qui alimente la feuille de présence.

Si vous voulez en parler une fois le domaine réglé, je suis joignable.

Mohamed Mabsout
Veloce Studio — systèmes de gestion sur mesure
WhatsApp : +212 659 592 823
velocestudio.tech
```

**Attach on reply / follow-up #1:** `fitpulse-pro/manager/dashboard.png` (270 KB) +
`fitpulse-pro/manager/qr-checkin.png` (175 KB)

---

## 6. Fitness Park Salé — `sale@fitnesspark.ma`

**Verified 2026-09-03 on fitnesspark.ma/club/sale/:** 8-club network (Ain Sebaa, Casablanca Racine,
Mohammedia Plaza, Rabat Arribat, Rabat Carrousel, Salé, CFC Sidi Maarouf, Roudani). Salé club at Angle Route
Nationale de Kénitra / Av. Assalam, open 7/7 06:00–23:00, tel 0662261633. Live promotion: **first month at
190 DHS**. Mail runs on Microsoft 365.

**Reality check:** membership software is bought by the network, not by the club. Pitching a membership system
here wastes the shot. The one thing a club manager can act on locally is **what happens to the walk-ins the
190 DHS offer brings in who don't sign that day.** Short email, small ask, no demo dump.

**Subject A:** `L'offre à 190 DHS — et les visiteurs qui ne signent pas le jour même`
**Subject B:** `Une question rapide pour le responsable du club de Salé`

```
Bonjour,

Message court, et je commence par ce que je ne vous propose pas : je ne viens
pas remplacer le système d'abonnement du réseau Fitness Park. Ça se décide au
siège, pas au club, et ce serait vous faire perdre votre temps.

Ma question porte sur un point purement local.

Votre offre « premier mois à 190 DHS » fait entrer des visiteurs au club de
Salé. Une partie signe sur place. L'autre visite, hésite, dit qu'elle va
réfléchir — et repart.

Qu'est-ce qui arrive à celle-là ? Si la réponse est « un nom sur un cahier » ou
« rien », c'est exactement ce que nous savons régler : une fiche visiteur, une
relance automatique à J+2 et J+7, et un tableau qui vous dit combien de visites
sont devenues des abonnements ce mois-ci.

C'est petit, ça se met en place en quelques jours, et ça n'interfère avec aucun
outil du réseau.

Si ça vous parle, dix minutes au téléphone suffisent. Si ce n'est pas vous qui
décidez de ça, dites-le moi simplement — je ne relancerai pas.

Mohamed Mabsout
Veloce Studio — Salé / Rabat / Casablanca
WhatsApp : +212 659 592 823
velocestudio.tech
```

**Attach on reply only:** `fitpulse-pro/manager/expiry-reminders.png` (166 KB)

---

## 7. On Air Marina — `lamarinarabatsale@onair-fitness.ma`

**Verified 2026-09-03 on onair-fitness.ma/club/rabat-marina-sale/:** 42-club network, +100 000 members
claimed. Club at Avenue de Fès, La Marina, Salé 11000, tel +212 5 37 88 64 28, open 7/7 06:00–23:00. The site
already runs an **"Espace adhérent"** (member portal), so the core system is solved at HQ. The club page's live
CTA is **"Je réserve ma séance d'essai"** — trial session booking. Pricing from 299 DH/month, 3600 DH/year.

**Reality check:** same as Fitness Park. The buyable local gap is the trial session → membership conversion,
which happens at the club and is almost certainly followed up by hand.

**Subject A:** `Après la séance d'essai à La Marina — que se passe-t-il ?`
**Subject B:** `Une question sur vos séances d'essai (club Marina uniquement)`

```
Bonjour,

Je vous écris pour le club de La Marina uniquement, pas pour le réseau.

Votre site propose « Je réserve ma séance d'essai ». Quelqu'un réserve, vient,
s'entraîne une fois. Et ensuite ?

De l'extérieur, la suite semble manuelle : quelqu'un au club pense à rappeler,
ou n'y pense pas. L'Espace adhérent gère les personnes déjà abonnées — pas
celles qui sont venues une fois et n'ont pas encore signé.

C'est précisément là que se perd du chiffre d'affaires : entre la séance d'essai
et l'abonnement à 299 DH/mois.

Ce que nous mettons en place tient en trois choses : chaque essai devient une
fiche, une relance part automatiquement à J+1 et J+5, et vous avez un chiffre en
fin de mois — combien d'essais, combien d'abonnements, quel pourcentage. Rien
qui touche aux systèmes du réseau.

Un aperçu de notre travail, en ligne et cliquable :
https://appfit-plus.netlify.app

Dix minutes au téléphone si le sujet vous intéresse. Sinon, indiquez-moi la
bonne personne et je ne vous relancerai pas.

Mohamed Mabsout
Veloce Studio — Salé / Rabat / Casablanca
WhatsApp : +212 659 592 823
velocestudio.tech
```

**Attach on reply only:** `fitpulse-pro/manager/members.png` (232 KB)

---

## 8. Follow-up sequence

Most replies to cold B2B email arrive on touch 2 and 3, not touch 1. Send each as a **reply inside your own
original thread**, never as a new email.

### Follow-up #1 — J+4 (this is where the screenshots go)

```
Bonjour,

Je remonte mon message précédent, avec deux captures d'écran plutôt qu'un lien
— c'est plus rapide à regarder que d'ouvrir la démo.

[2 pièces jointes selon le prospect]

Le point important : ces écrans ne sont pas des maquettes. C'est un système en
fonctionnement, que vous pouvez ouvrir vous-même ici :
[lien démo]

Si le sujet n'est pas d'actualité, répondez juste « pas maintenant » et je
n'insiste pas.

Mohamed
```

### Follow-up #2 — J+11 (angle change: give something away for free)

```
Bonjour,

Dernier message de ma part sur ce sujet.

Plutôt que d'insister, voici quelque chose d'utile même si nous ne travaillons
jamais ensemble : [une observation concrète et gratuite tirée de l'audit].

Si un jour vous voulez que ce soit un vrai système plutôt qu'une astuce, vous
avez mon numéro.

Bonne continuation,
Mohamed
WhatsApp : +212 659 592 823
```

Free giveaway to use per prospect:
- **GLS** — regroupez vos 8 numéros derrière un seul WhatsApp Business avec réponses automatiques par centre ; gratuit, une après-midi de travail.
- **MSM** — ajoutez destination / dates / nombre de voyageurs à votre formulaire ; trois champs, effet immédiat sur les rappels.
- **We Go Travel** — ajoutez des balises Open Graph statiques par circuit ; l'aperçu WhatsApp redevient correct sans refonte.
- **Atlantique** — remettez un enregistrement DNS pour sale.atlantique.ma, ou redirigez-le vers atlantique.ma.
- **Fitness Park / On Air** — un simple formulaire visiteur sur tablette à l'accueil récupère déjà 100 % des essais.

### Follow-up #3 — J+25, WhatsApp, not email

WhatsApp has a far higher open rate than email in Morocco, and every one of these prospects publishes a number.
Keep it to two lines and reference the email so it isn't cold:

```
Bonjour, Mohamed de Veloce Studio. Je vous ai écrit à [email] au sujet de
[accroche en 4 mots]. Si c'est plus simple par ici, je vous montre le système
en 2 minutes. Sinon je ne vous dérange plus.
```

**Stop after touch 3.** A fourth unanswered touch to a small business burns the domain and the relationship.

---

## 9. Reply playbook

| They say | You do |
|---|---|
| "Combien ça coûte ?" | Never quote by email. *"Ça dépend du périmètre — c'est justement ce que l'audit détermine. 30 minutes et je vous donne un chiffre ferme."* |
| "Envoyez une proposition" | Refuse politely. *"Une proposition écrite avant d'avoir vu votre process serait de la devinette. 30 minutes d'abord, la proposition ensuite — et elle sera juste."* |
| "On a déjà un système" | *"Parfait. Question honnête : est-ce que vos équipes ressaisissent encore quelque chose à la main quelque part ?"* That gap is the wedge. |
| "Envoyez-moi la démo" | Send the link **plus** 2 screenshots, and propose a slot in the same message. Never send a link with no next step attached. |
| No reply | Follow-up sequence above. Stop at 3. |
| **"Vos clients sont qui ?"** | **Answer straight:** *"Veloce Studio est un studio récent. Les systèmes que je vous ai montrés sont des builds complets que nous avons construits et déployés — vous pouvez les ouvrir et les utiliser, ce qui est plus vérifiable qu'une liste de noms. C'est aussi pourquoi mon tarif est celui d'un studio qui construit sa référence."* Do **not** invent a client list. This answer converts better than a bluff and cannot blow up later. |

---

## 10. Assets we have — and the one we don't

**Have, verified 2026-09-03:**
- 5 live demo apps, all HTTP 200: appfit-plus · appreal-estate · salonbeautyapp · rastaurant-app · appmanagerestaurant (all `.netlify.app`)
- 40 screenshots at 1920px in `public/assets/better-quality/` (4 verticals × manager + client)
- Studio site: velocestudio.tech

**Do not have: video.** There is no screen recording anywhere in the repo.

Worth knowing: for a **cold first touch, the live demo link beats a video** — it is interactive, weightless,
and costs no deliverability. Video earns its place in exactly two spots: follow-up #3 over WhatsApp, and the
moment a prospect replies "envoyez-moi la démo".

If we want it: Playwright 1.62.1 is already installed in this repo and can record 30–45 second scripted
walkthroughs of each demo (WebM natively; ffmpeg needed for MP4). One per vertical — gym, travel/CRM,
training — covers all six prospects.

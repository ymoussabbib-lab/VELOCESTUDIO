import { Fragment } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PACKS, MATRIX, DEMOS, PROCESS, FAQ, type MatrixCell } from '@/data/pricing';
import { CONTACT_MESSAGES, createWhatsAppHref } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Grille tarifaire - Veloce Studio',
  description:
    'Trois packs pour remplacer le cahier, l’Excel et les conversations WhatsApp par un seul système : Essentiel, Business et Intégration complète.',
  robots: { index: false, follow: false },
};

const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 11mm 10mm; }
  header, footer, .no-print { display: none !important; }
  .print-reset { padding-top: 0 !important; }
  body { font-size: 10.5pt; }
  .avoid-break { break-inside: avoid; }
  a[href^="http"]::after { content: ""; }
}
`;

function Mark({ value }: { value: MatrixCell }) {
  if (value === true) return <span className="inline-block h-[9px] w-[9px] bg-ink" aria-label="Inclus" />;
  if (value === false) return <span className="text-grey-400" aria-label="Non inclus">&mdash;</span>;
  return <span>{value}</span>;
}

export default function OffresPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <Header />

      <main className="print-reset pt-16">
        {/* ---------------- Masthead ---------------- */}
        <section className="border-b border-ink bg-ink text-on-dark">
          <div className="mx-auto max-w-7xl px-4 pb-9 pt-7 md:px-8 lg:px-12">
            <div className="flex flex-wrap items-baseline justify-between gap-5 border-b border-line-dark pb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-on-dark-muted">
              <span className="font-bold tracking-[0.22em] text-on-dark">Veloce Studio</span>
              <span className="flex flex-wrap gap-x-5 gap-y-1">
                <span>Grille tarifaire</span>
                <span>Édition 2026</span>
                <span>Casablanca · Rabat · Salé</span>
              </span>
            </div>
            <h1 className="mt-6 max-w-[20ch] text-balance text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[46px]">
              Trois façons d’arrêter de gérer votre entreprise à la main.
            </h1>
            <p className="mt-4 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.1em] text-accent">
              <span className="inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-accent animate-vs-blink" aria-hidden />
              Des systèmes en production, pas des maquettes
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          {/* ---------------- Intro ---------------- */}
          <div className="mt-12 grid gap-8 md:grid-cols-[1.35fr_1fr] md:gap-12">
            <p className="max-w-[46ch] text-[19px] leading-[1.45] text-ink-soft md:text-[20px]">
              Vous ne manquez pas de travail. Vous perdez du temps à le suivre&nbsp;: retrouver un dossier,
              rappeler un client pour la troisième fois, recompter les chiffres du mois. Nous construisons
              le système qui fait ce suivi à votre place —{' '}
              <strong className="font-semibold text-ink">
                conçu sur votre façon de travailler, pas sur celle d’un logiciel standard
              </strong>
              .
            </p>
            <div className="flex flex-col gap-2 border-l-2 border-accent py-0.5 pl-4 text-sm text-ink-muted">
              <b className="font-mono text-[11px] font-medium uppercase tracking-[0.11em] text-ink">
                Les tarifs ci-dessous sont fermes pour les périmètres décrits
              </b>
              <span>
                Chaque projet commence par un audit gratuit de votre fonctionnement — une séance, sur
                place ou à distance, sans engagement. C’est cet audit qui confirme le pack adapté et le
                prix final. Vous en repartez avec la liste de vos points de friction, que vous
                travailliez avec nous ou non.
              </span>
            </div>
          </div>

          {/* ---------------- Packs ---------------- */}
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-2 border-t border-ink pt-3.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-grey-600">
                Les trois packs
              </span>
              <h2 className="text-balance text-[27px] font-semibold leading-[1.15] tracking-[-0.015em]">
                Du minimum utile à l’intégration complète
              </h2>
            </div>

            <div className="grid md:grid-cols-3 md:border-t-2 md:border-ink">
              {PACKS.map((pack, i) => (
                <article
                  key={pack.code}
                  className={`avoid-break flex flex-col gap-4 border-t-2 border-ink pb-8 pt-5 md:border-t-0 md:border-r md:border-line-alt md:px-6 md:pb-7 ${
                    i === 0 ? 'md:pl-0' : ''
                  } ${i === PACKS.length - 1 ? 'md:border-r-0 md:pr-0' : ''}`}
                >
                  <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.13em] text-grey-600">
                    <span>{pack.code}</span>
                    <span className={pack.flagged ? 'font-bold text-accent' : ''}>{pack.kicker}</span>
                  </div>

                  <h3 className="text-[25px] font-semibold leading-[1.1] tracking-[-0.02em]">{pack.name}</h3>

                  <div className="flex items-baseline gap-2 border-b border-line pb-4 font-mono tabular-nums">
                    {pack.from ? (
                      <span className="self-center text-xs uppercase tracking-[0.08em] text-grey-600">dès</span>
                    ) : null}
                    <span className="text-[38px] font-bold leading-none tracking-[-0.03em]">{pack.price}</span>
                    <span className="text-[13px] font-medium tracking-[0.1em] text-grey-600">MAD</span>
                  </div>

                  <dl className="-mt-1.5 flex flex-col">
                    <div className="flex justify-between gap-3 border-b border-line pb-1.5 font-mono text-[11.5px] tracking-[0.05em]">
                      <dt className="text-grey-600">Livraison</dt>
                      <dd className="font-medium">{pack.delivery}</dd>
                    </div>
                    <div className="mt-1.5 flex justify-between gap-3 border-b border-line pb-1.5 font-mono text-[11.5px] tracking-[0.05em]">
                      <dt className="text-grey-600">Maintenance</dt>
                      <dd className="font-medium">{pack.maintenance}</dd>
                    </div>
                  </dl>

                  <p className="text-[14.5px] text-ink-muted">
                    <b className="font-semibold text-ink">Pour vous si</b> {pack.who}
                  </p>

                  <div className="flex flex-col gap-1.5 bg-paper-alt px-4 py-3.5">
                    <p className="text-base font-semibold italic tracking-[-0.01em]">{pack.painQuote}</p>
                    <p className="text-[13.5px] leading-[1.5] text-ink-muted">{pack.painBody}</p>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {pack.inherits ? (
                      <li className="font-mono text-[11.5px] uppercase tracking-[0.07em] text-grey-600">
                        {pack.inherits}
                      </li>
                    ) : null}
                    {pack.includes.map((item) => (
                      <li
                        key={item}
                        className="relative pl-[18px] text-sm leading-[1.45] text-ink-soft before:absolute before:left-0 before:top-2 before:h-px before:w-[7px] before:bg-ink before:content-['']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto border-t border-ink pt-3.5">
                    <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.13em] text-grey-600">
                      Ce que ça change
                    </span>
                    <p className="text-[15.5px] font-medium leading-[1.4] tracking-[-0.01em]">{pack.gain}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ---------------- Matrix ---------------- */}
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-2 border-t border-ink pt-3.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-grey-600">
                Comparatif
              </span>
              <h2 className="text-balance text-[27px] font-semibold leading-[1.15] tracking-[-0.015em]">
                Ce que contient chaque pack
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-t-2 border-ink">
                    <th scope="col" className="pb-3 pr-3 pt-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-grey-600">
                      Prestation
                    </th>
                    {PACKS.map((pack) => (
                      <th
                        key={pack.code}
                        scope="col"
                        className="w-[15%] px-3 pb-3 pt-2.5 text-center font-mono text-[11px] font-medium uppercase tracking-[0.12em]"
                      >
                        {pack.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((group) => (
                    <Fragment key={group.title}>
                      <tr className="avoid-break">
                        <th
                          scope="row"
                          colSpan={4}
                          className="border-b border-line-alt pb-2.5 pt-6 text-left font-mono text-[10.5px] font-normal uppercase tracking-[0.13em] text-grey-600"
                        >
                          {group.title}
                        </th>
                      </tr>
                      {group.rows.map((row) => (
                        <tr key={row.label} className="avoid-break">
                          <th
                            scope="row"
                            className="border-b border-line py-2.5 pr-3 text-left text-[14px] font-normal text-ink-soft"
                          >
                            {row.label}
                          </th>
                          {row.cells.map((cell, i) => (
                            <td
                              key={i}
                              className="border-b border-line px-3 py-2.5 text-center font-mono text-[12.5px] tabular-nums"
                            >
                              <Mark value={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  <tr className="avoid-break">
                    <th scope="row" className="border-t border-ink pr-3 pt-3.5 text-left text-[14px] font-semibold">
                      Investissement
                    </th>
                    {PACKS.map((pack) => (
                      <td
                        key={pack.code}
                        className="border-t border-ink px-3 pt-3.5 text-center font-mono text-[12.5px] font-semibold tabular-nums"
                      >
                        {pack.from ? 'dès ' : ''}
                        {pack.price} MAD
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------------- Demos ---------------- */}
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-2 border-t border-ink pt-3.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-grey-600">
                Cinq systèmes en ligne · ouvrables maintenant
              </span>
              <h2 className="text-balance text-[27px] font-semibold leading-[1.15] tracking-[-0.015em]">
                Ne nous croyez pas sur parole. Ouvrez-les.
              </h2>
              <p className="max-w-[62ch] text-base text-ink-muted">
                Ce ne sont pas des captures d’écran ni des maquettes&nbsp;: ce sont des applications
                complètes et déployées. Cliquez, créez une fiche, passez une commande, scannez un QR — le
                système répond. C’est plus vérifiable qu’une liste de références.
              </p>
            </div>

            <div className="border-t border-ink">
              {DEMOS.map((demo) => (
                <a
                  key={demo.url + demo.name}
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="avoid-break group grid grid-cols-[26px_1fr] items-start gap-x-4 gap-y-2 border-b border-line py-4 md:grid-cols-[34px_1fr_1.25fr_auto] md:items-baseline md:gap-x-6"
                >
                  <span
                    className="h-2 w-[26px] self-center"
                    style={{ background: demo.accent }}
                    aria-hidden
                  />
                  <span className="flex flex-col gap-1.5 text-[18px] font-semibold tracking-[-0.015em]">
                    {demo.name}
                    <span className="font-mono text-[10.5px] font-normal uppercase tracking-[0.11em] text-grey-600">
                      {demo.modules}
                    </span>
                  </span>
                  <span className="col-start-2 text-sm leading-[1.45] text-ink-muted md:col-start-auto">
                    <b className="font-semibold text-ink">À montrer à&nbsp;:</b> {demo.showTo}
                  </span>
                  <span className="col-start-2 whitespace-nowrap border-b border-line-alt pb-0.5 font-mono text-[11.5px] text-grey-600 group-hover:border-accent group-hover:text-accent md:col-start-auto">
                    {demo.url.replace('https://', '')}&nbsp;↗
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* ---------------- Process ---------------- */}
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-2 border-t border-ink pt-3.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-grey-600">
                Déroulement
              </span>
              <h2 className="text-balance text-[27px] font-semibold leading-[1.15] tracking-[-0.015em]">
                Comment ça se passe, étape par étape
              </h2>
            </div>

            <div className="grid md:grid-cols-4">
              {PROCESS.map((step, i) => (
                <div
                  key={step.num}
                  className={`avoid-break flex flex-col gap-2.5 border-t-2 border-ink pb-6 pt-4 md:pr-5 ${
                    i > 0 ? 'md:border-l md:border-l-line-alt md:pl-5' : ''
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold tracking-[0.13em] text-accent">{step.num}</span>
                  <h3 className="text-[17px] font-semibold leading-[1.2] tracking-[-0.015em]">{step.title}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-grey-600">{step.when}</span>
                  <p className="text-[13.5px] leading-[1.5] text-ink-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- FAQ ---------------- */}
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-2 border-t border-ink pt-3.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-grey-600">
                Questions fréquentes
              </span>
              <h2 className="text-balance text-[27px] font-semibold leading-[1.15] tracking-[-0.015em]">
                Ce que les dirigeants nous demandent
              </h2>
            </div>

            <div className="grid gap-x-12 md:grid-cols-2">
              {FAQ.map((item) => (
                <div key={item.q} className="avoid-break flex flex-col gap-2 border-t border-line py-4">
                  <h3 className="text-base font-semibold leading-[1.3] tracking-[-0.01em]">{item.q}</h3>
                  <p className="max-w-[54ch] text-sm leading-[1.55] text-ink-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---------------- CTA ---------------- */}
        <section className="mt-24 border-t border-ink bg-ink text-on-dark">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-12 md:grid-cols-[1.3fr_1fr] md:gap-12 md:px-8 lg:px-12">
            <div>
              <h2 className="mb-3.5 max-w-[18ch] text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] md:text-[32px]">
                La première étape est gratuite et ne vous engage à rien.
              </h2>
              <p className="max-w-[48ch] text-[15.5px] leading-[1.5] text-on-dark-muted">
                Une séance d’audit, sur place ou à distance. Nous regardons votre fonctionnement réel et
                vous repartez avec la liste de ce qui vous coûte du temps — même si vous décidez de ne
                rien construire avec nous.
              </p>
            </div>
            <div className="flex flex-col font-mono text-xs tracking-[0.04em]">
              <a
                href={createWhatsAppHref(CONTACT_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between gap-4 border-b border-t border-line-dark py-2.5 text-on-dark hover:text-accent"
              >
                <span className="self-center text-[10.5px] uppercase tracking-[0.11em] text-on-dark-muted">
                  WhatsApp
                </span>
                <span>+212 659 592 823</span>
              </a>
              <a
                href="https://veloce-studio.netlify.app"
                className="flex justify-between gap-4 border-b border-line-dark py-2.5 text-on-dark hover:text-accent"
              >
                <span className="self-center text-[10.5px] uppercase tracking-[0.11em] text-on-dark-muted">Site</span>
                <span>veloce-studio.netlify.app</span>
              </a>
              <div className="flex justify-between gap-4 border-b border-line-dark py-2.5">
                <span className="self-center text-[10.5px] uppercase tracking-[0.11em] text-on-dark-muted">Zone</span>
                <span>Casablanca · Rabat · Salé</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-line-dark py-2.5">
                <span className="self-center text-[10.5px] uppercase tracking-[0.11em] text-on-dark-muted">
                  Votre contact
                </span>
                <span>&nbsp;</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-8 font-mono text-[10.5px] leading-[1.7] tracking-[0.04em] text-on-dark-muted md:px-8 lg:px-12">
            <span className="block">
              Tarifs en dirhams marocains, hors taxes. Paiement en trois fois&nbsp;: 40&nbsp;% au
              démarrage, 30&nbsp;% à la validation du blueprint, 30&nbsp;% à la livraison.
            </span>
            <span className="block">
              Les périmètres décrits couvrent la très grande majorité des cas. Le chiffre ferme est
              confirmé après l’audit gratuit. Grille valable pour l’exercice 2026.
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

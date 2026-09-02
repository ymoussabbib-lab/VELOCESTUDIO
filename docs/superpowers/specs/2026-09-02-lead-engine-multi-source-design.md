# Veloce Lead Engine — Multi-Source Design

Supersedes decision D2 of the Lead Engine internal brief. Nothing in this document is built.

## Decision record

- **Morocco is the first and only market.** This answers open question O3. France and Belgium are deferred: their open company registers are better data, but Google Maps saturation there leaves almost no map-absent segment, so the new offer has no market where the clean source exists.
- **Two offers run from one pipeline, tracked separately.** Map integration is sold as a standalone service to any contactable local business; the operating-software offer stays restricted to the four verticals. Each prospect is approved for one offer or the other, never both at once.
- **All available sources are used, not one.** Moroccan directories, delivery and booking platforms, social business pages, and OpenStreetMap. Restricting to a single source discards qualified prospects.
- **Google Places is a checker, never a source.** It is queried only to answer "does this business have a map profile". The verdict and its date are stored; the returned payload is discarded. This keeps the system clear of building a contact database from Google's data, which is what D2 originally ruled out.
- **A source may be usable for signal without being citable for contact.** Each adapter declares which it is, and the distinction is enforced in code rather than remembered.
- **Absence from the map is not a lead on its own.** A closed business is also absent. Map fit requires corroborating evidence that the business is trading.

## Why D2 no longer holds

D2 chose OpenStreetMap as the sole source and accepted a known weakness: because listings are written by volunteers, "this business has no website" often means only that nobody added one. Two things break that choice.

The coverage gap is larger than assumed — OSM does not contain the majority of the businesses in scope. And the new map-integration offer targets businesses that have no map profile at all, which no map-derived source can enumerate by definition. The pipeline has to start somewhere other than a map.

Multi-source also repairs D2's weakness rather than inheriting it. Absence of a booking system in one volunteer-maintained map is weak evidence. Absence across four independent sources is strong evidence. Widening the funnel is what makes the score mean something.

## Scope

Phase A only: finding, resolving, scoring and reviewing prospects, entirely offline. No outreach is sent, and no send function exists. Phase B — tracking links and the public notice page — is unchanged and still waits on the homepage redesign, per D5.

## Data model

**Sighting** — immutable, one per `(source, sourceId, fetchedAt)`. Carries the raw payload as fetched, the extracted fields, the source URL, and the terms note in force at fetch time. Sightings are evidence: never edited, never merged, never deleted while the business they support is live.

**Business** — the resolved entity. Every field is stored as `{ value, source, sightingId, firstSeen, lastSeen }`. Field-level provenance serves two purposes at once: it is the review screen's "where every piece of information came from", and it is the citation required at first contact. When three sources know a business, the system can still name which one supplied the number being used.

Also on the business: `mapPresence: { present, checkedAt }` and nothing else from Places; `verticalMatch` (one of the four, or none); `scores: { softwareFit, mapFit }`; and state — pool, queued, approved-for-offer, rejected, parked, contacted, replied, opted-out.

**ResolutionLink** — binds a sighting to a business, recording the method, the score, and whether a human or a rule decided. Every merge is reversible and stores its evidence.

**OptOut** — durable, survives deletion of the business it refers to, and is matched on normalised phone, email, and name-plus-locality so it can block re-entry from any source on a future import.

**ContactLog** — offer, channel, code, and send time, recorded by the human who sent it.

## Pipeline

Fetch, normalise, pre-filter for eligibility, resolve, check the map, score, queue, record.

Normalisation handles Moroccan reality specifically: phone numbers to E.164 `+212`, and business names across French, Arabic script, and Latin transliterations of Arabic. Name matching across those three forms is the part of this design least suited to a first guess, and the reason sources land one at a time.

The eligibility pre-filter sits deliberately before the map check, so a Places lookup is only ever spent on a business that could qualify for an offer. It is a cheap local test: is this a contactable, consumer-facing local business.

## Resolution

Conservative by construction. The failure this avoids — merging two businesses because they share a reception number or a `contact@` address, and then approaching one with the other's details — is the mistake the whole design exists to prevent.

- **Merge only on corroboration:** exact normalised phone *and* name similarity above threshold, or high name similarity *and* proximity within roughly 150 metres.
- **Never merge on** a shared contact alone, a shared email domain, or a shared address. Malls, complexes and franchise numbers make each of these actively dangerous.
- **Shared-contact guard:** any phone or email that attaches to more than a small number of distinct names is flagged shared and excluded as a merge key entirely.
- **Ambiguity does not merge.** Middle-band scores go to a short "same business?" queue for a human yes or no.

## Scoring

`softwareFit` requires a vertical match, then reads signals of manual operation: no booking link, no online ordering, no system in evidence, but a phone and current hours that prove the business is trading. It remains a suggestion for ranking, not a verdict.

`mapFit` requires the business to be contactable, absent from the map, consumer-facing, and demonstrably alive — a recent post, an active delivery listing, or a directory entry with current hours. Liveness is mandatory, because absence alone selects for closed businesses as readily as for under-served ones.

## Review

The reviewer sees both scores with their reasoning, the per-field provenance, and — where the business was assembled from several sightings — the merge evidence, with a split action. Overturning the matcher must be as easy as overturning the score.

The decision is approve-for-software, approve-for-map, reject, or park, plus notes. Approving produces a draft that cites the source of the specific contact detail it uses, drawn only from citable adapters.

## Compliance

**O3 is answered** — Morocco.

**O2 is already answered elsewhere.** The brief recorded a contradiction between two documents about whether the case studies are real client systems. The committed home-proof-system design of 2026-09-01 settles it: they are real, explorable demos and must never be described as deployed for a named client. Outreach copy follows that decision record. O2 should be struck from the open list.

**O4 needs a per-segment answer.** A speculative map-offer pool drawn from any local business cannot justify the retention period a four-vertical software pool can.

**O6 grows materially.** Registering "four verticals from a public map" with the CNDP is a different declaration from "any local Moroccan business, from four sources."

**O1 still blocks Phase B, and O1 with O2 still block all outreach.** This design widens what can be found. It changes nothing about what may be sent.

**A source terms register** is carried per adapter, recording what that source permits and whether it may be cited at first contact. Bulk extraction from directories and social platforms is a commercial risk decision, not a settled legal position, and the register is where that decision is written down rather than assumed.

## Phasing

**A1** — adapter interface, sightings store, normalisation, the first directory adapter, resolution, and the review queue. Entirely offline.

**A2** — OpenStreetMap, then delivery and booking platforms, then social pages as signal-only. The matcher is retuned as each source lands.

The Places check depends on an external API but not on the public website, so it belongs to Phase A.

## Build-time invariants

Each is a test that fails the build, extending the brief's existing check that no send function exists.

- No adapter may be used as a citation source unless its terms register marks it citable.
- An opt-out blocks re-entry from every adapter, not only the one that first supplied the record.
- No Google Places payload is ever persisted; only the verdict and its timestamp.
- No prospect data appears in the repository or in any published build output.

## Open questions

- Which directory is the first adapter, and whether its terms position survives review well enough to make it the citable source.
- The retention period for each segment (O4).
- The shared-contact threshold, and the name-similarity thresholds for merge and for the ambiguity band. All three want real Moroccan data before being fixed.

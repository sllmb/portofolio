# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring teams at companies looking for a junior web developer
(internship, work-study or first job). They arrive from a CV, LinkedIn or an application
link, usually on desktop, with limited time, and must judge quickly whether the candidate
has real front-end skill and taste.

## Product Purpose

Personal portfolio of Salamba Diène, a developer learning web development, based in Dakar.
Success means the visitor leaves impressed: the site itself is the main proof of craft
(animation, interaction, attention to detail), strong enough to make a recruiter remember
the name and want to follow up.

## Positioning

The portfolio is a demonstration, not a brochure: a space-voyage narrative ("Le Voyage
Observé") where every section is a stage of the trip (Décollage, Nébuleuse, Constellation,
Missions, Orbite, Atterrissage) and the craft of the experience is the argument.

## Operating Context

- One-page site, read top to bottom by scroll or via nav "warp" jumps.
- Bilingual FR/EN (`src/i18n/fr.json`, `src/i18n/en.json`); language auto-detected and remembered.
- Contact through a Web3Forms form (key still to be set) plus GitHub, LinkedIn and email links.
- Deployed as a static build (Netlify or Vercel per README).

## Capabilities and Constraints

- Stack: Vite + vanilla JavaScript (ES modules) + GSAP (ScrollTrigger, ScrollToPlugin) + Canvas 2D. No framework.
- All visible copy lives in the i18n dictionaries; any new text needs both FR and EN.
- Must work without JS (content stays visible) and honor `prefers-reduced-motion`.
- Projects are presented as "missions" with status, launch date, description, tags and links.
- Open: Web3Forms access key, real GitHub/LinkedIn URLs and demo links not yet filled in.

## Brand Commitments

- Name: Salamba Diène; logo initials `S·D`; tagline "Développeuse web en exploration · Dakar" / "Web developer in exploration · Dakar".
- Contact email: salambadiene@esp.sn. Footer coordinates: Dakar (14.7167° N, 17.4677° W).
- Voice: space-mission metaphor, calm and precise; console/mission-log vocabulary
  (missions, transmission, décollage, orbite), uppercase mono labels.
- Mission codenames come from stars/constellations (current placeholders: Orion, Lyra, Vega).

## Evidence on Hand

- The user has real projects with GitHub/demo links to replace the three placeholder missions;
  they will provide titles, descriptions and links. Until then the mission copy is template text.
- No testimonials, clients, employers, metrics or awards exist; do not invent any.
- Journey timeline (2024 spark → 2025 JavaScript → 2026 this portfolio → next: React) is the user's own content.

## Product Principles

1. The site is the proof: every interaction should demonstrate skill a recruiter can feel within seconds.
2. A recruiter's time is short; the name, role and best work must land fast, without the experience getting in the way.
3. Honesty over inflation: a learning developer, shown through real projects and a real trajectory.
4. Craft includes robustness: accessibility, reduced motion, no-JS fallback and performance are part of the impression.
5. Bilingual parity: FR and EN are equal first-class versions.

## Accessibility & Inclusion

Keyboard navigation, screen-reader labels (translated), visible focus and full
`prefers-reduced-motion` support are required; content must remain readable with animations off.

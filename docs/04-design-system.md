# 04: Design System and Architecture

Built with the `design-taste-frontend` and `ui-ux-pro-max` skills. Brand values come from the Get Digital Brand Book (navy and yellow from the logo) set on warm stone surfaces.

## Dials

| Dial | Value | What it means here |
|---|---|---|
| Design variance | 6 | Left aligned hero, asymmetric bento and partner layouts, no centred SaaS hero, no 3 equal columns. Everything falls back to one column under 768 px. |
| Motion intensity | 5 | Fade up reveals once on scroll, sliding pills (`layoutId`), tactile `scale(0.98)` presses, CSS keyframes for drawer and dialogs. Transform and opacity only. Reduced motion respected everywhere. |
| Visual density | 5 | 16 px body, 1.6 line height, 64 to 112 px section spacing, scannable cards. |

## Colour (semantic first, see `src/index.css`)

| Role | Light | Dark |
|---|---|---|
| background | stone 50 `#FCF8F4` (alabaster) | navy 950 `#0A0B18` |
| surface (cards) | white `#FFFFFF` | navy 900 `#171828` |
| surface-muted | stone 100 `#F6F2EC` | navy 800 `#282A3B` |
| border (hairline) | stone 200 `#EBE5DE` | navy 700 `#3C3E50` |
| foreground (ink) | navy 900 `#171828` (16.6:1 on background) | navy 50 `#F6F6FC` |
| muted text | navy 600 `#525467` (7.0:1) | navy 300 `#B1B3C4` |
| primary (CTA) | yellow 500 `#FAB30D` with navy text (9.6:1) | same |
| link | yellow 800 `#7B5600` (6.3:1) | yellow 400 `#FEBE46` |
| success / error / info | `#00823A` / `#C90F1A` / `#006EBE` | 400 shades |

One accent (Digital Yellow). No purple, no gradients on text, no glows. Shadows are tinted with the navy ink.

## Type

| Token | Font | Size (phone to desktop) |
|---|---|---|
| text-h1 | Unbounded 700 | 36 to 56 px |
| text-h2 | Unbounded 600 | 30 to 40 px |
| text-h3 | Unbounded 600 | 24 to 28 px |
| text-h4 | Manrope 700 | 20 to 22 px |
| text-body-lg / text-body | Manrope 400 | 18 / 16 px |
| text-small / text-label | Manrope 500 / 700 caps | 14 / 12 px |
| numbers, codes | JetBrains Mono | as context |

## Spacing, radius, touch

- Tailwind 4 px scale. Sections `py-16 sm:py-20 lg:py-28`. Container `container-gd`: max 80rem, side padding 16 to 40 px.
- Radius: inputs 10 px, cards 16 px, feature cards 28 px, buttons and chips full pill.
- Every control is at least 44 px tall. Breakpoints: xs 375, sm 640, md 768, lg 1024, xl 1280, 2xl 1536, 3xl 1920.

## Component tree

```
App
└── AppProviders (React Query, MotionConfig reducedMotion="user")
    └── SiteLayout
        ├── Skip link, ScrollManager (top or #hash)
        ├── SiteHeader (sticky glass, nav pill, Free AI Learning pill) → MobileNav (<dialog> slide over)
        ├── main → page
        │   ├── 1.home: Hero (+ AiLabWidget) · MissionBento · AiCohort (+ Modal → CourseRegistrationForm)
        │   │           · Partners (→ PartnerGrid) · FeaturedGuides (→ GuideCards) · ContactSection (→ ContactForm)
        │   ├── 2.about: PageHeader · PhotoFrame · MissionBento · Values
        │   ├── 3.partners: PageHeader · PartnerGrid
        │   ├── 4.press: PageHeader · releases
        │   ├── 5.blogs: blogs (filters + GridGuide) · post (/blogs/:slug)
        │   ├── 6.vote, 7.tickets: live data or empty state
        │   ├── 8.contact: PageHeader · ContactSection
        │   └── not-found
        └── SiteFooter
```

Shared pieces: `components/ui` (Button, Badge, Field, Modal, Skeleton, EmptyState, SectionHeading), `components/site` (Logo, PhotoFrame, HexPattern, PageHeader, MissionBento, PartnerGrid, GuideCards, ContactSection, ContactForm, CourseRegistrationForm, SocialIcon), `components/layout` (SiteHeader, MobileNav, SiteFooter, ScrollManager), `components/motion` (Reveal, Stagger, LogoLoader, LogoMark).

## Forms

Contact posts to `POST /api/v1/messages`; course sign up to `POST /api/v1/course-registrations`. In `npm run dev:dummy` both pretend to send. Validation on blur, the first invalid field takes focus on submit, loading, success and error states included.

## Photos

`PhotoFrame` shows a labelled placeholder until the file exists in `public/images/`. Names: `home-mission.webp`, `home-ai-course.webp`, `about-community.webp`, `blog/<slug>.webp`.

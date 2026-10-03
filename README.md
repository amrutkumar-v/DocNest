# DocNest

**Your documents, organized.**

DocNest is a personal document management app for keeping important documents
organized, accessible and easy to manage from one place.

This repository currently contains **Phase 1 — Foundation & UI**: the application
shell, branding, routing, responsive layout and polished empty states.

---

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation & UI | **Complete** |
| 2 | Authentication | Not started |
| 3 | Document Vault | Not started |
| 4 | Organization & Search | Not started |
| 5 | Expiry & Reminders | Not started |
| 6 | Security, Testing & Production | Not started |

### What Phase 1 deliberately does not contain

There is **no backend at all** in this phase. Specifically, there is no
authentication, no database, no Supabase project, no storage bucket, no document
records, no expiry calculation, no notification system and no OCR.

Every count shown in the UI is a static `0`. The search, category filter and sort
controls on the Documents page are rendered but permanently disabled, because
simulating them would misrepresent a vault that has no documents in it.

---

## Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **shadcn/ui conventions** — Radix primitives + CVA variants, vendored into `src/components/ui`
- **React Router 7** (declarative `BrowserRouter` routing)
- **Lucide React** icons
- **oxlint** for linting

## Getting started

```bash
npm install
npm run dev      # start the dev server
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run `tsc` without emitting |
| `npm run lint` | Run oxlint |

---

## Project structure

```text
src/
├── components/
│   ├── layout/        AppShell, Sidebar, MobileNav, MobileHeader, PageHeader, Brand, BrandMark
│   ├── ui/            button, card, dialog, input, select, label, switch, badge
│   ├── AddDocumentDialog.tsx        Placeholder "upload coming soon" dialog
│   ├── AddDocumentDialogProvider.tsx Owns the single dialog instance
│   ├── AddDocumentButton.tsx        Shared CTA that opens it
│   ├── EmptyState.tsx  StatCard.tsx  CategoryCard.tsx  SearchBar.tsx
│   └── SettingsSection.tsx  SettingsRow.tsx
├── pages/
│   ├── Dashboard.tsx  Documents.tsx  Categories.tsx  Settings.tsx  NotFound.tsx
├── hooks/
│   └── usePageTitle.ts
├── lib/
│   ├── constants.ts   App metadata, navigation, category defaults
│   ├── icons.ts       Central icon registry
│   ├── greeting.ts    Anonymous time-of-day greeting
│   └── utils.ts       `cn` helper and pluralisation
├── index.css          Design tokens (light + prepared dark) and base styles
├── App.tsx            Router definition
└── main.tsx
```

---

## Design system

All colours, radii and shadows are CSS custom properties in `src/index.css`,
exposed to Tailwind through `@theme inline`. Components only reference semantic
names such as `bg-surface`, `text-muted-foreground` or `bg-brand`.

Dark-theme tokens are already declared under `.dark`, so enabling dark mode later
is a matter of setting a class on `<html>` and unhiding the theme control in
Settings — no component changes required.

---

## Accessibility

- Semantic landmarks (`header`, `nav`, `aside`, `main`) and a skip-to-content link
- One visible navigation per breakpoint, with `aria-current="page"` on the active item
- All controls are real `button`, `input`, `select` and `label` elements
- The dialog is labelled and described, traps focus, and closes on `Escape`
- Body text meets WCAG AA contrast; verified against the rendered DOM
- `prefers-reduced-motion` disables the page and dialog animations

---

## Notes for later phases

Recorded rather than implemented, per the Phase 1 scope:

- **Phase 2** — Replace the disabled Settings controls with real auth. `AppShell`
  and routing are already auth-agnostic, so a protected route wrapper can be added
  around the shell's routes.
- **Phase 3** — `AddDocumentDialog` is the intended mount point for the upload
  flow. The `DOCUMENT_CATEGORIES` list is the seed for document records.
- **Phase 4** — The Documents toolbar controls are already laid out and labelled;
  they only need state and a data source. `DOCUMENT_SORT_OPTIONS` defines the
  initial sort list.
- **Phase 5** — The dashboard's "Expiring Soon" panel and the Notifications
  settings section are the designated surfaces.
- **Phase 6** — Dark mode, RLS, storage policies and hardening.
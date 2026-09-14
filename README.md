# Imalo Education

Marketing/informational website for Imalo, a German-language afterschool program in Sibiu, Romania. Presents the offering, schedule, gallery and a contact form, is served as a fully prerendered/SSR site, and deploys to Firebase Hosting.

## Tech Stack & Architecture

- **Framework:** Angular 21 — standalone components (no `NgModule`s), zoneless change detection (`provideZonelessChangeDetection`), `OnPush` everywhere.
- **UI & Styling:** Bootstrap CSS utilities + `bootstrap-icons`, with per-component CSS files. No Angular Material/PrimeNG/Tailwind.
- **State & Data:** Angular Signals only — no NgRx or other store. Cross-component state (e.g. current language) lives in small `providedIn: 'root'` services backed by a `signal`, exposed read-only and mutated through methods.
- **Rendering:** SSR + build-time prerendering (`@angular/ssr`, `provideServerRendering`) with client hydration + event replay (`provideClientHydration(withEventReplay())`). Express (`src/server.ts`) serves the SSR output when run as a Node server.
- **Data/Integrations:** Firebase (`@angular/fire`) for Hosting + Analytics only — no Firestore/Auth in use. EmailJS (`@emailjs/browser`) sends the contact form client-side with no backend API.
- **Tooling:** Angular CLI with the `@angular/build` (esbuild) application builder, Prettier, strict TypeScript (`strict`, `strictTemplates`, `noImplicitOverride`, etc). Unit tests run on Vitest via the `@angular/build:unit-test` builder (jsdom, no browser/Karma involved).

### Notable decisions

- **Routing** (`src/app/app.routes.ts`): every route lazy-loads a standalone component via `loadComponent`. `withViewTransitions()` and `withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })` are wired on the router; unmatched paths redirect to `/404`.
- **Templates** use the modern control-flow syntax (`@if`, `@for`) and the native `animate.enter` / `animate.leave` template bindings for transitions (see `gallery.component.html`) instead of the Angular animations package.
- **i18n is hand-rolled**, not `@angular/localize`: `LanguageService` holds a single boolean signal (`true` = Romanian), toggled from the navbar, and components branch copy inline with `@if (languageRO()) { ... } @if (!languageRO()) { ... }`.
- **SEO** (`SEOService`) is applied per-route from each component's `ngOnInit`: canonical link injection, meta description, and Open Graph/Twitter tags.
- Firebase config and the EmailJS service/template/public keys live in `src/environments/environment.ts` **unencrypted and committed** — this is intentional, since these are public client-side keys (Firebase web config and EmailJS public key are not secrets), not something you should add a `.env` mechanism for.

## Project Structure

```text
src/
├── app/
│   ├── app.ts / app.html / app.css   # Root component: navbar + <router-outlet> + footer + back-to-top
│   ├── app.config.ts                 # Browser providers: router, hydration, Firebase, zoneless CD
│   ├── app.config.server.ts          # Adds provideServerRendering() on top of app.config.ts
│   ├── app.routes.ts                 # Route table, one lazy-loaded standalone component per page
│   ├── components/                   # All feature + shared UI in one flat folder, one per route or reusable widget
│   │   ├── home/ about-us/ offers/ schedule/ gallery/ contact/ privacy/ page-not-found/
│   │   └── navbar/ footer/ hamburger-button/ back-to-top/   # cross-page chrome
│   ├── services/                     # Signal-backed singletons: language, SEO, gallery loading, email sending, scroll
│   └── interfaces/                   # Plain data shapes (ContactMeForm, GalleryImage)
├── environments/environment.ts       # Firebase + EmailJS public config (single file, no prod/dev split)
├── main.ts / main.server.ts          # Browser and server bootstrap entry points
├── server.ts                         # Express server for the SSR build (serve:ssr:Imalo_Education)
└── styles.css / bootstrap-essentials.css

public/assets/
├── images/{gallery,logo,social media,caterpillars}/
└── fonts/, galleryImages.json        # Static gallery image list, read by LoadGalleryService
```

There's no `core/` vs `feature/` vs `shared/` split — the app is small enough that every route component and the handful of shared services/interfaces live in one flat `components/`, `services/`, `interfaces/` tree.

## Getting Started

```bash
npm install
npm start          # ng serve, http://localhost:4201 (port set in angular.json)
```

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server (`ng serve`, development config, port 4201) |
| `npm run build` | Production build (prerendered + SSR bundle) to `dist/imalo-education` |
| `npm run watch` | Development build in watch mode |
| `npm run serve:ssr:Imalo_Education` | Run the built SSR/Express server from `dist/imalo-education/server/server.mjs` |
| `npm test` | Runs the Vitest suite (`ng test`) once, headless via jsdom |

There's no e2e setup — only unit tests. `ng generate component/service` defaults to scaffolding a Vitest `.spec.ts` alongside the new file (`testRunner: vitest` in `angular.json`).

## Testing

Unit tests run on **Vitest** through Angular's native `@angular/build:unit-test` builder (`angular.json` → `architect.test`), not Karma — there's no `karma.conf.js` or `src/test.ts`, and no browser is launched; specs execute in Node against jsdom.

```bash
npm test              # single run
npx ng test --watch   # watch mode
```

Coverage so far focuses on units with actual logic rather than boilerplate "should create" smoke tests:

- `language.service.spec.ts` — the shared signal toggles and is shared across injections (`providedIn: 'root'`).
- `seo.service.spec.ts` — canonical URL construction (root-path trailing slash, replacing a stale `<link>`) and Open Graph/meta tag updates.
- `send-email.service.spec.ts` — the EmailJS payload shape and the success/failure → status-code mapping, with `@emailjs/browser` mocked via `vi.mock`.
- `contact.component.spec.ts` — reactive form validators (email/phone/message) and the submit flow (blocked when invalid, success/failure messaging, form reset).
- `gallery.component.spec.ts` — lightbox navigation bounds (`navigateLeft`/`navigateRight` clamping) and keyboard handling, with `LoadGalleryService` stubbed.

None of these render the template via `fixture.detectChanges()` — they exercise the component classes directly (calling `ngOnInit()`/public methods on the instance from `TestBed.createComponent(...).componentInstance`). That's a deliberate choice for this app: it keeps tests fast and avoids fighting `NgOptimizedImage`'s runtime image-sizing checks under jsdom, at the cost of not verifying template bindings themselves.

## Configuration

All runtime config lives in `src/environments/environment.ts`:

- `firebaseConfig` — Firebase Web SDK config, used for `provideFirebaseApp` + Analytics.
- `emailJSConfig` — `serviceID` / `templateID` / `publicKey` for `@emailjs/browser`, consumed by `SendEmailService` and used to deliver the contact form.

There's a single environment file (no `environment.prod.ts`); the same public config is used for local dev and production builds.

## Deployment

Deploys to **Firebase Hosting** (`firebase.json` / `.firebaserc`, project `imalo-education`):

```bash
npm run build
firebase deploy
```

`firebase.json` serves `dist/imalo-education/browser`, rewrites everything except `/404` to `index.html`, and maps `errorPage` to `/404.html`. The `serve:ssr:*` script exists if you instead want to run the app as a Node/Express SSR server rather than the static prerendered output.

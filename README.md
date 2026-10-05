# Imalo Education Website

This is the public website for Imalo, a German-language afterschool program in Sibiu, Romania. It tells parents what the program offers, shows the schedule and a photo gallery, and lets them get in touch through a contact form. The whole site is available in Romanian and German, with each language on its own URLs so search engines can index both. Every page is prerendered at build time and served from Firebase Hosting, and Firebase Analytics loads only after the page has started. There's no backend: the contact form sends email from the browser through EmailJS, and the gallery is driven by a JSON file.

---

## Key Features

- **Two languages with their own URLs:** Romanian pages live at the root and German pages under `/de`. The navbar toggle switches language while keeping you on the same page, the `<html lang>` attribute follows the URL, and each page gets `hreflang` alternate links so search engines know the two versions belong together.
- **Program pages:** Home, about us, offers, schedule and gallery exist in both languages, and there's a Romanian-only privacy policy page. Each route is lazy-loaded, and page changes use the browser's View Transitions.
- **Photo gallery:** Images open in a lightbox that you can move through with the mouse or the keyboard (arrow keys, Escape to close). Image descriptions come in both languages from `galleryImages.json`, and the lightbox animates with Angular's built-in enter and leave bindings.
- **Contact form:** A validated form (email, phone, message) sends messages through EmailJS straight from the browser, and shows success or failure messages.
- **SEO:** Each page sets its own title, meta description, Open Graph/Twitter tags and canonical URL. Every route is prerendered at build time, so search engines get complete HTML.
- **Analytics:** Firebase Analytics is loaded in a separate chunk after the app starts, so it doesn't slow the first render.

---

## Tech Stack

- **Frontend:** Angular 22.2 (standalone components, signals, zoneless), TypeScript, per-component CSS, a vendored subset of Bootstrap's grid/utility CSS, Bootstrap Icons
- **Backend:** N/A. Build-time prerendering via `@angular/ssr` (`outputMode: "static"`), no server
- **Database / Storage:** N/A. Gallery data is a static JSON file in `public/assets/`
- **Tooling & Other:** Firebase JS SDK (Analytics), EmailJS, Vitest + jsdom, Prettier, Firebase Hosting

---

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js `^22.22.3`, `^24.15.0` or `>=26` with npm
- Firebase CLI (`npm install -g firebase-tools`), only if you want to deploy

---

## Local Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/FrunzaDan/imalo-education-website.git
cd imalo-education-website
```

### 2. Configuration

All runtime config is in `src/environments/environment.ts`: the Firebase web config (used for Analytics) and the EmailJS service ID, template ID and public key. These are public client-side keys, so there's no `.env` file and no separate production environment.

To change the gallery, edit `public/assets/galleryImages.json` (image path plus a Romanian and German description) and add the images under `public/assets/images/gallery/`.

### 3. Installation & Run

The scripts in the repo root do the usual steps for you:

```bash
./build.sh               # npm ci, format check, lint, build, unit tests (--skip-tests to skip them)
./run.sh                 # dev server, opened in your browser (runs npm ci first if node_modules is missing)
```

Or run the npm scripts yourself:

```bash
npm install
npm start          # dev server on http://localhost:4202
npm test           # Vitest unit tests
npm run build      # prerendered static build → dist/imalo-education/browser
```

`npm run build` also copies the prerendered `404/index.html` to `404.html`, which Firebase Hosting serves for unknown URLs.

---

## API / App Usage

| Romanian | German |
|---|---|
| `/` | `/de` |
| `/about-us` | `/de/about-us` |
| `/offers` | `/de/offers` |
| `/schedule` | `/de/schedule` |
| `/gallery` | `/de/gallery` |
| `/contact` | `/de/contact` |
| `/privacy` | (none; the toggle goes to `/de`) |

Unknown URLs redirect to `/404` (or `/de/404`).

To deploy (Firebase project `imalo-education`, set in `.firebaserc`):

```bash
npm run build
firebase deploy
```

---

## License & Notes

Built for Imalo; no license file. The photos, logo and texts belong to Imalo.

- Translations are written directly in the templates rather than with `@angular/localize`. The current language comes from the URL through a small signal-based `LanguageService`.

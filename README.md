# Imalo Education Website

The public website for Imalo, a German-language afterschool program in Sibiu, Romania. It presents the program, offers, schedule and photo gallery in Romanian and German, and has a contact form. Pages are prerendered and served from Firebase Hosting.

---

## 🚀 Key Features

- **Two languages with their own URLs:** Romanian pages at the root and German pages under `/de`, with a navbar toggle that keeps you on the same page. Each page gets `hreflang` alternate links so search engines index both versions.
- **Program pages:** Home, about us, offers, schedule and gallery, plus a Romanian-only privacy policy page.
- **Photo gallery:** A lightbox with mouse and keyboard navigation (arrow keys, Escape) and bilingual image descriptions loaded from `galleryImages.json`.
- **Contact form:** Validated form that sends messages client-side through EmailJS.
- **SEO:** Per-page titles, meta description, Open Graph/Twitter tags and canonical URLs. Every route is prerendered at build time.
- **Analytics:** Firebase Analytics, loaded in a separate chunk after the app starts.

---

## 🛠 Tech Stack

- **Frontend:** Angular 22.2 (standalone components, signals, zoneless), TypeScript, per-component CSS, a vendored subset of Bootstrap's grid/utility CSS, Bootstrap Icons
- **Backend:** N/A. Prerendering via `@angular/ssr`, with an Express server entry for running the SSR build
- **Database / Storage:** N/A. Gallery data is a static JSON file in `public/assets/`
- **Tooling & Other:** Firebase JS SDK (Analytics), EmailJS, Vitest + jsdom, Prettier, Firebase Hosting

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- Node.js `^22.22.3`, `^24.15.0` or `>=26` with npm
- Firebase CLI (`npm install -g firebase-tools`), only if you want to deploy

---

## ⚙️ Local Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/FrunzaDan/imalo-education-website.git
cd imalo-education-website
```

### 2. Configuration

All runtime config is in `src/environments/environment.ts`: the Firebase web config (used for Analytics) and the EmailJS service ID, template ID and public key. These are public client-side keys, so there's no `.env` file and no separate production environment.

To change the gallery, edit `public/assets/galleryImages.json` (image path plus a Romanian and German description) and add the images under `public/assets/images/gallery/`.

### 3. Installation & Run

```bash
npm install
npm start          # dev server on http://localhost:4202
npm test           # Vitest unit tests
npm run build      # production build + prerender → dist/imalo-education
npm run serve:ssr:Imalo_Education   # run the built SSR server
```

`npm run build` also copies the prerendered `404/index.html` to `404.html`, which Firebase Hosting serves for unknown URLs.

---

## 🔌 API / App Usage

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

## 📝 License & Notes

Built for Imalo; no license file. The photos, logo and texts belong to Imalo.

- Translations are written directly in the templates rather than with `@angular/localize`. The current language comes from the URL through a small signal-based `LanguageService`.

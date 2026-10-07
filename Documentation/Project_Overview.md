# Imalo Education Website — Project Overview

## What is it?

This is the public website of **Imalo**, a German-language afterschool program in Sibiu, Romania. It's aimed at parents: it explains what the program offers, shows the daily schedule and photos of the place, and lets parents get in touch.

The whole site is available in **Romanian and German**, and you can switch between the two on any page.

| Page | Romanian | German |
|---|---|---|
| Home | `/` | `/de` |
| About us | `/about-us` | `/de/about-us` |
| Offers | `/offers` | `/de/offers` |
| Schedule | `/schedule` | `/de/schedule` |
| Gallery | `/gallery` | `/de/gallery` |
| Contact | `/contact` | `/de/contact` |
| Privacy policy | `/privacy` | (Romanian only; the language toggle goes to `/de`) |

Live at [imalo-education.web.app](https://imalo-education.web.app).

## Why it exists

It's the program's public face on the internet: a place where parents can find out about Imalo in either language and get in touch easily. The internal admin tool for the program is a separate project, the **Imalo Education Webapp**.

---

## The big picture

```
┌──────────────────────────┐        ┌───────────────────────────────────────────────────┐
│  Firebase Hosting        │  ───►  │  Visitor's browser — the Angular app              │
│  serves a pre-built HTML │        │                                                   │
│  file for every page,    │        │   Language ◄── taken from the URL (/de or not)    │
│  in both languages       │        │   Gallery ◄── galleryImages.json                  │
└──────────────────────────┘        │   Contact form ──► EmailJS ──► Imalo's inbox      │
                                    │   Firebase Analytics (loaded after start-up)      │
                                    └───────────────────────────────────────────────────┘
```

There's no backend and no database. The page texts are in the templates, and the gallery is driven by one JSON file.

---

## The building blocks

| Component | What it does |
|---|---|
| `home`, `about-us`, `offers`, `schedule` | The program's content pages, each written in both languages. |
| `gallery` | A photo grid that opens each image in a lightbox. |
| `contact` | The validated contact form. |
| `privacy` | The privacy policy (Romanian). |
| `navbar`, `hamburger-button`, `footer`, `back-to-top`, `page-not-found` | Navigation (with the language toggle), the mobile menu, the footer, a back-to-top button and the 404 page. |

| Service | Job |
|---|---|
| `LanguageService` | Works out the current language from the URL and keeps the page's `<html lang>` attribute in sync. |
| `GalleryCatalogService` | Loads the gallery list from `galleryImages.json`. |
| `SendEmailService` | Sends the contact form through EmailJS. |
| `SeoService` | Sets each page's title, description, social-sharing tags, canonical address and language alternates. |
| `ScrollerService` | Smooth scrolling. |

---

## How things work

### Two languages, two sets of addresses

The language is decided **by the URL alone**: German pages start with `/de`, Romanian pages don't.

- The language toggle in the navbar swaps the prefix and keeps you on the same page (`/offers` ↔ `/de/offers`). A page with no German version (the privacy policy) sends you to the German home page instead.
- The page's `<html lang>` attribute follows the URL, so screen readers and browsers know which language they're reading.
- Each page tells search engines about its other-language twin (`hreflang` links), so Google shows Romanian searchers the Romanian page and German searchers the German one.

The translations are written directly in the templates, so each page shows the right text for the current language. There's no translation library involved.

### The gallery

Driven by `public/assets/galleryImages.json`, one entry per photo with a description in both languages:

```json
{
  "imagePath": "/assets/images/gallery/imalo_sibiu_1.webp",
  "description": {
    "ro": "Colț de lectură cu pernuțe, jucării de pluș și rafturi cu cărți, …",
    "de": "Leseecke mit Kissen, Plüschtieren und Bücherregalen, …"
  }
}
```

Clicking a photo opens it in a lightbox. You can move through the photos with the mouse or the arrow keys, and close it with Escape. The lightbox fades in and out with Angular's built-in animations.

### The contact form

The form checks the email, phone and message in the browser, then sends them through **EmailJS**, a service that delivers emails from a web page using a template, so no mail server is needed. The visitor sees a success or failure message.

### How the pages are built and served

Every route, in both languages, is **pre-rendered** at build time into its own HTML file. Visitors and search engines get complete pages immediately. Moving between pages uses the browser's View Transitions for a smooth cross-fade, and each page's code is loaded only when it's first needed.

---

## Packages and tools, and why they're used

| Package / tool | Why |
|---|---|
| `@angular/*` (core, router, forms, common) | The framework, routing (with view transitions) and the contact form. |
| `@angular/ssr`, `@angular/platform-server` | Pre-rendering every page to static HTML at build time. |
| `@emailjs/browser` | Sends the contact form by email, straight from the browser. |
| `firebase` | Firebase Analytics only, loaded in a separate chunk after the page has started, and never during pre-rendering. |
| `bootstrap-icons` | Icons; only the ones used are bundled, as a small subset font. |
| `rxjs` | Reacting to navigation (for the language) and loading the gallery file. |
| `vitest`, `jsdom` | Unit tests. |
| `eslint`, `angular-eslint`, `prettier` | Code style and formatting. |
| **Firebase Hosting** | Serves the site. |

The styling is per-component CSS plus a small hand-picked subset of Bootstrap's grid and utility classes (`src/bootstrap-essentials.css`).

---

## Setting it up (for future me)

### What you need

- Node.js 22, 24 or 26 with npm
- Firebase CLI (`npm install -g firebase-tools`), only for deploying

### Run it

```bash
./run.sh               # dev server on http://localhost:4202, opens the browser
```

### Build and check

```bash
./build.sh             # npm ci, format check, lint, build, tests (--skip-tests to skip tests)
```

### Deploy

```bash
npm run build          # output: dist/imalo-education/browser
firebase deploy        # Firebase project "imalo-education" (.firebaserc)
```

`npm run build` also copies the pre-built `404/index.html` to `404.html`, which Firebase serves for unknown addresses.

### Where to change things

| To change… | Look in… |
|---|---|
| Page texts (both languages) | The component templates in `src/app/components/` |
| Gallery photos and captions | `public/assets/galleryImages.json` and `public/assets/images/gallery/` |
| Firebase and EmailJS keys | `src/environments/environment.ts` (public client-side keys, so no `.env` file) |
| Which pages have no German version | `GERMAN_FALLBACKS` in `src/app/services/language.service.ts` |
| Sitemap / robots | `src/sitemap.xml`, `src/robots.txt` |

---

## Decisions and why I made them

- **The language lives in the URL.** Each language gets its own addresses, so both versions can be found in search engines, shared as links and bookmarked. There's no hidden setting or cookie that decides what you see.
- **Translations in the templates.** The site is small and has only two languages, so writing both texts side by side in each template is simpler than a translation setup with separate builds.
- **Fully pre-rendered.** Parents searching for an afterschool program find complete pages in both languages, and the site loads instantly.
- **No backend.** The contact form goes through EmailJS, and hosting only serves files, so there's nothing to run or maintain.
- **The gallery in a JSON file.** Adding a photo means adding an image and one entry, with no code change.
- **Analytics loaded late**, so it never slows down the first view.

---

## Interesting bits

- **Photo captions double as image descriptions** in the lightbox, so screen readers announce what each photo shows, in the current language.
- **The privacy page is Romanian only**, and the language toggle handles that gracefully by going to the German home page.
- **Smooth page changes** with the browser's View Transitions API.
- **Social previews and search snippets** are set per page and per language.

## Glossary

| Term | Meaning |
|---|---|
| Pre-rendering | Building each page's HTML ahead of time instead of in the visitor's browser. |
| `hreflang` | A tag telling search engines that two pages are the same content in different languages. |
| Lightbox | An overlay that shows an image full size on top of the page. |
| EmailJS | A service that sends emails from a web page using a template, without a mail server. |
| View Transitions | A browser feature that animates smoothly between two pages. |

The photos, logo and texts belong to Imalo.

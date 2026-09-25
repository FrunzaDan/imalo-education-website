import { Routes } from '@angular/router';

interface PageTitles {
  readonly home: string;
  readonly aboutUs: string;
  readonly offers: string;
  readonly schedule: string;
  readonly gallery: string;
  readonly contact: string;
}

const ROMANIAN_TITLES: PageTitles = {
  home: 'Bine ați venit la Imalo - Afterschool Germana Sibiu',
  aboutUs: 'Despre Noi - Imalo Afterschool Germana Sibiu',
  offers: 'Oferte - Imalo Afterschool Germana Sibiu',
  schedule: 'Program - Imalo Afterschool Germana Sibiu',
  gallery: 'Galerie - Imalo Afterschool Germana Sibiu',
  contact: 'Contact - Imalo Afterschool Germana Sibiu',
};

const GERMAN_TITLES: PageTitles = {
  home: 'Willkommen bei Imalo - Deutsches Afterschool in Sibiu',
  aboutUs: 'Über uns - Imalo Deutsches Afterschool Sibiu',
  offers: 'Angebote - Imalo Deutsches Afterschool Sibiu',
  schedule: 'Programm - Imalo Deutsches Afterschool Sibiu',
  gallery: 'Galerie - Imalo Deutsches Afterschool Sibiu',
  contact: 'Kontakt - Imalo Deutsches Afterschool Sibiu',
};

/** The pages that exist in both languages; the German ones live under `/de`. */
function translatedPages(titles: PageTitles): Routes {
  return [
    {
      path: '',
      pathMatch: 'full',
      loadComponent: () =>
        import('./components/home/home.component').then((m) => m.HomeComponent),
      title: titles.home,
    },
    {
      path: 'about-us',
      loadComponent: () =>
        import('./components/about-us/about-us.component').then(
          (m) => m.AboutUsComponent,
        ),
      title: titles.aboutUs,
    },
    {
      path: 'offers',
      loadComponent: () =>
        import('./components/offers/offers.component').then(
          (m) => m.OffersComponent,
        ),
      title: titles.offers,
    },
    {
      path: 'schedule',
      loadComponent: () =>
        import('./components/schedule/schedule.component').then(
          (m) => m.ScheduleComponent,
        ),
      title: titles.schedule,
    },
    {
      path: 'gallery',
      loadComponent: () =>
        import('./components/gallery/gallery.component').then(
          (m) => m.GalleryComponent,
        ),
      title: titles.gallery,
    },
    {
      path: 'contact',
      loadComponent: () =>
        import('./components/contact/contact.component').then(
          (m) => m.ContactComponent,
        ),
      title: titles.contact,
    },
    {
      path: '404',
      loadComponent: () =>
        import('./components/page-not-found/page-not-found.component').then(
          (m) => m.PageNotFoundComponent,
        ),
      title: '404',
    },
  ];
}

export const routes: Routes = [
  {
    path: 'de',
    children: [
      ...translatedPages(GERMAN_TITLES),
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
  ...translatedPages(ROMANIAN_TITLES),
  {
    path: 'privacy',
    loadComponent: () =>
      import('./components/privacy/privacy.component').then(
        (m) => m.PrivacyComponent,
      ),
    title: 'Politica confidentialitate',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

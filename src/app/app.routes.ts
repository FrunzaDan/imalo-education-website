import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Bine ați venit la Imalo - Afterschool Germana Sibiu',
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./components/about-us/about-us.component').then(
        (m) => m.AboutUsComponent,
      ),
    title: 'Despre Noi - Imalo Afterschool Germana Sibiu',
  },
  {
    path: 'offers',
    loadComponent: () =>
      import('./components/offers/offers.component').then(
        (m) => m.OffersComponent,
      ),
    title: 'Oferte - Imalo Afterschool Germana Sibiu',
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./components/schedule/schedule.component').then(
        (m) => m.ScheduleComponent,
      ),
    title: 'Program - Imalo Afterschool Germana Sibiu',
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./components/gallery/gallery.component').then(
        (m) => m.GalleryComponent,
      ),
    title: 'Galerie - Imalo Afterschool Germana Sibiu',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
    title: 'Contact - Imalo Afterschool Germana Sibiu',
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./components/privacy/privacy.component').then(
        (m) => m.PrivacyComponent,
      ),
    title: 'Politica confidentialitate',
  },
  {
    path: '404',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
    title: '404',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
    title: '404',
  },
];

import { Component, effect, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent {
  private readonly seoService = inject(SeoService);

  readonly languageRO = inject(LanguageService).language;

  constructor() {
    effect(() => {
      const isRomanian = this.languageRO();
      this.seoService.updateMetaTags({
        description: isRomanian
          ? 'Pagina cu programul Imalo Education, afterschool pe limba germana din Sibiu.'
          : 'Programmseite von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
        path: '/schedule',
        locale: isRomanian ? 'ro_RO' : 'de_DE',
      });
    });
  }
}

import { Component, effect, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about-us',
  imports: [NgOptimizedImage],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  private readonly seoService = inject(SeoService);

  readonly languageRO = inject(LanguageService).language;

  constructor() {
    effect(() => {
      const isRomanian = this.languageRO();
      this.seoService.updateMetaTags({
        description: isRomanian
          ? 'Imalo Education este un centru educativ în limba germana dedicat elevilor din clasele primare - de la clasa pregătitoare până la clasa a IV-a. Imalo Education oferă copilului tău un mediu sigur și relaxant în care să învețe, să se dezvolte și să se exprime liber. Activitățile se desfășoară exclusiv în limba germană, pentru a-i îmbogăți vocabularul și exprimarea.'
          : 'Imalo Education ist ein deutschsprachiges Bildungszentrum für Grundschüler - von der Vorschule bis zur vierten Klasse. Imalo Education bietet Ihrem Kind eine sichere und entspannende Umgebung, in der es lernen, sich entwickeln und frei ausdrücken kann. Die Aktivitäten werden ausschließlich in deutscher Sprache durchgeführt, um den Wortschatz und die Ausdrucksfähigkeit zu erweitern.',
        path: '/about-us',
        locale: isRomanian ? 'ro_RO' : 'de_DE',
      });
    });
  }
}

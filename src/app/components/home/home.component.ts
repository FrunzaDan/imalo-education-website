import { Component, effect, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly seoService = inject(SeoService);

  readonly languageRO = inject(LanguageService).language;

  constructor() {
    effect(() => {
      const isRomanian = this.languageRO();
      this.seoService.updateMetaTags({
        description: isRomanian
          ? 'Imalo Education este un program tip afterschool pe limba germana din Sibiu unde copilul Dvs. va fi întâmpinat cu toată căldura și atenția noastră.'
          : 'Imalo Education ist ein deutschsprachiges Afterschool-Programm in Sibiu, in dem Ihr Kind mit all unserer Herzlichkeit und Aufmerksamkeit empfangen wird.',
        path: '/',
        locale: isRomanian ? 'ro_RO' : 'de_DE',
      });
    });
  }
}

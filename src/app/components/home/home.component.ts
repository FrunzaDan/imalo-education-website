import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  effect,
  inject,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private languageService = inject(LanguageService);
  private seoService = inject(SEOService);

  languageRO: Signal<boolean>;
  constructor() {
    this.languageRO = this.languageService.language;

    effect(() => {
      this.seoService.updateForLanguage(
        this.languageRO(),
        'Imalo Education este un program tip afterschool pe limba germana din Sibiu unde copilul Dvs. va fi întâmpinat cu toată căldura și atenția noastră.',
        'Imalo Education ist ein deutschsprachiges Afterschool-Programm in Sibiu, in dem Ihr Kind mit all unserer Herzlichkeit und Aufmerksamkeit empfangen wird.',
      );
    });
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }
}

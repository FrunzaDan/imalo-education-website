
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {
  private languageService = inject(LanguageService);
  private seoService = inject(SEOService);

  languageRO: Signal<boolean>;

  constructor() {
    this.languageRO = this.languageService.language;
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
    const description =
      'Pagina cu programul Imalo Education, afterschool pe limba germana din Sibiu.';
    this.seoService.updateMetaDescription(description);
    this.seoService.updateOpenGraphTags(description);
  }
}

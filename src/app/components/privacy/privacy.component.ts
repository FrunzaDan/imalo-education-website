import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css',
})
export class PrivacyComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      description:
        'Pagina termenilor Imalo Education, afterschool pe limba germana din Sibiu.',
      path: '/privacy',
      hasGermanVersion: false,
    });
  }
}

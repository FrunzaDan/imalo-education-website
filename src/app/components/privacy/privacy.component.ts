import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent implements OnInit {
  private seoService = inject(SEOService);

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
    const description =
      'Pagina termenilor Imalo Education, afterschool pe limba germana din Sibiu.';
    this.seoService.updateMetaDescription(description);
    this.seoService.updateOpenGraphTags(description);
  }
}

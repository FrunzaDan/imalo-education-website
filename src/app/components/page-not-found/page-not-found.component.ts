import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent implements OnInit {
  private seoService = inject(SEOService);

  ngOnInit(): void {
    this.seoService.updateRobots('noindex, follow');
  }
}

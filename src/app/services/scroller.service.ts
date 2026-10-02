import { ViewportScroller } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollerService {
  private readonly viewportScroller = inject(ViewportScroller);

  scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}

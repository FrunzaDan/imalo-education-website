import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly languageRO = inject(LanguageService).language;
}

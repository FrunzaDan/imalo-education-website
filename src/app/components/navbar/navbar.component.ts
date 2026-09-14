import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { HamburgerButtonComponent } from '../hamburger-button/hamburger-button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    HamburgerButtonComponent,
    NgOptimizedImage,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private languageService = inject(LanguageService);

  toggleLanguageForm: FormGroup;
  isMenuOpen = signal(false);
  languageRO: Signal<boolean>;

  constructor() {
    this.languageRO = this.languageService.language;

    this.toggleLanguageForm = new FormGroup({
      isGermanLang: new FormControl(!this.languageRO()),
    });

    effect(() => {
      const isRomanian = this.languageRO();
      const isGerman = !isRomanian;
      if (this.toggleLanguageForm.get('isGermanLang')?.value !== isGerman) {
        this.toggleLanguageForm.get('isGermanLang')?.setValue(isGerman, {
          emitEvent: false,
        });
      }
    });

    this.toggleLanguageForm
      .get('isGermanLang')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((val) => {
        if (val !== !this.languageRO()) {
          this.languageService.toggleLanguage();
        }
      });
  }

  onToggleMenu(isOpen: boolean) {
    this.isMenuOpen.set(isOpen);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}

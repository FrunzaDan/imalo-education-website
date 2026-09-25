import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { HamburgerButtonComponent } from '../hamburger-button/hamburger-button.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, HamburgerButtonComponent, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly languageService = inject(LanguageService);

  readonly languageRO = this.languageService.language;
  readonly localize = (romanianPath: string) =>
    this.languageService.localize(romanianPath);
  readonly isMenuOpen = signal(false);

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  onToggleMenu(isOpen: boolean): void {
    this.isMenuOpen.set(isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}

import {
  Component,
  DOCUMENT,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { ContactMeForm } from '../../interfaces/contact-me-form';
import { LanguageService } from '../../services/language.service';
import { SendEmailService } from '../../services/send-email.service';
import { SeoService } from '../../services/seo.service';
import { trapTabKey } from '../../shared/focus-trap';
import { contactFormSchema, emptyContactForm } from './contact-form';

@Component({
  selector: 'app-contact',
  imports: [FormField, FormRoot],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly sendEmailService = inject(SendEmailService);
  private readonly seoService = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private focusBeforeModal: HTMLElement | null = null;

  private readonly emailModal =
    viewChild<ElementRef<HTMLElement>>('emailModal');

  readonly languageRO = inject(LanguageService).language;
  readonly isEmailModalOpen = signal(false);
  readonly emailPopUpHeader = signal('');
  readonly emailPopUpParagraph = signal('');

  readonly model = signal<ContactMeForm>(emptyContactForm());
  readonly contactForm = form(this.model, contactFormSchema, {
    submission: {
      action: () => this.send(),
      onInvalid: (field) =>
        field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  });

  constructor() {
    effect(() => {
      const isRomanian = this.languageRO();
      this.seoService.updateMetaTags({
        description: isRomanian
          ? 'Pagina de contact Imalo Education, afterschool pe limba germana din Sibiu.'
          : 'Kontaktseite von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
        path: '/contact',
        locale: isRomanian ? 'ro_RO' : 'de_DE',
      });
    });
  }

  private async send(): Promise<void> {
    this.openEmailModal();
    this.emailPopUpHeader.set('Bună, ' + this.model().name);
    this.emailPopUpParagraph.set('Se trimite...');

    try {
      await this.sendEmailService.sendEmailJS(this.model());
      this.emailPopUpParagraph.set('Mesajul tău a fost trimis cu succes!');
      this.contactForm().reset(emptyContactForm());
    } catch (error: unknown) {
      console.error('Error sending the contact message:', error);
      this.emailPopUpParagraph.set(
        'Serverele noastre sunt pline, te rog să trimiți un E-mail către imaloeducation@gmail.com.',
      );
    }
  }

  /** Opens the popup and moves keyboard focus into it, remembering where it came from. */
  private openEmailModal(): void {
    const active = this.document.activeElement;
    this.focusBeforeModal = active instanceof HTMLElement ? active : null;
    this.isEmailModalOpen.set(true);
    afterNextRender(
      () => this.emailModal()?.nativeElement.focus({ preventScroll: true }),
      { injector: this.injector },
    );
  }

  closeEmailModal(): void {
    this.isEmailModalOpen.set(false);
    this.focusBeforeModal?.focus({ preventScroll: true });
    this.focusBeforeModal = null;
  }

  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeEmailModal();
      return;
    }
    const modal = this.emailModal()?.nativeElement;
    if (event.key === 'Tab' && modal) {
      trapTabKey(event, modal);
    }
  }
}

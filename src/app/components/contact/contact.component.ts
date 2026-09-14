import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactMeForm } from '../../interfaces/contact-me-form';
import { LanguageService } from '../../services/language.service';
import { SendEmailService } from '../../services/send-email.service';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private sendEmailService = inject(SendEmailService);
  private languageService = inject(LanguageService);
  private seoService = inject(SEOService);

  emailPopUpHeader!: string;
  emailPopUpParagraph!: string;
  submitted: boolean = false;
  isEmailModalOpen = signal(false);
  languageRO: Signal<boolean>;

  constructor() {
    this.languageRO = this.languageService.language;
  }

  contactMeForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ],
      nonNullable: true,
    }),
    phone: new FormControl('', {
      validators: [Validators.required, Validators.pattern('^[0-9]{9,12}$')],
      nonNullable: true,
    }),
    message: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(1000),
      ],
      nonNullable: true,
    }),
  });

  get name() {
    return this.contactMeForm.get('name');
  }

  get email() {
    return this.contactMeForm.get('email');
  }

  get phone() {
    return this.contactMeForm.get('phone');
  }

  get message() {
    return this.contactMeForm.get('message');
  }

  get isNameInvalid(): boolean {
    return !!(this.submitted && this.name?.errors);
  }

  get isEmailInvalid(): boolean {
    return !!(this.submitted && this.email?.errors);
  }

  get isPhoneInvalid(): boolean {
    return !!(this.submitted && this.phone?.errors);
  }

  get isMessageInvalid(): boolean {
    return !!(this.submitted && this.message?.errors);
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
    const description =
      'Pagina de contact Imalo Education, afterschool pe limba germana din Sibiu.';
    this.seoService.updateMetaDescription(description);
    this.seoService.updateOpenGraphTags(description);
  }

  async onSubmit() {
    this.submitted = true;

    if (this.contactMeForm.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.contactMeForm.controls).forEach((key) => {
        const control = this.contactMeForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isEmailModalOpen.set(true);
    this.emailPopUpHeader = 'Bună, ' + this.contactMeForm.value.name;
    this.emailPopUpParagraph = 'Se trimite...';

    try {
      const responseCode = await this.sendEmailService.sendEmailJS(
        this.contactMeForm.value as ContactMeForm,
      );

      if (responseCode === 200) {
        this.handleSuccessfulSubmission();
      } else {
        this.handleFailedSubmission(responseCode);
      }
    } catch (error) {
      this.handleFailedSubmission(500);
      console.error('Error sending email:', error);
    }
    this.resetForm();
  }

  private handleSuccessfulSubmission(): void {
    this.emailPopUpParagraph = 'Mesajul tău a fost trimis cu succes! ';
  }

  private handleFailedSubmission(responseCode: number): void {
    this.emailPopUpParagraph = `(${responseCode}) Serverele noastre sunt pline, te rog să trimiți un E-mail către imaloeducation@gmail.com. `;
  }

  private resetForm(): void {
    this.submitted = false;
    this.contactMeForm.reset();
    Object.keys(this.contactMeForm.controls).forEach((key) => {
      const control = this.contactMeForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
      control?.updateValueAndValidity();
    });
  }

  closeEmailModal(): void {
    this.isEmailModalOpen.set(false);
  }
}

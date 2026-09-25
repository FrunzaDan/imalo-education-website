import {
  email,
  maxLength,
  minLength,
  pattern,
  required,
  schema,
} from '@angular/forms/signals';
import { ContactMeForm } from '../../interfaces/contact-me-form';
import { NOT_BLANK, PHONE_PATTERN } from '../../shared/form-patterns';

export const MESSAGE_MIN_LENGTH = 2;
export const MESSAGE_MAX_LENGTH = 1000;

export const emptyContactForm = (): ContactMeForm => ({
  name: '',
  email: '',
  phone: '',
  message: '',
});

/** The contact page's texts in one language. */
export interface ContactTexts {
  readonly nameRequired: string;
  readonly emailRequired: string;
  readonly emailInvalid: string;
  readonly phoneRequired: string;
  readonly phoneInvalid: string;
  readonly messageRequired: string;
  readonly messageTooShort: string;
  readonly messageTooLong: string;
  readonly greeting: string;
  readonly sending: string;
  readonly sent: string;
  readonly sendFailed: string;
}

export const ROMANIAN_CONTACT_TEXTS: ContactTexts = {
  nameRequired: 'Numele este necesar.',
  emailRequired: 'E-mail-ul este necesar.',
  emailInvalid: 'Un E-mail valid este necesar.',
  phoneRequired: 'Numărul de telefon este necesar.',
  phoneInvalid: 'Un număr de telefon mobil valid este necesar.',
  messageRequired: 'Un mesaj este necesar.',
  messageTooShort: `Mesajul trebuie să aibă cel puțin ${MESSAGE_MIN_LENGTH} caractere.`,
  messageTooLong: `Mesajul poate avea cel mult ${MESSAGE_MAX_LENGTH} de caractere.`,
  greeting: 'Bună, ',
  sending: 'Se trimite...',
  sent: 'Mesajul tău a fost trimis cu succes!',
  sendFailed:
    'Serverele noastre sunt pline, te rog să trimiți un E-mail către imaloeducation@gmail.com.',
};

export const GERMAN_CONTACT_TEXTS: ContactTexts = {
  nameRequired: 'Der Name ist erforderlich.',
  emailRequired: 'Die E-Mail-Adresse ist erforderlich.',
  emailInvalid: 'Eine gültige E-Mail-Adresse ist erforderlich.',
  phoneRequired: 'Die Telefonnummer ist erforderlich.',
  phoneInvalid: 'Eine gültige Handynummer ist erforderlich.',
  messageRequired: 'Eine Nachricht ist erforderlich.',
  messageTooShort: `Die Nachricht muss mindestens ${MESSAGE_MIN_LENGTH} Zeichen lang sein.`,
  messageTooLong: `Die Nachricht darf höchstens ${MESSAGE_MAX_LENGTH} Zeichen lang sein.`,
  greeting: 'Hallo, ',
  sending: 'Wird gesendet...',
  sent: 'Ihre Nachricht wurde erfolgreich gesendet!',
  sendFailed:
    'Unsere Server sind überlastet, bitte schreiben Sie eine E-Mail an imaloeducation@gmail.com.',
};

export const contactFormSchema = (texts: ContactTexts) =>
  schema<ContactMeForm>((p) => {
    required(p.name, { message: texts.nameRequired });
    pattern(p.name, NOT_BLANK, { message: texts.nameRequired });

    required(p.email, { message: texts.emailRequired });
    email(p.email, { message: texts.emailInvalid });

    required(p.phone, { message: texts.phoneRequired });
    pattern(p.phone, PHONE_PATTERN, { message: texts.phoneInvalid });

    required(p.message, { message: texts.messageRequired });
    pattern(p.message, NOT_BLANK, { message: texts.messageRequired });
    minLength(p.message, MESSAGE_MIN_LENGTH, {
      message: texts.messageTooShort,
    });
    maxLength(p.message, MESSAGE_MAX_LENGTH, {
      message: texts.messageTooLong,
    });
  });

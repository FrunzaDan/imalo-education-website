import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactMeForm } from '../../interfaces/contact-me-form';
import { SendEmailService } from '../../services/send-email.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let sendEmailService: { sendEmailJS: ReturnType<typeof vi.fn> };

  const validForm: ContactMeForm = {
    name: 'Ana',
    email: 'ana@example.com',
    phone: '0712345678',
    message: 'Bună ziua, aș vrea mai multe detalii.',
  };

  const submitForm = async (): Promise<void> => {
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    sendEmailService = { sendEmailJS: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: SendEmailService, useValue: sendEmailService }],
    });

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('starts invalid because every field is required', () => {
    expect(component.contactForm().invalid()).toBe(true);
    expect(component.contactForm.name().errors()[0].message).toBe(
      'Numele este necesar.',
    );
  });

  it('rejects a phone number outside the 9-12 digit range', () => {
    component.model.set({ ...validForm, phone: '123' });
    expect(component.contactForm.phone().invalid()).toBe(true);

    component.model.set(validForm);
    expect(component.contactForm.phone().valid()).toBe(true);
  });

  it('rejects a malformed email address', () => {
    component.model.set({ ...validForm, email: 'not-an-email' });
    expect(component.contactForm.email().invalid()).toBe(true);

    component.model.set(validForm);
    expect(component.contactForm.email().valid()).toBe(true);
  });

  it('enforces the message length bounds', () => {
    component.model.set({ ...validForm, message: 'a' });
    expect(component.contactForm.message().invalid()).toBe(true);

    component.model.set({ ...validForm, message: 'a'.repeat(1001) });
    expect(component.contactForm.message().invalid()).toBe(true);

    component.model.set(validForm);
    expect(component.contactForm.message().valid()).toBe(true);
  });

  it('blocks submission and flags the invalid fields without calling EmailJS', async () => {
    await submitForm();

    expect(sendEmailService.sendEmailJS).not.toHaveBeenCalled();
    expect(component.contactForm.name().touched()).toBe(true);
    expect(component.isEmailModalOpen()).toBe(false);
  });

  it('sends the email, opens the modal, and resets the form on success', async () => {
    sendEmailService.sendEmailJS.mockResolvedValue(undefined);
    component.model.set(validForm);

    await submitForm();

    expect(sendEmailService.sendEmailJS).toHaveBeenCalledWith(validForm);
    expect(component.isEmailModalOpen()).toBe(true);
    expect(component.emailPopUpParagraph()).toContain('succes');
    expect(component.model().name).toBe('');
  });

  it('keeps the modal open with an error message when EmailJS fails', async () => {
    sendEmailService.sendEmailJS.mockRejectedValue(new Error('network error'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    component.model.set(validForm);

    await submitForm();

    expect(component.isEmailModalOpen()).toBe(true);
    expect(component.emailPopUpParagraph()).toContain(
      'imaloeducation@gmail.com',
    );
    expect(component.model()).toEqual(validForm);
  });

  it('closes the email modal', () => {
    component.isEmailModalOpen.set(true);

    component.closeEmailModal();

    expect(component.isEmailModalOpen()).toBe(false);
  });
});

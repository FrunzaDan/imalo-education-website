import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendEmailService } from '../../services/send-email.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let sendEmailService: { sendEmailJS: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    sendEmailService = { sendEmailJS: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: SendEmailService, useValue: sendEmailService }],
    });

    component = TestBed.createComponent(ContactComponent).componentInstance;
  });

  it('starts invalid because every field is required', () => {
    expect(component.contactMeForm.valid).toBe(false);
  });

  it('rejects a phone number outside the 9-12 digit range', () => {
    component.phone?.setValue('123');
    expect(component.phone?.valid).toBe(false);

    component.phone?.setValue('0712345678');
    expect(component.phone?.valid).toBe(true);
  });

  it('rejects a malformed email address', () => {
    component.email?.setValue('not-an-email');
    expect(component.email?.valid).toBe(false);

    component.email?.setValue('ana@example.com');
    expect(component.email?.valid).toBe(true);
  });

  it('enforces the message length bounds', () => {
    component.message?.setValue('a');
    expect(component.message?.valid).toBe(false);

    component.message?.setValue('a'.repeat(1001));
    expect(component.message?.valid).toBe(false);

    component.message?.setValue('Bună ziua!');
    expect(component.message?.valid).toBe(true);
  });

  it('blocks submission and flags the invalid fields without calling EmailJS', async () => {
    await component.onSubmit();

    expect(sendEmailService.sendEmailJS).not.toHaveBeenCalled();
    expect(component.name?.touched).toBe(true);
    expect(component.isEmailModalOpen()).toBe(false);
  });

  it('sends the email, opens the modal, and resets the form on success', async () => {
    sendEmailService.sendEmailJS.mockResolvedValue(200);
    component.contactMeForm.setValue({
      name: 'Ana',
      email: 'ana@example.com',
      phone: '0712345678',
      message: 'Bună ziua, aș vrea mai multe detalii.',
    });

    await component.onSubmit();

    expect(sendEmailService.sendEmailJS).toHaveBeenCalledTimes(1);
    expect(component.isEmailModalOpen()).toBe(true);
    expect(component.emailPopUpParagraph()).toContain('succes');
    expect(component.contactMeForm.value.name).toBeFalsy();
  });

  it('keeps the modal open with an error message when EmailJS reports a failure', async () => {
    sendEmailService.sendEmailJS.mockResolvedValue(500);
    component.contactMeForm.setValue({
      name: 'Ana',
      email: 'ana@example.com',
      phone: '0712345678',
      message: 'Bună ziua, aș vrea mai multe detalii.',
    });

    await component.onSubmit();

    expect(component.isEmailModalOpen()).toBe(true);
    expect(component.emailPopUpParagraph()).toContain('500');
  });

  it('closes the email modal', () => {
    component.isEmailModalOpen.set(true);

    component.closeEmailModal();

    expect(component.isEmailModalOpen()).toBe(false);
  });
});

import { TestBed } from '@angular/core/testing';
import emailjs from '@emailjs/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactMeForm } from '../interfaces/contact-me-form';
import { SendEmailService } from './send-email.service';

vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));

describe('SendEmailService', () => {
  let service: SendEmailService;

  const form: ContactMeForm = {
    name: 'Ana',
    email: 'ana@example.com',
    phone: '0712345678',
    message: 'Bună ziua, aș vrea mai multe detalii.',
  };

  beforeEach(() => {
    vi.mocked(emailjs.send).mockReset();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendEmailService);
  });

  it('sends only the form fields EmailJS expects, using the configured template', async () => {
    vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

    await service.sendEmailJS(form);

    expect(emailjs.send).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      },
      expect.any(String),
    );
  });

  it('resolves with the EmailJS response status on success', async () => {
    vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

    await expect(service.sendEmailJS(form)).resolves.toBe(200);
  });

  it('resolves with 500 instead of throwing when EmailJS rejects', async () => {
    vi.mocked(emailjs.send).mockRejectedValue(new Error('network error'));

    await expect(service.sendEmailJS(form)).resolves.toBe(500);
  });
});

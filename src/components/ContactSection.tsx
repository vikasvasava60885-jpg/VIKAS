import React, { useState } from 'react';
import { Check, MessageCircle, Send } from 'lucide-react';
import { ContactInquiry, StoreSettings } from '../types/store';

interface ContactSectionProps {
  settings: StoreSettings;
  onAddInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onAddInquiry,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanWaNumber = settings.whatsappNumber.replace(/\D/g, '') || '919999999999';
  const defaultWaText = encodeURIComponent(
    `Hello ${settings.ownerName}, mujhe VV Store ke ek product ke baare mein jaankari chahiye.`
  );
  const directWaUrl = `https://wa.me/${cleanWaNumber}?text=${defaultWaText}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    onAddInquiry({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="border-t border-white/10 bg-[#08080A] py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* Owner Details & WhatsApp Business */}
        <div className="lg:col-span-5">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Direct Support
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
            Contact Owner
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <p className="text-base text-zinc-200">
              <span className="font-semibold text-white">Owner:</span>{' '}
              {settings.ownerName}
            </p>
            <p>
              Kisi bhi product inquiry, affiliate link assistance, ya business
              collaboration ke liye seedha WhatsApp Business par judein ya
              contact form bhejein.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2.5 whitespace-nowrap rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-150 hover:bg-zinc-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080A]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>WhatsApp Business Chat</span>
            </a>
            <span className="font-mono-tabular text-xs text-zinc-400">
              +{cleanWaNumber}
            </span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[#0E0E11] p-6 sm:p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-start gap-4 py-4">
                <div className="flex items-center gap-2.5 text-white">
                  <Check className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-display text-lg font-semibold">
                    Message Received
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Thank you for reaching out to {settings.ownerName}. Your message
                  has been saved and can be reviewed in the Admin Panel, or you
                  can message directly on WhatsApp Business for faster replies.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="min-h-[40px] rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Send Another Message
                  </button>
                  <a
                    href={directWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Open WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-medium text-zinc-300"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="min-h-[42px] w-full rounded-lg border border-white/15 bg-[#050505] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-medium text-zinc-300"
                    >
                      Your Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="min-h-[42px] w-full rounded-lg border border-white/15 bg-[#050505] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-medium text-zinc-300"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about any product, price, or collaboration..."
                    className="w-full rounded-lg border border-white/15 bg-[#050505] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-150 hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

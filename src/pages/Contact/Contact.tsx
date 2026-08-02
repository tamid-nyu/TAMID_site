import { useState } from 'react';
import toast from 'react-hot-toast';

import { dataService } from '@api';
import { ArrowIcon, SocialLink } from '@components';
import { useScrollAnimation } from '@hooks';

import './Contact.css';

interface ContactChannel {
  label: string;
  value: string;
  href?: string;
}

interface ContactSocialLink {
  href: string;
  platform: 'linkedin' | 'instagram';
  name: string;
  handle: string;
  iconSrc: string;
  alt: string;
}

const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: 'Email',
    value: 'sjba@stern.nyu.edu',
    href: 'mailto:sjba@stern.nyu.edu',
  },
  {
    label: 'Visit',
    value: '44 West 4th Street\nNew York, NY 10012',
  },
] as const;

const SOCIAL_LINKS: ContactSocialLink[] = [
  {
    href: 'https://www.linkedin.com/company/sjba/',
    platform: 'linkedin' as const,
    name: 'LinkedIn',
    handle: '@sjba',
    iconSrc: '/icons/linkedin-logo.png',
    alt: 'LinkedIn',
  },
  {
    href: 'https://www.instagram.com/nyusjba/',
    platform: 'instagram' as const,
    name: 'Instagram',
    handle: '@nyusjba',
    iconSrc: '/icons/instagram-logo.png',
    alt: 'Instagram',
  },
] as const;

export const Contact = () => {
  const detailsAnimation = useScrollAnimation({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });
  const formAnimation = useScrollAnimation({ threshold: 0.12, rootMargin: '0px 0px -45px 0px' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): Record<string, string> => {
    const nextErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Message is required';
    }

    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await dataService.contact.submitContactForm({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || undefined,
        message: formData.message.trim(),
      });

      toast.success('Message sent successfully!');

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        message: '',
      });
    } catch (error) {
      let message = 'An error occurred. Please try again.';
      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container contact-page">
      <section className="contact-grid" aria-label="Contact page content">
        <aside
          ref={detailsAnimation.elementRef}
          className={`contact-sidebar fade-in ${detailsAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="contact-intro">
            <div className="contact-intro__content">
              <h1 className="contact-title">Contact SJBA.</h1>
              <p className="contact-intro__copy">
                Reach out about partnerships, speakers, events, or general questions.
              </p>
            </div>
          </div>

          <div className="contact-sidebar__details">
            <div className="contact-sidebar__section">
              <span className="contact-section__eyebrow">Email</span>
              <a href="mailto:sjba@stern.nyu.edu" className="contact-channel__link">
                sjba@stern.nyu.edu
              </a>
            </div>

            <div className="contact-sidebar__section">
              <span className="contact-section__eyebrow">Address</span>
              <div className="contact-intro__channels" aria-label="Primary contact details">
                {CONTACT_CHANNELS.filter((channel) => channel.label === 'Visit').map((channel) => (
                  <div key={channel.label} className="contact-intro__channel">
                    <p className="contact-channel__text">{channel.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-sidebar__section">
              <span className="contact-section__eyebrow">Social</span>
              <div className="contact-social-links">
                {SOCIAL_LINKS.map((link) => (
                  <SocialLink key={link.href} {...link} />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div
          ref={formAnimation.elementRef}
          className={`contact-form-panel slide-up ${formAnimation.isVisible ? 'visible' : ''}`}
        >
          <div className="contact-form-panel__header">
            <span className="contact-section__eyebrow">Send a note</span>
            <h2 className="contact-form-panel__title">Share a few details and we'll follow up.</h2>
          </div>

          <form
            className="contact-form"
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
          >
            <fieldset className="contact-fieldset">
              <legend className="contact-form__group-title">
                Name <span className="required">(required)</span>
              </legend>

              <div className="contact-name-grid">
                <div className="contact-field">
                  <label htmlFor="firstName" className="contact-form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First"
                    autoComplete="given-name"
                    className={`contact-form-input ${errors.firstName ? 'input-error' : ''}`}
                  />
                  <span
                    className={`field-error ${errors.firstName ? '' : 'field-error--hidden'}`}
                    aria-live="polite"
                  >
                    {errors.firstName ?? ' '}
                  </span>
                </div>

                <div className="contact-field">
                  <label htmlFor="lastName" className="contact-form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last"
                    autoComplete="family-name"
                    className={`contact-form-input ${errors.lastName ? 'input-error' : ''}`}
                  />
                  <span
                    className={`field-error ${errors.lastName ? '' : 'field-error--hidden'}`}
                    aria-live="polite"
                  >
                    {errors.lastName ?? ' '}
                  </span>
                </div>
              </div>
            </fieldset>

            <div className="contact-field">
              <label
                htmlFor="email"
                className="contact-form__group-title contact-form__group-label"
              >
                Email <span className="required">(required)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@company.com"
                autoComplete="email"
                className={`contact-form-input ${errors.email ? 'input-error' : ''}`}
              />
              <span
                className={`field-error ${errors.email ? '' : 'field-error--hidden'}`}
                aria-live="polite"
              >
                {errors.email ?? ' '}
              </span>
            </div>

            <div className="contact-field">
              <label
                htmlFor="company"
                className="contact-form__group-title contact-form__group-label"
              >
                Company or organization
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Optional"
                autoComplete="organization"
                className="contact-form-input"
              />
            </div>

            <div className="contact-field">
              <label
                htmlFor="message"
                className="contact-form__group-title contact-form__group-label"
              >
                Message <span className="required">(required)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your idea, event, or question."
                className={`contact-form-input contact-form-input--textarea ${
                  errors.message ? 'input-error' : ''
                }`}
              />
              <span
                className={`field-error ${errors.message ? '' : 'field-error--hidden'}`}
                aria-live="polite"
              >
                {errors.message ?? ' '}
              </span>
            </div>

            <div className="contact-form__actions">
              <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <ArrowIcon className="contact-submit-btn__arrow" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { dataService } from '@api';
import './NewsletterSignup.css';

export const NewsletterSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateNYUEmail = (email: string): boolean => {
    const nyuEmailPattern = /^[a-zA-Z0-9._%+-]+@(.*\.)?nyu\.edu$/i;
    return nyuEmailPattern.test(email);
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateNYUEmail(formData.email.trim())) {
      newErrors.email = 'Please use a valid NYU email address';
    }

    return newErrors;
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
      await dataService.newsletter.signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      toast.success('Successfully signed up for the newsletter!');
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (error) {
      let message = 'An error occurred. Please try again.';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      console.error('Newsletter signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-section newsletter-section-expanded">
      <div className="newsletter-content">
        <div className="newsletter-layout">
          <div className="newsletter-heading-group">
            <span className="newsletter-eyebrow">SJBA Newsletter</span>
            <h2>Receive the next invitation before it circulates.</h2>
            <p className="newsletter-description">
              Updates on speakers, programs, and SJBA at Stern.
            </p>
          </div>
          <div className="newsletter-form-column">
            <form
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
              className="newsletter-form"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newsletter-firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    id="newsletter-firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                  />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="newsletter-lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="newsletter-lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                  />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-group email-group">
                <label htmlFor="newsletter-email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <button type="submit" className="newsletter-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Joining...' : 'Join the List'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

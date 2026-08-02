export interface NewsletterSignup {
  firstName: string;
  lastName: string;
  email: string;
}

export interface NewsletterSignupData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface NewsletterSignupResponse {
  success: boolean;
  message: string;
  data: NewsletterSignupData;
}

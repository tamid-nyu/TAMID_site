import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsletterSignup } from './NewsletterSignup';

const newsletterSignupMock = vi.hoisted(() => vi.fn());

vi.mock('@api', () => ({
  dataService: {
    newsletter: {
      signup: newsletterSignupMock,
    },
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('NewsletterSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors before submitting incomplete data', async () => {
    render(<NewsletterSignup />);

    await userEvent.click(screen.getByRole('button', { name: /join the list/i }));

    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(newsletterSignupMock).not.toHaveBeenCalled();
  });

  it('submits trimmed data with a lowercased NYU email', async () => {
    newsletterSignupMock.mockResolvedValueOnce({
      success: true,
      message: 'ok',
      data: {
        id: 'signup-1',
        email: 'ada@stern.nyu.edu',
        firstName: 'Ada',
        lastName: 'Lovelace',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    });

    render(<NewsletterSignup />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: ' Ada ' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: ' Lovelace ' } });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'ADA@STERN.NYU.EDU' },
    });
    await userEvent.click(screen.getByRole('button', { name: /join the list/i }));

    await waitFor(() => {
      expect(newsletterSignupMock).toHaveBeenCalledWith({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@stern.nyu.edu',
      });
    });
  });
});

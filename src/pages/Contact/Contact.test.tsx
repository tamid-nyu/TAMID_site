import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './Contact';

const contactSubmitMock = vi.hoisted(() => vi.fn());

vi.mock('@api', () => ({
  dataService: {
    contact: {
      submitContactForm: contactSubmitMock,
    },
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows required field errors before submitting incomplete data', async () => {
    render(<Contact />);

    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
    expect(contactSubmitMock).not.toHaveBeenCalled();
  });

  it('submits trimmed contact details and omits blank company', async () => {
    contactSubmitMock.mockResolvedValueOnce({ success: true, message: 'ok' });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: ' Member ' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: ' One ' } });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: ' member.one@example.com ' },
    });
    fireEvent.change(screen.getByLabelText(/company or organization/i), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByLabelText(/^message/i), {
      target: { value: ' Interested in speaking. ' },
    });

    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(contactSubmitMock).toHaveBeenCalledWith({
        firstName: 'Member',
        lastName: 'One',
        email: 'member.one@example.com',
        company: undefined,
        message: 'Interested in speaking.',
      });
    });
  });
});

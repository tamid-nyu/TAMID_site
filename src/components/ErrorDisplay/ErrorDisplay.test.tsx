import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { STATUS_PAGE_URL } from '@constants';
import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
  it('shows the error, status link, and retry action', async () => {
    const onRetry = vi.fn();

    render(<ErrorDisplay error="Could not load events." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load events.');
    expect(screen.getByRole('link', { name: /sjba service status/i })).toHaveAttribute(
      'href',
      STATUS_PAGE_URL
    );

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not repeat the status link when the message already references status', () => {
    render(<ErrorDisplay error="Please check service status before retrying." />);

    expect(screen.queryByRole('link', { name: /sjba service status/i })).not.toBeInTheDocument();
  });
});

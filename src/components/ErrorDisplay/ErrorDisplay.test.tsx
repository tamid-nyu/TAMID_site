import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
  it('shows the error and retry action', async () => {
    const onRetry = vi.fn();

    render(<ErrorDisplay error="Could not load events." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load events.');

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render a status link', () => {
    render(<ErrorDisplay error="Please check service status before retrying." />);

    expect(screen.queryByRole('link', { name: /tamid service status/i })).not.toBeInTheDocument();
  });
});

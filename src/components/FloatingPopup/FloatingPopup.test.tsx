import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FloatingPopup } from './FloatingPopup';

describe('FloatingPopup', () => {
  it('renders nothing when closed', () => {
    render(<FloatingPopup isOpen={false} onClose={vi.fn()} title="Upcoming Event" />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders popup content and handles close', async () => {
    const onClose = vi.fn();

    render(
      <FloatingPopup
        isOpen
        onClose={onClose}
        eyebrow="Upcoming Event"
        title="Speaker Night"
        subtitle="Goldman Sachs"
        thumbnailSrc="/flyer.jpg"
        thumbnailAlt="Speaker Night flyer"
        footer={<a href="/events">View event</a>}
        ariaLabel="Next upcoming event"
      >
        <p>Tuesday at Stern.</p>
      </FloatingPopup>
    );

    expect(screen.getByRole('dialog', { name: /next upcoming event/i })).toBeInTheDocument();
    expect(screen.getByText('Upcoming Event')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /speaker night/i })).toBeInTheDocument();
    expect(screen.getByText('Goldman Sachs')).toBeInTheDocument();
    expect(screen.getByAltText('Speaker Night flyer')).toHaveAttribute('src', '/flyer.jpg');
    expect(screen.getByRole('link', { name: /view event/i })).toHaveAttribute('href', '/events');

    await userEvent.click(screen.getByRole('button', { name: /close popup/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

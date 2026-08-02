import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

const setMobileViewport = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the primary navigation links', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /events/i })).toHaveAttribute('href', '/events');
    expect(screen.getByRole('link', { name: /programs/i })).toHaveAttribute('href', '/mentorship');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument();
  });

  it('toggles the mobile navigation state from the menu button', async () => {
    setMobileViewport();
    renderHeader();

    const menuButton = screen.getByLabelText(/open navigation menu/i);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(menuButton);

    expect(screen.getByLabelText(/close navigation menu/i)).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});

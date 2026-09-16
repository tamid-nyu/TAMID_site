import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Application } from './Application';

const getByKeys = vi.hoisted(() => vi.fn());

vi.mock('@api', () => ({
  dataService: { siteConfig: { getByKeys } },
}));

vi.mock('@hooks', () => ({
  useScrollAnimation: () => ({ elementRef: { current: null }, isVisible: true }),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <Application />
    </MemoryRouter>
  );

describe('Application page', () => {
  beforeEach(() => {
    getByKeys.mockReset();
  });

  it('shows the open state with cycle label, deadline, note and the apply link', async () => {
    getByKeys.mockResolvedValueOnce({
      mentorship_application_open: 'true',
      mentorship_application_url: 'https://forms.example/apply',
      application_cycle_label: 'Fall 2026',
      application_deadline: 'Friday, September 26',
      application_note: 'Info sessions run all week in KMC.',
      coffee_chat_url: 'https://forms.example/coffee',
    });
    renderPage();

    expect(await screen.findByRole('status')).toHaveTextContent('Applications open');
    expect(
      screen.getByRole('heading', { name: 'Applications for Fall 2026 are open.' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Applications close Friday, September 26\./)).toBeInTheDocument();
    expect(screen.getByText('Info sessions run all week in KMC.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Start your application' })).toHaveAttribute(
      'href',
      'https://forms.example/apply'
    );
    expect(screen.getByRole('link', { name: 'Request a coffee chat' })).toHaveAttribute(
      'href',
      'https://forms.example/coffee'
    );
  });

  it('still offers the coffee chat link while applications are closed', async () => {
    getByKeys.mockResolvedValueOnce({
      mentorship_application_open: 'false',
      coffee_chat_url: 'https://forms.example/coffee',
    });
    renderPage();

    expect(await screen.findByRole('status')).toHaveTextContent('Applications closed');
    expect(screen.getByRole('link', { name: 'Request a coffee chat' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Start your application' })).toBeNull();
  });

  it('falls back to generic open copy when the optional keys are empty', async () => {
    getByKeys.mockResolvedValueOnce({
      mentorship_application_open: 'true',
      mentorship_application_url: 'https://forms.example/apply',
    });
    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'The application is open.' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Applications for this cycle are open now\./)).toBeInTheDocument();
  });

  it('shows the closed state and a contact link when applications are closed', async () => {
    getByKeys.mockResolvedValueOnce({ mentorship_application_open: 'false' });
    renderPage();

    expect(await screen.findByRole('status')).toHaveTextContent('Applications closed');
    expect(
      screen.getByRole('heading', { name: 'Applications are closed for now.' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Start your application' })).toBeNull();
  });

  it('treats a config fetch failure as closed', async () => {
    getByKeys.mockRejectedValueOnce(new Error('network'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderPage();

    expect(await screen.findByRole('status')).toHaveTextContent('Applications closed');
    errorSpy.mockRestore();
  });
});

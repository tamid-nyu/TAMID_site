import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { BoardMember } from '@types';
import { BOARD_IMAGES_BUCKET } from '@constants';
import { BoardMemberModal } from './BoardMemberModal';

const member: BoardMember = {
  id: 'member-1',
  headshotUpdatedAt: '2026-07-22T18:42:00.000Z',
  fullName: 'Ada Lovelace',
  position: 'President',
  bio: 'Builds bridges.\nHosts events.',
  major: 'Finance',
  year: 'Class of 2026',
  hometown: 'New York, NY',
  linkedinUrl: 'https://linkedin.com/in/ada',
  email: 'ada@stern.nyu.edu',
  headshotFile: 'ada.jpg',
  orderIndex: 1,
};

const renderModal = (overrides: Partial<React.ComponentProps<typeof BoardMemberModal>> = {}) => {
  const props: React.ComponentProps<typeof BoardMemberModal> = {
    member,
    isOpen: true,
    onClose: vi.fn(),
    onImageError: vi.fn(),
    shouldShowPlaceholder: () => false,
    ...overrides,
  };

  render(<BoardMemberModal {...props} />);

  return props;
};

describe('BoardMemberModal', () => {
  it('renders nothing when closed or missing a member', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders member details and contact links', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: /ada lovelace/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ada lovelace/i })).toBeInTheDocument();
    expect(screen.getByText('President')).toBeInTheDocument();
    expect(screen.getByText(/builds bridges/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email ada lovelace/i })).toHaveAttribute(
      'href',
      'mailto:ada@stern.nyu.edu'
    );
    expect(screen.getByRole('link', { name: /view ada lovelace on linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/ada'
    );
    expect(screen.getByAltText('Ada Lovelace headshot')).toHaveAttribute(
      'src',
      `${BOARD_IMAGES_BUCKET}ada.jpg?v=2026-07-22T18%3A42%3A00.000Z`
    );
  });

  it('closes from escape, overlay, and close button', async () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.keyDown(document, { key: 'Escape' });
    await userEvent.click(screen.getByRole('button', { name: /close member profile/i }));
    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('shows initials placeholder and reports image errors', () => {
    const onImageError = vi.fn();
    const { rerender } = render(
      <BoardMemberModal
        member={member}
        isOpen
        onClose={vi.fn()}
        onImageError={onImageError}
        shouldShowPlaceholder={() => true}
      />
    );

    expect(screen.getByText('AL')).toBeInTheDocument();

    rerender(
      <BoardMemberModal
        member={member}
        isOpen
        onClose={vi.fn()}
        onImageError={onImageError}
        shouldShowPlaceholder={() => false}
      />
    );

    fireEvent.error(screen.getByAltText('Ada Lovelace headshot'));

    expect(onImageError).toHaveBeenCalledWith('Ada Lovelace');
  });
});

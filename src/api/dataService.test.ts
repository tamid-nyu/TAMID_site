import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dataService } from './dataService';

const apiClientMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('./client', () => ({
  apiClient: {
    get: apiClientMocks.get,
    post: apiClientMocks.post,
  },
}));

describe('dataService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps newsletter signup fields to the backend contract', async () => {
    apiClientMocks.post.mockResolvedValueOnce({
      data: { success: true, message: 'ok', data: {} },
      success: true,
    });

    await dataService.newsletter.signup({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@stern.nyu.edu',
    });

    expect(apiClientMocks.post).toHaveBeenCalledWith('/newsletter-sign-ups', {
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'ada@stern.nyu.edu',
    });
  });

  it('uses default event pagination and preserves provided filters', async () => {
    apiClientMocks.get.mockResolvedValueOnce({
      data: [],
      success: true,
      count: 0,
      pagination: {
        page: 2,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: true,
      },
    });

    const result = await dataService.events.getAll({ page: 2, limit: 10, semester: 'S26' });

    expect(apiClientMocks.get).toHaveBeenCalledWith('/events', {
      page: 2,
      limit: 10,
      semester: 'S26',
    });
    expect(result).toEqual({
      events: [],
      pagination: {
        page: 2,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: true,
      },
    });
  });

  it('maps site config entries to a key-value object', async () => {
    apiClientMocks.get.mockResolvedValueOnce({
      data: [
        { key: 'mentorship_application_open', value: 'true' },
        { key: 'mentorship_application_url', value: 'https://example.com/apply' },
      ],
      success: true,
    });

    await expect(
      dataService.siteConfig.getByKeys([
        'mentorship_application_open',
        'mentorship_application_url',
      ])
    ).resolves.toEqual({
      mentorship_application_open: 'true',
      mentorship_application_url: 'https://example.com/apply',
    });

    expect(apiClientMocks.get).toHaveBeenCalledWith('/site-config', {
      keys: 'mentorship_application_open,mentorship_application_url',
    });
  });
});

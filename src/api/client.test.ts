import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiClient } from './client';
import { server } from '../test/server';

describe('apiClient', () => {
  it('serializes query params and unwraps successful responses', async () => {
    server.use(
      http.get('*/v1/events', ({ request }) => {
        const url = new URL(request.url);

        expect(url.searchParams.get('page')).toBe('2');
        expect(url.searchParams.get('tags')).toBe('finance,consulting');

        return HttpResponse.json({
          success: true,
          data: [{ id: 'event-1' }],
        });
      })
    );

    await expect(
      apiClient.get('/events', {
        page: 2,
        tags: ['finance', 'consulting'],
      })
    ).resolves.toEqual({
      success: true,
      data: [{ id: 'event-1' }],
    });
  });

  it('normalizes not found responses for user-facing UI', async () => {
    server.use(
      http.get('*/v1/missing', () =>
        HttpResponse.json(
          {
            success: false,
            error: { message: 'Backend detail', code: 'NOT_FOUND' },
          },
          { status: 404 }
        )
      )
    );

    await expect(apiClient.get('/missing')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'The requested resource could not be found.',
      status: 404,
      code: 'NOT_FOUND',
    });
  });

  it('hides server error details behind a generic unavailable message', async () => {
    server.use(
      http.post('*/v1/contact', () =>
        HttpResponse.json(
          {
            success: false,
            error: { message: 'Database credentials leaked detail', code: 'DB_DOWN' },
          },
          { status: 500 }
        )
      )
    );

    await expect(apiClient.post('/contact', { message: 'Hello' })).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Services are temporarily unavailable.',
      status: 500,
      code: 'DB_DOWN',
    });
  });

  it('preserves actionable rate limit messages', async () => {
    server.use(
      http.post('*/v1/newsletter-sign-ups', () =>
        HttpResponse.json(
          {
            success: false,
            message: 'Please wait before trying again.',
            code: 'RATE_LIMITED',
          },
          { status: 429 }
        )
      )
    );

    await expect(apiClient.post('/newsletter-sign-ups')).rejects.toMatchObject({
      message: 'Please wait before trying again.',
      status: 429,
      code: 'RATE_LIMITED',
    });
  });
});

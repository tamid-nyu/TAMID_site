import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { BACKEND_URL } from '../constants';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Validate environment variables
    if (!BACKEND_URL) {
      throw new Error('VITE_BACKEND_URL environment variable is required');
    }

    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: BACKEND_URL,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add any global request modifications here
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp for debugging
        config.metadata = { startTime: new Date() };
        return config;
      },
      (error: Error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle responses and errors globally
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        let message = 'An unexpected error occurred';
        let status = 500;
        let code: string | undefined;

        if (error.response) {
          status = error.response.status;
          const responseData = error.response.data as
            | {
                error?: { message?: string; code?: string } | string;
                message?: string;
                code?: string;
              }
            | string;

          const normalizedResponseData =
            typeof responseData === 'string' ? { message: responseData } : responseData;
          const rawErrorData = normalizedResponseData?.error ?? normalizedResponseData;
          const errorData =
            typeof rawErrorData === 'string' ? { message: rawErrorData } : rawErrorData;

          const resolvedMessage =
            errorData?.message ||
            normalizedResponseData?.message ||
            error.message ||
            `HTTP ${status}: ${error.response.statusText}`;
          const resolvedCode = errorData?.code || normalizedResponseData?.code;

          if (status >= 500) {
            message = 'Services are temporarily unavailable.';
          } else if (status === 429) {
            message = resolvedMessage || 'Too many requests. Please try again later.';
          } else if (status === 404) {
            message = 'The requested resource could not be found.';
          } else if (status === 401 || status === 403) {
            message = 'You do not have permission to access this resource.';
          } else {
            message = resolvedMessage;
          }

          code = resolvedCode;
        } else if (error.request) {
          message = 'Network error. Please check your connection and try again.';
          status = 0;
        } else {
          message = error.message;
        }

        return Promise.reject(new ApiError(message, status, code));
      }
    );
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | string[]>
  ): Promise<T> {
    // Clean endpoint path
    const cleanEndpoint = endpoint.replace(/^\//, '');

    // Convert params to string values for URL
    const stringParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            stringParams[key] = value.join(',');
          } else {
            stringParams[key] = String(value);
          }
        }
      });
    }

    const response = await this.client.get<T>(cleanEndpoint, { params: stringParams });
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const response = await this.client.post<T>(cleanEndpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const response = await this.client.put<T>(cleanEndpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const response = await this.client.delete<T>(cleanEndpoint);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Extend axios config type to include our metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

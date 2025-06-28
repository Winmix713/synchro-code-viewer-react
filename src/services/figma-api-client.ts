
import { FigmaFile, FigmaApiResponse, FigmaError, FigmaErrorCode } from '../types/figma-api';
import { securityService } from './security-service';

export class FigmaApiClient {
  private static instance: FigmaApiClient;
  private baseUrl = 'https://api.figma.com/v1';
  private rateLimitRemaining = 100;
  private rateLimitReset = new Date();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  private constructor() {}

  static getInstance(): FigmaApiClient {
    if (!FigmaApiClient.instance) {
      FigmaApiClient.instance = new FigmaApiClient();
    }
    return FigmaApiClient.instance;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      if (this.rateLimitRemaining <= 0) {
        const waitTime = Math.max(0, this.rateLimitReset.getTime() - Date.now());
        if (waitTime > 0) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Queued request failed:', error);
        }
      }

      // Small delay between requests to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessingQueue = false;
  }

  private async makeRequest<T>(
    endpoint: string,
    apiKey: string,
    options: RequestInit = {}
  ): Promise<FigmaApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const requestFn = async () => {
        try {
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
              'X-Figma-Token': apiKey,
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });

          // Update rate limit info
          const rateLimitHeader = response.headers.get('x-ratelimit-remaining');
          const rateLimitResetHeader = response.headers.get('x-ratelimit-reset');
          
          if (rateLimitHeader) {
            this.rateLimitRemaining = parseInt(rateLimitHeader, 10);
          }
          
          if (rateLimitResetHeader) {
            this.rateLimitReset = new Date(parseInt(rateLimitResetHeader, 10) * 1000);
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const figmaError = this.createFigmaError(response.status, errorData);
            reject(figmaError);
            return;
          }

          const data = await response.json();
          resolve({
            data,
            status: response.status,
          });
        } catch (error) {
          const figmaError = this.createFigmaError(0, { message: (error as Error).message });
          reject(figmaError);
        }
      };

      this.requestQueue.push(requestFn);
      this.processQueue();
    });
  }

  private createFigmaError(status: number, errorData: any): FigmaError {
    let code: FigmaErrorCode;
    let recoverable = true;
    let retryAfter: number | undefined;

    switch (status) {
      case 401:
        code = FigmaErrorCode.INVALID_API_KEY;
        recoverable = false;
        break;
      case 403:
        code = FigmaErrorCode.INSUFFICIENT_PERMISSIONS;
        recoverable = false;
        break;
      case 404:
        code = FigmaErrorCode.FILE_NOT_FOUND;
        recoverable = false;
        break;
      case 429:
        code = FigmaErrorCode.RATE_LIMIT_EXCEEDED;
        retryAfter = 60; // Default retry after 60 seconds
        break;
      case 500:
      case 502:
      case 503:
        code = FigmaErrorCode.SERVICE_UNAVAILABLE;
        retryAfter = 30;
        break;
      default:
        code = status === 0 ? FigmaErrorCode.NETWORK_ERROR : FigmaErrorCode.UNKNOWN_ERROR;
    }

    const error = new Error(errorData.message || 'An error occurred') as FigmaError;
    error.code = code;
    error.details = errorData;
    error.recoverable = recoverable;
    error.retryAfter = retryAfter;
    error.timestamp = new Date();

    return error;
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('/me', apiKey);
      return response.status === 200;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getFile(fileKey: string, apiKey: string): Promise<FigmaFile> {
    const response = await this.makeRequest<FigmaFile>(`/files/${fileKey}`, apiKey);
    if (!response.data) {
      throw new Error('No file data received');
    }
    return response.data;
  }

  async getFileComponents(fileKey: string, apiKey: string) {
    const response = await this.makeRequest(`/files/${fileKey}/components`, apiKey);
    return response.data;
  }

  async getFileStyles(fileKey: string, apiKey: string) {
    const response = await this.makeRequest(`/files/${fileKey}/styles`, apiKey);
    return response.data;
  }

  extractFileKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/(?:file|design)\/([a-zA-Z0-9]{22,})/);
      return pathMatch ? pathMatch[1] : null;
    } catch {
      return null;
    }
  }

  getRateLimitStatus() {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset,
      queueLength: this.requestQueue.length,
    };
  }
}

export const figmaApiClient = FigmaApiClient.getInstance();

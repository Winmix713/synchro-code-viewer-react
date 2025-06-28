
export interface FigmaError extends Error {
  code: FigmaErrorCode;
  details?: Record<string, any>;
  recoverable: boolean;
  retryAfter?: number;
  timestamp: Date;
}

export enum FigmaErrorCode {
  // Authentication errors
  INVALID_API_KEY = 'INVALID_API_KEY',
  API_KEY_EXPIRED = 'API_KEY_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // File access errors
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_ACCESS_DENIED = 'FILE_ACCESS_DENIED',
  INVALID_FILE_URL = 'INVALID_FILE_URL',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  DNS_ERROR = 'DNS_ERROR',
  
  // Data processing errors
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  MEMORY_ERROR = 'MEMORY_ERROR',
  
  // Security errors
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  ENCRYPTED_DATA_ERROR = 'ENCRYPTED_DATA_ERROR',
  
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

export interface ErrorRecoveryStrategy {
  canRecover: boolean;
  retryable: boolean;
  maxRetries: number;
  backoffMultiplier: number;
  recoveryAction?: () => Promise<void>;
  userMessage: string;
  technicalMessage: string;
}

export const ERROR_RECOVERY_STRATEGIES: Record<FigmaErrorCode, ErrorRecoveryStrategy> = {
  [FigmaErrorCode.INVALID_API_KEY]: {
    canRecover: true,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'Please check your API key and try again.',
    technicalMessage: 'API key validation failed.'
  },
  [FigmaErrorCode.API_KEY_EXPIRED]: {
    canRecover: true,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'Your API key has expired. Please generate a new one.',
    technicalMessage: 'API key has expired and needs renewal.'
  },
  [FigmaErrorCode.INSUFFICIENT_PERMISSIONS]: {
    canRecover: false,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'You don\'t have permission to access this file.',
    technicalMessage: 'Insufficient permissions for the requested resource.'
  },
  [FigmaErrorCode.FILE_NOT_FOUND]: {
    canRecover: false,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'The Figma file could not be found. Please check the URL.',
    technicalMessage: 'Requested file does not exist.'
  },
  [FigmaErrorCode.FILE_ACCESS_DENIED]: {
    canRecover: false,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'Access to this file is denied. Please check permissions.',
    technicalMessage: 'File access denied due to permissions.'
  },
  [FigmaErrorCode.INVALID_FILE_URL]: {
    canRecover: true,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'Please enter a valid Figma file URL.',
    technicalMessage: 'Invalid file URL format provided.'
  },
  [FigmaErrorCode.RATE_LIMIT_EXCEEDED]: {
    canRecover: true,
    retryable: true,
    maxRetries: 3,
    backoffMultiplier: 2,
    userMessage: 'Too many requests. Please wait a moment and try again.',
    technicalMessage: 'Rate limit exceeded, implementing exponential backoff.'
  },
  [FigmaErrorCode.QUOTA_EXCEEDED]: {
    canRecover: false,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'API quota exceeded. Please try again later.',
    technicalMessage: 'API quota limit reached.'
  },
  [FigmaErrorCode.NETWORK_ERROR]: {
    canRecover: true,
    retryable: true,
    maxRetries: 5,
    backoffMultiplier: 1.5,
    userMessage: 'Network connection issue. Retrying automatically...',
    technicalMessage: 'Network request failed, attempting retry.'
  },
  [FigmaErrorCode.CONNECTION_TIMEOUT]: {
    canRecover: true,
    retryable: true,
    maxRetries: 3,
    backoffMultiplier: 2,
    userMessage: 'Connection timed out. Retrying...',
    technicalMessage: 'Request timeout, implementing retry with backoff.'
  },
  [FigmaErrorCode.DNS_ERROR]: {
    canRecover: true,
    retryable: true,
    maxRetries: 2,
    backoffMultiplier: 2,
    userMessage: 'DNS resolution failed. Please check your connection.',
    technicalMessage: 'DNS resolution error, retrying request.'
  },
  [FigmaErrorCode.INVALID_FILE_FORMAT]: {
    canRecover: false,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'The file format is not supported.',
    technicalMessage: 'Invalid or unsupported file format.'
  },
  [FigmaErrorCode.PROCESSING_ERROR]: {
    canRecover: true,
    retryable: true,
    maxRetries: 2,
    backoffMultiplier: 1.5,
    userMessage: 'Processing error occurred. Retrying...',
    technicalMessage: 'File processing failed, attempting retry.'
  },
  [FigmaErrorCode.MEMORY_ERROR]: {
    canRecover: true,
    retryable: true,
    maxRetries: 1,
    backoffMultiplier: 2,
    userMessage: 'Memory limit exceeded. Please try with a smaller file.',
    technicalMessage: 'Memory allocation error during processing.'
  },
  [FigmaErrorCode.SECURITY_VIOLATION]: {
    canRecover: false,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'Security violation detected. Please contact support.',
    technicalMessage: 'Security policy violation occurred.'
  },
  [FigmaErrorCode.ENCRYPTED_DATA_ERROR]: {
    canRecover: true,
    retryable: false,
    maxRetries: 0,
    backoffMultiplier: 1,
    userMessage: 'Encryption error. Please try logging in again.',
    technicalMessage: 'Data decryption failed.'
  },
  [FigmaErrorCode.UNKNOWN_ERROR]: {
    canRecover: true,
    retryable: true,
    maxRetries: 1,
    backoffMultiplier: 2,
    userMessage: 'An unexpected error occurred. Please try again.',
    technicalMessage: 'Unknown error encountered.'
  },
  [FigmaErrorCode.SERVICE_UNAVAILABLE]: {
    canRecover: true,
    retryable: true,
    maxRetries: 3,
    backoffMultiplier: 2,
    userMessage: 'Service temporarily unavailable. Please try again later.',
    technicalMessage: 'External service unavailable, implementing retry.'
  }
} as const;

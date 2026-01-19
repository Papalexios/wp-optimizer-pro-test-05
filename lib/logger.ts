/**
 * Enterprise Logger - Structured Logging System
 * Provides centralized logging with error handling and monitoring capabilities
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  correlationId?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private correlationId?: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: config.minLevel || 'info',
      enableConsole: config.enableConsole ?? true,
      enableRemote: config.enableRemote ?? false,
      remoteEndpoint: config.remoteEndpoint,
    };
  }

  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      correlationId: this.correlationId,
    };
  }

  private log(entry: LogEntry): void {
    this.buffer.push(entry);
    if (this.buffer.length > 1000) this.buffer.shift();

    if (this.config.enableConsole) {
      const style = this.getConsoleStyle(entry.level);
      console[entry.level === 'fatal' ? 'error' : entry.level](
        `%c[${entry.level.toUpperCase()}]`,
        style,
        entry.timestamp,
        entry.message,
        entry.context || '',
        entry.error || ''
      );
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: gray',
      info: 'color: blue',
      warn: 'color: orange',
      error: 'color: red',
      fatal: 'color: red; font-weight: bold',
    };
    return styles[level];
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      this.log(this.formatEntry('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      this.log(this.formatEntry('info', message, context));
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      this.log(this.formatEntry('warn', message, context));
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      this.log(this.formatEntry('error', message, context, error));
    }
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.shouldLog('fatal')) {
      this.log(this.formatEntry('fatal', message, context, error));
    }
  }

  getRecentLogs(count = 50): LogEntry[] {
    return this.buffer.slice(-count);
  }

  getErrorLogs(): LogEntry[] {
    return this.buffer.filter(e => e.level === 'error' || e.level === 'fatal');
  }
}

// Application Error Classes
export class AppError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;
  public readonly isOperational: boolean;

  constructor(message: string, code: string, context?: Record<string, unknown>, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

export class APIError extends AppError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number, context?: Record<string, unknown>) {
    super(message, 'API_ERROR', context);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

// Error Handler
export function handleError(error: Error, logger: Logger): void {
  if (error instanceof AppError && error.isOperational) {
    logger.error(error.message, error, error.context);
  } else {
    logger.fatal('Unexpected error occurred', error);
  }
}

// Singleton instance
export const logger = new Logger({
  minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableConsole: true,
});

export default Logger;

import { logApi } from '../services/api';

class Logger {
  static info(message, meta = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(message, meta);
    }
    this.sendToServer('info', message, meta);
  }

  static error(message, meta = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(message, meta);
    }
    this.sendToServer('error', message, meta);
  }

  static warn(message, meta = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(message, meta);
    }
    this.sendToServer('warn', message, meta);
  }

  static debug(message, meta = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(message, meta);
    }
    this.sendToServer('debug', message, meta);
  }

  static async sendToServer(level, message, meta) {
    try {
      await logApi.createLog({
        level,
        message,
        meta: {
          ...meta,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }
}

export default Logger;
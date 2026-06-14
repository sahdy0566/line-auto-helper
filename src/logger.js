import { env } from './config.js';

const levels = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function shouldLog(level) {
  return levels[level] >= (levels[env.logLevel] || levels.info);
}

function write(level, message, fields = {}) {
  if (!shouldLog(level)) {
    return;
  }

  const entry = {
    ts: new Date().toISOString(),
    level,
    service: 'line-auto-helper',
    message,
    ...fields
  };

  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
    return;
  }

  console.log(output);
}

export const logger = {
  debug: (message, fields) => write('debug', message, fields),
  info: (message, fields) => write('info', message, fields),
  warn: (message, fields) => write('warn', message, fields),
  error: (message, fields) => write('error', message, fields)
};

export function errorFields(error) {
  return {
    errorName: error?.name || 'Error',
    errorMessage: error?.message || String(error)
  };
}

const path = require('path');
const winston = require('winston');
const config = require('../config');

const COLORIZE = config.NODE_ENV === 'development';

function createLogger(filePath) {
  const fileName = path.basename(filePath);
  const level = config.LOG_LEVEL || 'info';

  const formats = [
    winston.format.timestamp(),
    winston.format.label({ label: fileName }),
    winston.format.printf(({ timestamp, level: lvl, label, message }) => {
      return `${timestamp} - ${lvl}: [${label}] ${message}`;
    }),
  ];

  if (COLORIZE) {
    formats.unshift(winston.format.colorize());
  }

  return winston.createLogger({
    level,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(...formats),
      }),
    ],
  });
}

module.exports = createLogger;

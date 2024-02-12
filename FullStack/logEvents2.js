// Imports 
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const { combine, timestamp, json, errors } = winston.format;

// Initiate daily log files
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
});

// types/levels of errors in winston
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }

// Logging function initiation
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'admin-service',
  },
  format: combine(
    errors(),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-05 03:23:10.350 PM
    }),
    json()
  ),
  transports: [
    fileRotateTransport,
    new winston.transports.Console()
  ],
});

// export logger function
module.exports = logger;



// Fired when a log file is created
fileRotateTransport.on('new', (filename) => {});
// Fired when a log file is rotated
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {});
// Fired when a log file is archived
fileRotateTransport.on('archive', (zipFilename) => {});
// Fired when a log file is deleted
fileRotateTransport.on('logRemoved', (removedFilename) => {});

logger.error(new Error('an error'));
logger.info('Info message');
logger.error('Error message');
logger.warn('Warning message');

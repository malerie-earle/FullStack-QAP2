const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const { combine, timestamp, json, errors } = winston.format;
const path = require('path');

// Create a 'logs' directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Get current date
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = (today.getMonth() + 1).toString();
  let day = today.getDate().toString();
  // Pad single-digit month and day with a leading zero
  if (month.length === 1) {
    month = `0${month}`;}
  if (day.length === 1) {
    day = `0${day}`;}
  return `${year}-${month}-${day}`;
}

// Initiate daily log files inside the 'logs' directory
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${logsDir}/%DATE%/combined-%DATE%.log`, // Updated filename pattern
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
});

// Logging function initiation
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'admin-service',
  },
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json()
  ),
  transports: [
    fileRotateTransport,
    new winston.transports.Console()
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './logs/exception.log' }), // Specify the path to the 'logs' directory
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: './logs/rejections.log' }), // Specify the path to the 'logs' directory
  ],
});


// Start a timer
logger.profile('test');

setTimeout(() => {
  // End the timer and log the duration
  logger.profile('test');
}, 1000);

// Function to check if a file exists
function checkFileExists(filePath) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.error(`File "${filePath}" does not exist: ${err.message}`);
    } else {
      logger.info(`File "${filePath}" exists`);
    }
  });
}

// Function to read a file
function readFile(filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      logger.error(`Failed to read file "${filePath}": ${err.message}`);
    } else {
      logger.info(`Successfully read file "${filePath}`);
    }
  });
}

// Fired when a log file is created
fileRotateTransport.on('new', (filename) => {});
// Fired when a log file is rotated
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {});

// Fired when a log file is archived
fileRotateTransport.on('archive', (zipFilename) => {
  // Get the directory name of the zipFilename
  const dirname = path.dirname(zipFilename);
  // Construct the new path by joining the dirname with the current date folder
  const newPath = path.join(dirname, getCurrentDate());
  // Replace the logsDir with the new path
  const newFilename = zipFilename.replace(logsDir, newPath);
});

// Fired when a log file is deleted
fileRotateTransport.on('logRemoved', (removedFilename) => {
  // Get the directory name of the removedFilename
  const dirname = path.dirname(removedFilename);
  // Construct the new path by joining the dirname with the current date folder
  const newPath = path.join(dirname, getCurrentDate());
  // Replace the logsDir with the new path
  const newFilename = removedFilename.replace(logsDir, newPath);
});

logger.exitOnError = false;

// Export logger function
module.exports = {
  logger,
  checkFileExists,
  readFile
};
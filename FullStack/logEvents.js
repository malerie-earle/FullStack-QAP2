// Imports
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const { combine, timestamp, json, errors } = winston.format;
const path = require('path');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

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
  filename: `${logsDir}/%DATE%/combined-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    winston.format.json()
  ),
  defaultMeta: { service: 'admin-service' },
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true
    }),
    new winston.transports.DailyRotateFile({
      filename: `${logsDir}/%DATE%/combined-%DATE%.log`, 
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      handleExceptions: true,
      handleRejections: true
    })
  ],
  exitOnError: false
});

// Function to check if a file exists
function checkFileExists(filePath, callback) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.error(`File "${filePath}" does not exist: ${err.message}`);
      callback(err);
    } else {
      logger.info(`File "${filePath}" exists`);
      callback(null);
    }
  });
}

// Function to read a file
function readFile(filePath, callback) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      logger.error(`Failed to read file "${filePath}": ${err.message}`);
      callback(err);
    } else {
      logger.info(`Successfully read file "${filePath}`);
      callback(null, data);
    }
  });
}
// Fired when a log file is created
fileRotateTransport.on('new', (filename) => {
  logger.info(`A new log file was created: ${filename}`);
});

// Fired when a log file is rotated
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info(`A log file was rotated. Old filename: ${oldFilename}. New filename: ${newFilename}`);
});

// Fired when a log file is archived
fileRotateTransport.on('archive', (zipFilename) => {
  // Get the directory name of the zipFilename
  const dirname = path.dirname(zipFilename);
  // Construct the new path by joining the dirname with the current date folder
  const newPath = path.join(dirname, getCurrentDate());
  // Replace the logsDir with the new path
  const newFilename = zipFilename.replace(logsDir, newPath);
  logger.info(`A log file was archived: ${newFilename}`);
});

// Fired when a log file is deleted
fileRotateTransport.on('logRemoved', (removedFilename) => {
  // Get the directory name of the removedFilename
  const dirname = path.dirname(removedFilename);
  // Construct the new path by joining the dirname with the current date folder
  const newPath = path.join(dirname, getCurrentDate());
  // Replace the logsDir with the new path
  const newFilename = removedFilename.replace(logsDir, newPath);
  logger.info(`A log file was removed: ${newFilename}`);
});

logger.exitOnError = false;

// Export logger function
module.exports = {
  logger,
  checkFileExists,
  readFile,
  myEmitter
};
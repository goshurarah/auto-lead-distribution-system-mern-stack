const { createLogger, format, transports } = require('winston');
const Transport = require('winston-transport'); // Base class for custom transports
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Custom Transport for Logging to Database
class DatabaseTransport extends Transport {
  async log(info, callback) {
    if (info.level === 'error') {
      try {
        await prisma.log.create({
          data: {
            level: info.level,
            message: info.message,
            timestamp: new Date(info.timestamp),
          },
        });
      } catch (dbError) {
        console.error('Failed to log error to the database:', dbError.message);
      }
    }
    callback();
  }
}

// Create Logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({ format: format.simple() }), // Console transport
    new DatabaseTransport(), // Custom database transport
    new transports.File({
      filename: path.join(__dirname, '../../logs/app.log'), // General log file
      level: 'info',
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'), // Error log file
      level: 'error',
    }),
  ],
});

module.exports = logger;

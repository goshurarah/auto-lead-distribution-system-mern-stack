const jwt = require('jsonwebtoken');
const config = require('../config/config')
const logger = require('../utils/logger');

const checkAuthorization = (context) => {
    const token = context.headers.authorization;
    if (!token) {
        throw new Error('Access denied. No agent authenticated');
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        context.agent = decoded;
    } catch (err) {
        logger.error(`Authorization error: ${err.message}`)
        throw new Error('Invalid token.');
    }
};

module.exports = checkAuthorization;

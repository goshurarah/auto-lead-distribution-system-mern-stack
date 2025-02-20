const jwt = require('jsonwebtoken');
const config = require('../config/config')
const logger = require('../utils/logger');

const checkUser = (context) => {
    const token = context.headers.authorization;
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        let agent=context.agent = decoded;
        return agent.agent
    } catch (err) {
        logger.error(`Agent auth error: ${err.message}`)
        throw new Error('Invalid agent.');
    }
};

module.exports = checkUser;

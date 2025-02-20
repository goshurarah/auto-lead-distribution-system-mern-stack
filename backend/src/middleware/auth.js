const jwt = require('jsonwebtoken');
const config=require('../config/config')
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Access denied. No user authenticated' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error(`Auth error: ${err.message}`)
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;

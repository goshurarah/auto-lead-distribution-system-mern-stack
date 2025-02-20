const express = require('express');
const router = express.Router();
require('dotenv').config();
const logger = require('../../utils/logger');
const jwt = require('jsonwebtoken');

router.get('/connect-ghl', async (req, res) => {
    try {
        const token = req.headers.authorization; // Authorization: Bearer <token>
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }
        // console.log('TOKEN =  ', token)
        let agentId;
        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            agentId = decoded.agent; // Assuming `agent` contains the agentId
        } catch (err) {
            logger.error(`Token verification failed: ${err.message}`);
            return res.status(401).json({ message: 'Invalid authorization token' });
        }
        const options = {
            requestType: "code",
            redirectUri: process.env.REDIRECT_URI,
            clientId: process.env.CLIENT_ID,
            scopes: [
                "contacts.readonly",
                "contacts.write",
                "oauth.write",
                "oauth.readonly",
                "locations.readonly",
                "locations/customValues.readonly",
                "locations/customFields.write",
                "locations/customFields.readonly",
                "locations/customValues.write",
                "users.readonly",
                "companies.readonly"
            ]
        }
        const redURL=`${process.env.MARKETPLACE_URL}?response_type=${options.requestType}&redirect_uri=${options.redirectUri}&client_id=${options.clientId}&scope=${options.scopes.join(" ")}&state=${agentId}`
        return res.json({
            redirectURL:redURL
        })
    } catch (error) {
        logger.error(`Error processing ghl initiate request: ${error.message}`);
        return res.status(500).json({ message: 'Error processing ghl initiate request', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const axios = require('axios');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const logger = require('../../utils/logger');

const prisma = new PrismaClient();

router.get('/oauth/callback', async (req, res) => {
    try {
        const { code, state } = req.query; // Extract the authorization code from the query string
        const agentId = parseInt(state);
        if (!code) {
            return res.status(400).json({ message: 'Authorization code is missing' });
        }
        if (!agentId) {
            return res.status(400).json({ message: 'Agent ID is missing in the callback URL' });
        }

        // Check if a token already exists for this agentId
        const existingToken = await prisma.ghlToken.findFirst({
            where: {
                agentId: agentId
            }
        });

        if (existingToken) {
            return res.redirect(`${process.env.FRONTEND_REDIRECT_URL}/ghl-app`);
        }

        // Your client credentials
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const redirectUri = process.env.REDIRECT_URI;

        // Prepare the request payload
        const data = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: redirectUri,
            user_type: "Location" // Adjust this value if needed
        });

        // Make the POST request to exchange the code for an access token
        const response = await axios.post(
            "https://services.leadconnectorhq.com/oauth/token",
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        // Extract fields from the response
        const {
            access_token,
            token_type,
            expires_in,
            refresh_token,
            scope,
            userType,
            locationId,
            companyId,
            userId
        } = response.data;

        const companyResponse = await axios.get(
            `https://services.leadconnectorhq.com/locations/${locationId}`,
            {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Version": "2021-07-28"
                }
            }
        );

        const { name, email } = companyResponse.data.location;
        // Save the token data in the database
        await prisma.ghlToken.create({
            data: {
                access_token,
                token_type,
                expires_in,
                refresh_token,
                scope,
                userType: userType,
                locationId: locationId || null,
                companyId: companyId || null,
                userId: userId || null,
                agentId: agentId  // Replace with actual agentId if applicable
            },
        });
        // Store company information in GhlCompany table
        await prisma.ghlCompany.create({
            data: {
                agentId: agentId,
                name: name,
                email: email,
                createdAt: new Date(),
            }
        });
        // Respond with the access token or handle it as required
        return res.redirect(`${process.env.FRONTEND_REDIRECT_URL}/ghl-app`);
    } catch (error) {
        logger.error(`Error processing GHL callback: ${error.message}`);
        if (error.response) {
            logger.error(`GHL API error: ${JSON.stringify(error.response.data)}`);
        }
        return res.status(500).json({
            message: 'Error processing GHL callback',
            error: error.message,
            details: error.response?.data || null,
        });
    }
});

module.exports = router;

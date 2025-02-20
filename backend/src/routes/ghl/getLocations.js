const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

router.get('/locations-detail', async (req, res) => {
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
        
        // Check if agentId is provided in the query
        if (!agentId) {
            return res.status(400).json({ message: 'Agent ID is required' });
        }

        // Fetch company data by agentId
        const company = await prisma.ghlCompany.findFirst({
            where: {
                agentId: parseInt(agentId), // Convert agentId to integer
            }
        });

        // If no company found for the given agentId
        if (!company) {
            return res.status(404).json({ message: 'Company not found for the given agent ID' });
        }

        // Return company data in the response
        return res.status(200).json({
            message: 'Company data retrieved successfully',
            company: company
        });
    } catch (error) {
        console.error(`Error fetching company: ${error.message}`);
        return res.status(500).json({
            message: 'Error fetching company data',
            error: error.message
        });
    }
});

module.exports = router;

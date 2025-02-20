const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const nodemailer = require('nodemailer');
const prisma = new PrismaClient();
const config = require('../../config/config');
const logger = require('../../utils/logger');

const formatFieldName = (fieldName) => {
    return fieldName
        .toLowerCase()
        .replace(/\s+/g, '_');
};

router.post('/find-agents-by-lead-email', async (req, res) => {
    try {
        // Format request body fields
        const formattedBody = Object.keys(req.body).reduce((acc, key) => {
            const formattedKey = formatFieldName(key);
            acc[formattedKey] = req.body[key];
            return acc;
        }, {});

        // Extract the email from the formatted body
        const email = formattedBody.email; // Assuming the email field in the payload is "email"

        // Check if the email exists in the leads table and include the associated agents
        const lead = await prisma.lead.findFirst({
            where: {
                email: email,  // Check if the email exists
            },
            include: {
                agentLeads: {
                    include: {
                        agent: true, // Include associated agent data
                    },
                },
            },
        });

        // If no lead is found with the provided email, return a 404 response
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found for this email' });
        }

        // Retrieve the agents associated with the lead
        const agents = lead.agentLeads.map((agentLead) => agentLead.agent).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // If agents are found, return agent details in the response
        if (agents.length > 0) {
            return res.status(200).json({ agents: agents });
        } else {
            return res.status(404).json({ message: 'No agents found for this lead' });
        }

    } catch (error) {
        // Log and return error if an issue occurs
        logger.error(`Error processing of find agents by lead email webhook: ${error.message}`);
        return res.status(500).json({ message: 'Error processing of find agents by lead email webhook', error: error.message });
    }
});

module.exports = router;

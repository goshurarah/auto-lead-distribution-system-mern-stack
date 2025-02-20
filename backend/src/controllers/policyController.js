
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const policyController = {
    createPolicy: async ({ name, description }) => {
        try {
            const policy = await prisma.policy.create({
                data: { name, description },
            });
            logger.info(`Policy created: ${name}`);
            return policy;
        } catch (error) {
            logger.error(`Create policy failed: ${error.message}`);
            throw new Error('Failed to create policy');
        }
    },

    // Update an existing policy by ID
    updatePolicy: async ({ id, name, description }) => {
        try {
            const policy = await prisma.policy.update({
                where: { id },
                data: { name, description },
            });
            logger.info(`Policy updated: ${name}`);
            return policy;
        } catch (error) {
            logger.error(`Update policy failed: ${error.message}`);
            throw new Error('Failed to update policy');
        }
    },

    // Delete a policy by ID
    deletePolicy: async ({ id }) => {
        try {
            await prisma.policy.delete({
                where: { id },
            });
            logger.info(`Policy deleted with ID: ${id}`);
            return true;
        } catch (error) {
            logger.error(`Delete policy failed: ${error.message}`);
            throw new Error('Failed to delete policy');
        }
    },

    // Get a policy by ID
    getPolicyById: async ({ id }) => {
        try {
            const policy = await prisma.policy.findUnique({
                where: { id },
                include: { agents: true },  // If you want to include related agents
            });
            return policy;
        } catch (error) {
            logger.error(`Get policy by ID failed: ${error.message}`);
            throw new Error('Failed to retrieve policy');
        }
    },

    // Get all policies
    getAllPolicies: async () => {
        try {
            const policies = await prisma.policy.findMany({
                include: { agents: true },  // If you want to include related agents
            });
            return policies;
        } catch (error) {
            logger.error(`Get all policies failed: ${error.message}`);
            throw new Error('Failed to retrieve policies');
        }
    },
};

module.exports = policyController;

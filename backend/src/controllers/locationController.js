
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const locationController = {
    createLocation: async ({ name }) => {
        try {
            const location = await prisma.location.create({
                data: { name },
            });
            logger.info(`Location created: ${name}`);
            return location;
        } catch (error) {
            logger.error(`Create location failed: ${error.message}`);
            throw new Error('Failed to create location');
        }
    },

    // Update an existing location by ID
    updateLocation: async ({ id, name }) => {
        try {
            const location = await prisma.location.update({
                where: { id },
                data: { name },
            });
            logger.info(`Location updated: ${name}`);
            return location;
        } catch (error) {
            logger.error(`Update location failed: ${error.message}`);
            throw new Error('Failed to update location');
        }
    },

    // Delete a location by ID
    deleteLocation: async ({ id }) => {
        try {
            await prisma.location.delete({
                where: { id },
            });
            logger.info(`Location deleted with ID: ${id}`);
            return true;
        } catch (error) {
            logger.error(`Delete location failed: ${error.message}`);
            throw new Error('Failed to delete location');
        }
    },

    getLocationById: async ({ id }) => {
        try {
            const location = await prisma.location.findUnique({
                where: { id },
                include: { agents: true },
            });
            return location;
        } catch (error) {
            logger.error(`Get location by ID failed: ${error.message}`);
            throw new Error('Failed to retrieve location');
        }
    },
    getAllLocations: async () => {
        try {
            const locations = await prisma.location.findMany({
                include: { agents: true },
            });
            return locations;
        } catch (error) {
            logger.error(`Get all locations failed: ${error.message}`);
            throw new Error('Failed to retrieve locations');
        }
    },
}

module.exports = locationController;

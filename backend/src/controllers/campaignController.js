const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const PER_PAGE = 50

const campaignController = {
  getAllCampaigns: async (page = 1) => {
    try {
      const totalCampaigns = await prisma.campaign.count();
      const totalPages = Math.ceil(totalCampaigns / PER_PAGE) || 1;

      // Ensure page is within valid range
      const currentPage = Math.max(1, Math.min(page, totalPages)); 

      const campaigns = await prisma.campaign.findMany({
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
        orderBy: { id: 'asc' } // Order campaigns by ID
      });

      logger.info('Fetched campaigns successfully with pagination');
      return {
        campaigns,
        currentPage,
        totalPages,
        totalCampaigns
      };
    } catch (error) {
      logger.error(`getCampaigns error: ${error.message}`);
      throw new Error('Failed to fetch campaigns');
    }
  },
  getCampaigns: async (agentId, page = 1) => {
    try {
      const totalCampaigns = await prisma.campaign.count({ where: { agentId } });
      const totalPages = Math.ceil(totalCampaigns / PER_PAGE) || 1;

      // Ensure page is within valid range
      const currentPage = Math.max(1, Math.min(page, totalPages)); 

      const campaigns = await prisma.campaign.findMany({
        where: { agentId },
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
        orderBy: { id: 'asc' } // Order campaigns by ID
      });

      logger.info('Fetched campaigns successfully with pagination');
      return {
        campaigns,
        currentPage,
        totalPages,
        totalCampaigns
      };
    } catch (error) {
      logger.error(`getCampaigns error: ${error.message}`);
      throw new Error('Failed to fetch campaigns');
    }
  },
  getCampaign: async (agentId, id) => {
    try {
      const campaign = await prisma.campaign.findUnique({ where: { id: parseInt(id) } , where: { agentId: agentId } });
      if (!campaign) throw new Error('Campaign not found');
      logger.info(`Fetched campaign with ID: ${id}`);
      return campaign;
    } catch (error) {
      logger.error(`getCampaign error: ${error.message}`);
      throw new Error('Failed to fetch campaign');
    }
  },
  createAdminCampaign: async (data) => {
    try {
      const campaign = await prisma.campaign.create({
        data: {
          ...data,
        },
      });
      logger.info(`Campaign created with ID: ${campaign.id}`);
      return campaign;
    } catch (error) {
      logger.error(`Campaign creation failed: ${error.message}`);
      throw new Error('Campaign creation failed');
    }
  },
  createCampaign: async (data, agentId) => {
    try {
      const campaign = await prisma.campaign.create({
        data: {
          ...data,
          agentId: agentId,  // Ensure agentId is passed and saved
        },
      });
      logger.info(`Campaign created with ID: ${campaign.id}`);
      return campaign;
    } catch (error) {
      logger.error(`Campaign creation failed: ${error.message}`);
      throw new Error('Campaign creation failed');
    }
  },
  updateCampaign: async (agentId, id, data) => {
    try {
      const updatedCampaign = await prisma.campaign.update({
        where: { id: parseInt(id), agentId: agentId, },
        data,
      });
      logger.info(`Updated campaign with ID: ${id}`);
      return updatedCampaign;
    } catch (error) {
      logger.error(`Update campaign failed: ${error.message}`);
      throw new Error('Failed to update campaign');
    }
  },
  deleteCampaign: async (agentId, id) => {
    try {
      const deletedCampaign = await prisma.campaign.delete({ where: { id: parseInt(id), agentId: agentId, } });
      logger.info(`Deleted campaign with ID: ${id}`);
      return deletedCampaign;
    } catch (error) {
      logger.error(`Error deleting campaign with ID ${id}: ${error.message}`);
      throw new Error('Failed to delete campaign');
    }
  },
  filterCampaigns: async (filters = {}, page = 1) => {
    try {
      if (Object.keys(filters).some(key => filters[key] === "")) {
        logger.info('No filters provided, returning empty result');
        return {
          campaigns: [],
          currentPage: 1,
          totalPages: 1,
          totalCampaigns: 0,
        };
      }
      // Extract filtering criteria from `filters`
      const {
        name,
        targetedAudience,
        leadsCount,
        createdAt,
        endTime,
        toggleStatus,
      } = filters;
      // Build where clause dynamically based on filters
      const where = {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(targetedAudience && { targetedAudience: { contains: targetedAudience, mode: 'insensitive' } }),
        ...(toggleStatus !== undefined && { toggleStatus: { equals: toggleStatus } }),
        ...(leadsCount !== undefined && { leadsCount: { equals: leadsCount } }),
        ...(createdAt && endTime && { createdAt: { gte: new Date(createdAt), lte: new Date(endTime) } }),
      };
  
      // Pagination setup
      const totalCampaigns = await prisma.campaign.count({ where });
      const totalPages = Math.ceil(totalCampaigns / PER_PAGE) || 1;
      const currentPage = Math.max(1, Math.min(page, totalPages));
  
      // Fetch filtered campaigns with pagination
      const campaigns = await prisma.campaign.findMany({
        where,
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
      });
    
      logger.info('Filtered campaigns successfully with pagination');
      return {
        campaigns: campaigns,
        currentPage,
        totalPages,
        totalCampaigns,
      };
    } catch (error) {
      logger.error(`filterCampaigns error: ${error.message}`);
      throw new Error('Failed to fetch filtered campaigns');
    }
  },
};

module.exports = campaignController;

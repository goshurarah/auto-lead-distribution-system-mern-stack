const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const PER_PAGE = 50

const agentController = {
  getAgents: async (page = 1) => {
    try {
      const totalAgents = await prisma.agent.count({ where: { role: "USER" } });
      const totalPages = Math.ceil(totalAgents / PER_PAGE) || 1;

      // Ensure page is within valid range
      const currentPage = Math.max(1, Math.min(page, totalPages));

      const agents = await prisma.agent.findMany({
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
        where: { role: "USER" },
        // orderBy: { id: 'asc' }, // Order agents by ID
        orderBy: [
          { priority: 'asc' }, // High priority (low number) first
          { remainingWeight: 'desc' }, // Assign based on weight next
          { lastAssignedDate: 'asc' }, // Round-robin for agents with same priority/weight
        ],
        include: {
          campaigns: true,
          agentLeads: {
            include: {
              lead: true, // Assuming `policy` is the relation name in AgentPolicy
            },
          },
          agentPolicies: {
            include: {
              policy: true, // Assuming `policy` is the relation name in AgentPolicy
            },
          },
          agentLocations: {
            include: {
              location: true, // Assuming `location` is the relation name in AgentLocation
            },
          },
        },
      });

      // // Map data to remove join table structure in the response
      // const structuredAgents = agents.map(agent => ({
      //   ...agent,
      //   leads: agent.agentLeads.map(al => al.lead),
      //   policies: agent.agentPolicies.map(ap => ap.policy),
      //   locations: agent.agentLocations.map(al => al.location),
      // }));
      const structuredAgents = await Promise.all(
        agents.map(async (agent) => {
          const now = new Date();
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          const dailyLeadsCount = await prisma.agentLeads.count({
            where: {
              agentId: agent.id,
              createdAt: { gte: startOfToday },
            },
          });

          const monthlyLeadsCount = await prisma.agentLeads.count({
            where: {
              agentId: agent.id,
              createdAt: { gte: startOfMonth },
            },
          });

          return {
            ...agent,
            leads: agent.agentLeads.map((al) => al.lead),
            policies: agent.agentPolicies.map((ap) => ap.policy),
            locations: agent.agentLocations.map((al) => al.location),
            dailyLeadsCount: dailyLeadsCount,
            monthlyLeadsCount: monthlyLeadsCount,
          };
        })
      );
      logger.info('Fetched agents successfully with pagination');
      return {
        agents: structuredAgents,
        currentPage,
        totalPages,
        totalAgents
      };
    } catch (error) {
      logger.error(`getAgents error: ${error.message}`);
      throw new Error('Failed to fetch agents');
    }
  },
  getAgent: async (id) => {
    try {
      const agent = await prisma.agent.findUnique({
        where: { id: parseInt(id) }, include: {
          campaigns: true, // Include associated campaigns
          agentLeads: {
            include: {
              lead: true, // Assuming `policy` is the relation name in AgentPolicy
            },
          },
          agentPolicies: {
            include: {
              policy: true, // Assuming `policy` is the relation name in AgentPolicy
            },
          },
          agentLocations: {
            include: {
              location: true, // Assuming `location` is the relation name in AgentLocation
            },
          },
        },
      });
      if (!agent) throw new Error('Agent not found');
      const structuredAgent = {
        ...agent,
        leads: agent.agentLeads.map(al => al.lead),
        policies: agent.agentPolicies.map(ap => ap.policy),
        locations: agent.agentLocations.map(al => al.location),
      };
      logger.info(`Fetched agent with ID: ${id}`);
      return structuredAgent;
    } catch (error) {
      logger.error(`getAgent error: ${error.message}`);
      throw new Error('Failed to fetch agent');
    }
  },
  createAgent: async (data, userId) => {
    try {
      // Include userId in the agent data
      const agent = await prisma.agent.create({
        data: {
          ...data,
          userId: userId,  // Ensure userId is passed and saved
        },
      });
      logger.info(`Agent created with ID: ${agent.id}`);
      return agent;
    } catch (error) {
      logger.error(`Creating agent failed: ${error.message}`);
      throw new Error('Creating agent failed');
    }
  },
  updateAgent: async (id, data) => {
    try {
      const agentId = parseInt(id);
      let updatedData = { ...data };

      // Handle globalCap and remainingCap calculation
      if ('globalCap' in data) {
        const previousAgentData = await prisma.agent.findUnique({
          where: { id: agentId },
          select: {
            globalCap: true,
            remainingCap: true,
          },
        });

        if (!previousAgentData) {
          throw new Error(`Agent with ID ${id} not found`);
        }

        const globalCapResult = data.globalCap - previousAgentData.globalCap;
        updatedData.remainingCap = previousAgentData.remainingCap + globalCapResult;
      }

      // Update the agent record (excluding relational fields)
      const { policies, locations, ...agentData } = updatedData;
      const updatedAgent = await prisma.agent.update({
        where: { id: agentId },
        data: agentData,
      });

      // Update pivot table for policies if provided
      if (policies) {
        // Clear existing relationships
        await prisma.agentPolicies.deleteMany({ where: { agentId } });

        // Create new relationships
        const policyData = policies.map(policyId => ({
          agentId,
          policyId,
        }));
        await prisma.agentPolicies.createMany({ data: policyData });
        logger.info(`Updated policies for agent with ID: ${id}`);
      }

      // Update pivot table for locations if provided
      if (locations) {
        // Clear existing relationships
        await prisma.agentLocations.deleteMany({ where: { agentId } });

        // Create new relationships
        const locationData = locations.map(locationId => ({
          agentId,
          locationId,
        }));
        await prisma.agentLocations.createMany({ data: locationData });
        logger.info(`Updated locations for agent with ID: ${id}`);
      }
      return updatedAgent;
    } catch (error) {
      logger.error(`Update agent failed: ${error.message}`);
      throw new Error('Failed to update agent');
    }
  },
  deleteAgent: async (agentId, id) => {
    try {
      const deletedAgent = await prisma.agent.delete({ where: { id: parseInt(id), agentId: agentId } });
      logger.info(`Deleted agent with ID: ${id}`);
      return deletedAgent;
    } catch (error) {
      logger.error(`Error deleting agent with ID ${id}: ${error.message}`);
      throw new Error('Failed to delete agent');
    }
  },
  filterAgents: async (filters = {}, page = 1) => {
    try {
      if (Object.keys(filters).some(key => filters[key] === "")) {
        logger.info('No filters provided, returning empty result');
        return {
          agents: [],
          currentPage: 1,
          totalPages: 1,
          totalAgents: 0,
        };
      }
      // Extract filtering criteria from `filters`
      const {
        email,
        firstName,
        lastName,
        role = 'USER',
        phoneNumber,
        npnNumber,
        licenseNo,
        toggleStatus,

        globalCap,
        monthlyCap,
        dailyCap,
        remainingCap,
        priority,
        weight,

        assignedLeads,
        createdAtStart,
        createdAtEnd,
        locations = [],
        policies = [],
      } = filters;
      // Build where clause dynamically based on filters
      const where = {
        ...(email && { email: { equals: email } }),
        ...(firstName && { firstName: { contains: firstName, mode: 'insensitive' } }),
        ...(lastName && { lastName: { contains: lastName, mode: 'insensitive' } }),
        ...(role && { role: { equals: role } }),
        ...(phoneNumber && { phoneNumber: { contains: phoneNumber, mode: 'insensitive' } }),
        ...(npnNumber && { npnNumber: { contains: npnNumber, mode: 'insensitive' } }),
        ...(licenseNo && { licenseNo: { contains: licenseNo, mode: 'insensitive' } }),
        ...(toggleStatus !== undefined && { toggleStatus: { equals: toggleStatus } }),

        ...(globalCap !== undefined && { globalCap: { equals: globalCap } }),
        ...(monthlyCap !== undefined && { monthlyCap: { equals: monthlyCap } }),
        ...(dailyCap !== undefined && { dailyCap: { equals: dailyCap } }),
        ...(remainingCap !== undefined && { remainingCap: { equals: remainingCap } }),
        ...(priority !== undefined && { priority: { equals: priority } }),
        ...(weight !== undefined && { weight: { equals: weight } }),

        ...(assignedLeads !== undefined && { assignedLeads: { equals: assignedLeads } }),
        ...(createdAtStart && createdAtEnd && { createdAt: { gte: new Date(createdAtStart), lte: new Date(createdAtEnd) } }),

        ...(locations.length > 0 && {
          agentLocations: { some: { locationId: { in: locations } } },
        }),
        ...(policies.length > 0 && {
          agentPolicies: { some: { policyId: { in: policies } } },
        }),
      };

      // Pagination setup
      const totalAgents = await prisma.agent.count({ where });
      const totalPages = Math.ceil(totalAgents / PER_PAGE) || 1;
      const currentPage = Math.max(1, Math.min(page, totalPages));

      // Fetch filtered agents with pagination
      const agents = await prisma.agent.findMany({
        where,
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
        include: {
          campaigns: true,
          agentLeads: {
            include: {
              lead: true,
            },
          },
          agentPolicies: {
            include: {
              policy: true,
            },
          },
          agentLocations: {
            include: {
              location: true,
            },
          },
        },
      });

      // Restructure the agents for a cleaner response
      const structuredAgents = agents.map(agent => ({
        ...agent,
        leads: agent.agentLeads.map(al => al.lead),
        policies: agent.agentPolicies.map(ap => ap.policy),
        locations: agent.agentLocations.map(al => al.location),
      }));

      logger.info('Filtered agents successfully with pagination');
      return {
        agents: structuredAgents,
        currentPage,
        totalPages,
        totalAgents,
      };
    } catch (error) {
      logger.error(`filterAgents error: ${error.message}`);
      throw new Error('Failed to fetch filtered agents');
    }
  },

};

module.exports = agentController;

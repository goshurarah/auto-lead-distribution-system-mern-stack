const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const prisma = new PrismaClient();

const PER_PAGE = 50
const leadController = {
  getAllLeads: async (page = 1) => {
    try {
      const totalLeads = await prisma.lead.count();
      const totalPages = Math.ceil(totalLeads / PER_PAGE) || 1;

      // Ensure page is within valid range
      const currentPage = Math.max(1, Math.min(page, totalPages));

      const leads = await prisma.lead.findMany({
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
        orderBy: { id: 'asc' },
        include: {
          agentLeads: {
            include: {
              agent: true
            },
          },
        }
      });
      const transformedLeads = leads.map((lead) => ({
        ...lead,
        agents: lead.agentLeads.map((agentLead) => agentLead.agent),
      }));
      logger.info('Fetched leads successfully with pagination');
      return {
        leads: transformedLeads,
        currentPage,
        totalPages,
        totalLeads
      };
    } catch (error) {
      logger.error(`getAllLeads error: ${error.message}`);
      throw new Error('Failed to fetch all leads');
    }
  },
  getLeads: async (agentId, page = 1) => {
    try {
      const totalLeads = await prisma.agentLeads.count({
        where: { agentId }
      });
      // const totalLeads = await prisma.lead.count({ where: { agentId } });
      const totalPages = Math.ceil(totalLeads / PER_PAGE) || 1;

      // Ensure page is within valid range
      const currentPage = Math.max(1, Math.min(page, totalPages));

      const agentLeads = await prisma.agentLeads.findMany({
        where: { agentId },
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
        orderBy: { id: 'asc' },
        include: {
          lead: true  // Fetch the related lead data
        }
      });
      const leads = agentLeads.map(record => record.lead);
      logger.info('Fetched leads successfully with pagination');
      return {
        leads,
        currentPage,
        totalPages,
        totalLeads
      };
    } catch (error) {
      logger.error(`getLeads error: ${error.message}`);
      throw new Error('Failed to fetch leads');
    }
  },
  getLead: async (userId, id) => {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: parseInt(id), where: { userId: userId } } });
      if (!lead) throw new Error('Lead not found');
      logger.info(`Fetched lead with ID: ${id}`);
      return lead;
    } catch (error) {
      logger.error(`getLead error: ${error.message}`);
      throw new Error('Failed to fetch lead');
    }
  },
  updateLead: async (agentId, id, data) => {
    try {
      const agentLead = await prisma.agentLeads.findFirst({
        where: { agentId: parseInt(agentId), leadId: parseInt(id) }
      });
      if (!agentLead) {
        throw new Error(`Lead ID ${id} does not belong to Agent ID ${agentId}`);
      }
      const updatedLead = await prisma.lead.update({
        where: { id: parseInt(id) },
        data,
      });
      logger.info(`Updated lead with ID: ${id}`);
      return updatedLead;
    } catch (error) {
      logger.error(`Update lead failed: ${error.message}`);
      throw new Error('Failed to update lead');
    }
  },
  deleteLead: async (agentId, id) => {
    try {
      const agentLead = await prisma.agentLeads.findFirst({
        where: { agentId: parseInt(agentId), leadId: parseInt(id) }
      });
      if (!agentLead) {
        throw new Error(`Lead ID ${id} does not belong to Agent ID ${agentId}`);
      }
      const agent = await prisma.agent.findFirst({
        where: { id: agentId },
      });
      await prisma.agent.update({
        where: { id: agentId },
        data: {
          assignedLeads: agent.assignedLeads - 1,
          remainingCap: agent.remainingCap + 1,
        },
      });
      await prisma.agentLeads.delete({
        where: { id: agentLead.id }
      });
      const deletedLead = await prisma.lead.delete({ where: { id: parseInt(id) } });
      logger.info(`Deleted lead with ID: ${id}`);
      return deletedLead;
    } catch (error) {
      logger.error(`Error deleting lead with ID ${id}: ${error.message}`);
      throw new Error('Failed to delete lead');
    }
  },
  filterLeads: async (filters = {}, page = 1) => {
    try {
      if (Object.keys(filters).some(key => filters[key] === "")) {
        logger.info('No filters provided, returning empty result');
        return {
          leads: [],
          currentPage: 1,
          totalPages: 1,
          totalLeads: 0,
        };
      }
      // Extract filtering criteria from `filters`
      const {
        name,
        phone,
        email,
        location,
        insuranceType,
        startInsurance,
        endInsurance,
        createdAt,
        first_name,
        last_name,
        tags,
        city,
        state,
        country,
        timezone,
        postal_code,
        full_address,
        contact_id,
        spouse_gender,
        plan_carrier_name,
        aor_agent_name,
        aor_agent_npn,
        ip_address,
        spouse_dob,
        spouse_ssn,
        plan_type,
        your_gender,
      } = filters;
      // Build where clause dynamically based on filters
      const where = {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(phone && { phone: { contains: phone, mode: 'insensitive' } }),
        ...(email && { email: { equals: email } }),
        ...(location && { location: { contains: location, mode: 'insensitive' } }),
        ...(insuranceType && { insuranceType: { equals: insuranceType } }),
        ...(startInsurance && { startInsurance: { gte: new Date(startInsurance) } }),
        ...(endInsurance && { endInsurance: { lte: new Date(endInsurance) } }),
        ...(createdAt && { createdAt: { equals: new Date(createdAt) } }),
        ...(first_name && { first_name: { contains: first_name, mode: 'insensitive' } }),
        ...(last_name && { last_name: { contains: last_name, mode: 'insensitive' } }),
        ...(tags && { tags: { contains: tags, mode: 'insensitive' } }),
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(state && { state: { contains: state, mode: 'insensitive' } }),
        ...(country && { country: { contains: country, mode: 'insensitive' } }),
        ...(timezone && { timezone: { contains: timezone, mode: 'insensitive' } }),
        ...(postal_code && { postal_code: { contains: postal_code, mode: 'insensitive' } }),
        ...(full_address && { full_address: { contains: full_address, mode: 'insensitive' } }),
        ...(contact_id && { contact_id: { equals: contact_id } }),
        ...(spouse_gender && { spouse_gender: { equals: spouse_gender } }),
        ...(plan_carrier_name && { plan_carrier_name: { contains: plan_carrier_name, mode: 'insensitive' } }),
        ...(aor_agent_name && { aor_agent_name: { contains: aor_agent_name, mode: 'insensitive' } }),
        ...(aor_agent_npn && { aor_agent_npn: { contains: aor_agent_npn, mode: 'insensitive' } }),
        ...(ip_address && { ip_address: { equals: ip_address } }),
        ...(spouse_dob && { spouse_dob: { equals: new Date(spouse_dob) } }),
        ...(spouse_ssn && { spouse_ssn: { equals: spouse_ssn } }),
        ...(plan_type && { plan_type: { equals: plan_type } }),
        ...(your_gender && { your_gender: { equals: your_gender } }),
      };


      // Pagination setup
      const totalLeads = await prisma.lead.count({ where });
      const totalPages = Math.ceil(totalLeads / PER_PAGE) || 1;
      const currentPage = Math.max(1, Math.min(page, totalPages));

      // Fetch filtered leads with pagination
      const leads = await prisma.lead.findMany({
        where,
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
        include: {
          agentLeads: {
            include: {
              agent: true
            },
          },
        }
      });
      const transformedLeads = leads.map((lead) => ({
        ...lead,
        agents: lead.agentLeads.map((agentLead) => agentLead.agent),
      }));


      logger.info('Filtered leads successfully with pagination');
      return {
        leads: transformedLeads,
        currentPage,
        totalPages,
        totalLeads,
      };
    } catch (error) {
      logger.error(`filterLeads error: ${error.message}`);
      throw new Error('Failed to fetch filtered leads');
    }
  },
};

module.exports = leadController;

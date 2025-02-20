const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const logger = require('../../utils/logger');
const axios = require('axios');
const sendEmailToAgent = require('../../emails/emailToAgent');
const config = require("../../config/config")


const formatFieldName = (fieldName) => {
  return fieldName
    .toLowerCase()
    .replace(/\s+/g, '_');
};

let MAX_LEADS_PER_AGENT = config.max_leads

// Function to create a contact in GHL
const createGHLContact = async (formattedBody, ghlDetails) => {
  const ghlContactData = {
    firstName: formattedBody.first_name || null,
    lastName: formattedBody.last_name || null,
    name: formattedBody.full_name || null,
    email: formattedBody.email || null,
    phone: formattedBody.phone || null,
    address1: formattedBody.full_address || null,
    city: formattedBody.city || null,
    state: formattedBody.state || null,
    postalCode: formattedBody.postal_code || null,
    locationId: ghlDetails.locationId,
    country: formattedBody.country || "US",
    tags: formattedBody.tags || [],
  };

  try {
    await axios.post(
      "https://services.leadconnectorhq.com/contacts/",
      ghlContactData,
      {
        headers: {
          Authorization: `Bearer ${ghlDetails.access_token}`,
          Version: "2021-07-28",
        },
      }
    );
    logger.info(`Contact created in GHL for locationId ${ghlDetails.locationId}`);
  } catch (error) {
    logger.error(`Failed to create contact in GHL: ${error.message}`);
    if (error.response) {
      logger.error(`GHL API error: ${JSON.stringify(error.response.data)}`);
    }
  }
};

router.post('/leads-webhook', async (req, res) => {
  try {
    const formattedBody = Object.keys(req.body).reduce((acc, key) => {
      const formattedKey = formatFieldName(key);
      acc[formattedKey] = req.body[key];
      return acc;
    }, {});
    // Find an available agent using the same round-robin logic
    const agents = await prisma.agent.findMany({
      where: {
        toggleStatus: true,
        role: 'USER',
        remainingCap: { gt: 0 }, // Only agents with remaining capacity
        agentLocations: {
          some: {
            location: {
              name: {
                equals: formattedBody.state, // Match formattedBody.state with location name
                mode: 'insensitive',        // Enable case-insensitive matching
              },
            },
          },
        },
      },
      orderBy: [
        { priority: 'asc' }, // High priority (low number) first
        { remainingWeight: 'desc' }, // Assign based on weight next
        { lastAssignedDate: 'asc' }, // Round-robin for agents with same priority/weight
      ],
    });

    const allAgents = agents
    // return res.json({ agents: allAgents });

    let leadData = {
      first_name: formattedBody.first_name ?? null,
      last_name: formattedBody.last_name ?? null,
      name: formattedBody.full_name ?? null,
      email: formattedBody.email ?? null,
      phone: formattedBody.phone ?? null,
      tags: formattedBody.tags ?? null,
      city: formattedBody.city ?? null,
      state: formattedBody.state ?? null,
      country: formattedBody.country ?? null,
      timezone: formattedBody.timezone ?? null,
      postal_code: formattedBody.postal_code ?? null,
      full_address: formattedBody.full_address ?? null,
      contact_id: formattedBody.contact_id ?? null,
      spouse_gender: formattedBody.spouse_gender ?? null,
      plan_carrier_name: formattedBody.plan_carrier_name ?? null,
      aor_agent_name: formattedBody.aor_agent_name ?? null,
      aor_agent_npn: formattedBody.aor_agent_npn ?? null,
      ip_address: formattedBody.ip_address ?? null,
      spouse_ssn: formattedBody.spouse_ssn ?? null,
      plan_type: formattedBody.plan_type ?? null,
      your_gender: formattedBody.spouse_gender ?? null,
      // lead_response: formattedBody ?? null,
    };

    let assignedAgent = null;
    for (const agent of allAgents) {
      // Fetch daily and monthly assigned lead counts
      const dailyLeadsCount = await prisma.agentLeads.count({
        where: {
          agentId: agent.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of the day
          },
        },
      });

      const monthlyLeadsCount = await prisma.agentLeads.count({
        where: {
          agentId: agent.id,
          createdAt: {
            gte: new Date(new Date().setDate(1)), // Start of the month
          },
        },
      });

      // Check daily and monthly caps
      if (
        (agent.dailyCap && dailyLeadsCount >= agent.dailyCap) || // Check dailyCap
        (agent.monthlyCap && monthlyLeadsCount >= agent.monthlyCap) || // Check monthlyCap
        !(agent.remainingCap > 0 && agent.remainingWeight > 0) // Check remainingCap and remainingWeight
      ) {
        continue; // Skip this agent if any condition fails
      }

      // Assign the lead to this agent
      assignedAgent = agent;
      break;
    }
    // return res.json({ agents: assignedAgent });

    if (allAgents.length > 0) {
      if (assignedAgent) {
        const newLead = await prisma.lead.create({
          data: leadData,
        });
        await prisma.agentLeads.create({
          data: {
            agentId: assignedAgent.id,
            leadId: newLead.id,
          },
        });

        await prisma.rawLeadResponse.create({
          data: {
            leadId: newLead.id,
            leadResponse: formattedBody ?? null,
          },
        });

        // Update agent's remaining caps and weight
        await prisma.agent.update({
          where: { id: assignedAgent.id },
          data: {
            lastAssignedDate: new Date(),
            assignedLeads: assignedAgent.assignedLeads + 1,
            remainingCap: assignedAgent.remainingCap - 1,
            remainingWeight: assignedAgent.remainingWeight - 1,
          },
        });

        // Reset weight
        if (assignedAgent.remainingWeight - 1 === 0 || assignedAgent.remainingCap - 1 === 0) {
          await prisma.agent.update({
            where: { id: assignedAgent.id },
            data: { remainingWeight: assignedAgent.weight },
          });
        }
      }
      let responseData = {
        agentId: assignedAgent.agentId,
        name: assignedAgent.name,
        email: assignedAgent.email,
        npnNumber: assignedAgent.npnNumber,
        licenseNo: assignedAgent.licenseArea,
        assignedLeads: assignedAgent.assignedLeads,
        policyStatus: assignedAgent.policyStatus,
        activeStatus: assignedAgent.toggleStatus
      }
      if (formattedBody.campaign_uuid) {
        const campaignUUID = formattedBody.campaign_uuid
        await prisma.campaign.update({
          where: { campaign_uuid: campaignUUID },
          data: {
            agentId: assignedAgent.id
          },
        });
      }

      res.json({ agent: responseData });

      // Get GHL details and create a contact
      const ghlDetails = await prisma.ghlToken.findFirst({
        where: { agentId: assignedAgent.id },
      });
      if (ghlDetails && ghlDetails.access_token && ghlDetails.locationId) {
        await createGHLContact(formattedBody, ghlDetails);
      } else {
        logger.error(`GhlDetails Not found against this agend ID =${assignedAgent.id}`);
      }

      // send data into agent webhook url
      if (assignedAgent.webhook_url !== null) {
        try {
          await axios.post(assignedAgent.webhook_url, req.body, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          logger.info(`Data successfully sent to webhook: ${assignedAgent.webhook_url}`);
        } catch (error) {
          logger.error(`Failed to send data to this webhook=${assignedAgent.webhook_url}: ${error.message}`);
        }
      }
      // send email to that agent that have assigned a lead
      await sendEmailToAgent(assignedAgent.email, newLead.id);
    } else {
      // If no agent is available, create the lead without assigning it
      newLead = await prisma.lead.create({
        data: {
          ...leadData,
          status: "UnAssigned"
        },
      });
      await prisma.rawLeadResponse.create({
        data: {
          leadId: newLead.id,
          leadResponse: formattedBody ?? null,
        },
      });
      res.json({ message: "No any agent available for this state" });
    }

  } catch (error) {
    logger.error('Error creating lead:', error.message);
    res.status(500).json({ message: 'Error creating lead', error: error.message });
  }
});

module.exports = router;

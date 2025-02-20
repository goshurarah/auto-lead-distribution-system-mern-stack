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

router.post('/lead-update', async (req, res) => {
  try {
    const formattedBody = Object.keys(req.body).reduce((acc, key) => {
      const formattedKey = formatFieldName(key);
      acc[formattedKey] = req.body[key];
      return acc;
    }, {});

    // Check if a lead with the given email exists
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: formattedBody.email,
      },
    });

    if (!existingLead) {
      return res.status(404).json({ message: 'Lead with the provided email does not exist.' });
    }

    // Update the existing lead with new data
    const updatedLead = await prisma.lead.update({
      where: {
        id: existingLead.id,
      },
      data: {
        first_name: formattedBody.first_name ?? existingLead.first_name,
        last_name: formattedBody.last_name ?? existingLead.last_name,
        name: formattedBody.full_name ?? existingLead.name,
        email: formattedBody.email ?? existingLead.email,
        phone: formattedBody.phone ?? existingLead.phone,
        tags: formattedBody.tags ?? existingLead.tags,
        city: formattedBody.city ?? existingLead.city,
        state: formattedBody.state ?? existingLead.state,
        country: formattedBody.country ?? existingLead.country,
        timezone: formattedBody.timezone ?? existingLead.timezone,
        postal_code: formattedBody.postal_code ?? existingLead.postal_code,
        full_address: formattedBody.full_address ?? existingLead.full_address,
        contact_id: formattedBody.contact_id ?? existingLead.contact_id,
        spouse_gender: formattedBody.spouse_gender ?? existingLead.spouse_gender,
        plan_carrier_name: formattedBody.plan_carrier_name ?? existingLead.plan_carrier_name,
        aor_agent_name: formattedBody.aor_agent_name ?? existingLead.aor_agent_name,
        aor_agent_npn: formattedBody.aor_agent_npn ?? existingLead.aor_agent_npn,
        ip_address: formattedBody.ip_address ?? existingLead.ip_address,
        spouse_ssn: formattedBody.spouse_ssn ?? existingLead.spouse_ssn,
        plan_type: formattedBody.plan_type ?? existingLead.plan_type,
        your_gender: formattedBody.spouse_gender ?? existingLead.your_gender,
      },
    });

    // Log the successful update
    logger.info(`Lead updated successfully for email: ${formattedBody.email}`);

    // Send response
    res.json({
      message: 'Lead updated successfully',
      updatedLead,
    });
  } catch (error) {
    // Log errors and send a 500 response
    logger.error(`Error updating lead: ${error.message}`);
    res.status(500).json({ message: 'Error updating lead', error: error.message });
  }
});

module.exports = router;

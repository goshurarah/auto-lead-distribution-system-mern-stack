const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');
const config = require("../config/config")
const prisma = new PrismaClient();
const BASE_URL = config.baseUrl;

const authController = {
  signup: async ({ email, password, firstName, lastName, phoneNumber, npnNumber, licenseNo, locationIds, policyIds }) => {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the agent
      const agent = await prisma.agent.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phoneNumber,
          npnNumber,
          licenseNo,
        },
      });

      // Associate the agent with locations, policies,
      if (locationIds && locationIds.length) {
        await prisma.agentLocations.createMany({
          data: locationIds.map(locationId => ({
            agentId: agent.id,
            locationId,
          })),
        });
      }

      if (policyIds && policyIds.length) {
        await prisma.agentPolicies.createMany({
          data: policyIds.map(policyId => ({
            agentId: agent.id,
            policyId,
          })),
        });
      }

      // Create a JWT token for the agent
      const token = jwt.sign({ agentId: agent.id }, config.jwtSecret);

      // Log the signup event
      logger.info(`Agent signed up with email: ${email}`);

      // Return the token and agent data
      return { token, agent };
    } catch (error) {
      logger.error(`Signup failed: ${error.message}`);
      throw new Error('Signup failed');
    }
  },

  login: async ({ email, password }) => {
    try {
      const agent = await prisma.agent.findUnique({ where: { email } });
      if (!agent) throw new Error('Agent not found');

      const isPasswordValid = await bcrypt.compare(password, agent.password);
      if (!isPasswordValid) throw new Error('Invalid password');

      const token = jwt.sign({ agent: agent.id }, config.jwtSecret);
      logger.info(`Agent logged in with email: ${email}`);
      return { token, agent };
    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      throw new Error('Login failed');
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      const agent = await prisma.agent.findUnique({ where: { email } });

      if (!agent) {
        throw new Error('agent not found');
      }

      // Create a reset token
      const resetToken = jwt.sign({ agentId: agent.id }, config.jwtSecret);

      // Send reset email
      const transporter = nodemailer.createTransport({
        service: config.email_server,
        host: config.email_host,
        port: config.email_port,
        secure: true,
        auth: {
          user: config.email_user,
          pass: config.email_pass,
        },
      });

      const mailOptions = {
        from: config.email_from,
        to: email,
        subject: 'Password Reset',
        text: `To reset your password, click the following link: ${BASE_URL}/reset-password/${resetToken}`,
      };

      await transporter.sendMail(mailOptions);
      return { message: 'Password reset email sent' };
    } catch (error) {
      logger.error(`Password reset failed: ${error.message}`);
      throw new Error('Password reset failed');
    }
  },

  resetPassword: async ({ token, newPassword }) => {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const agent = await prisma.agent.findUnique({ where: { id: decoded.agentId } });
      if (!agent) throw new Error('Agent not found');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.agent.update({
        where: { id: agent.id },
        data: { password: hashedPassword },
      });

      logger.info(`Password reset for agent with email: ${agent.email}`);
      return { message: 'Password reset successfully' };
    } catch (error) {
      logger.error(`Password reset failed: ${error.message}`);
      throw new Error('Password reset failed');
    }
  },
  getProfile: async (agentId) => {
    try {
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
        include: {
          agentPolicies: {
            include: {
              policy: true, // Assuming `policy` is the relation name in AgentPolicies
            },
          },
          agentLocations: {
            include: {
              location: true, // Assuming `location` is the relation name in AgentLocations
            },
          },
        }
      });

      if (!agent) {
        throw new Error('agent not found');
      }
      const structuredAgent = {
        ...agent,
        policies: agent.agentPolicies.map((ap) => ap.policy),
        locations: agent.agentLocations.map((al) => al.location),
      };
      logger.info(`Agent profile retrieved for agent with ID: ${agentId}`);
      return structuredAgent;
    } catch (error) {
      logger.error(`Failed to retrieve agent profile: ${error.message}`);
      throw new Error('Failed to retrieve agent profile');
    }
  },
};

module.exports = authController;

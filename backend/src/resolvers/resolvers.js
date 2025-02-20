const authController = require('../controllers/authController');
const leadController = require('../controllers/leadController');
const agentController = require('../controllers/agentController');
const locationController = require('../controllers/locationController');
const policyController = require('../controllers/policyController');
const campaignController = require('../controllers/campaignController');
const checkAuthorization=require('../middleware/graphqlAuth')
const checkUser=require('../middleware/checkUser')


const resolvers = {
  Query: {
    getAgents: async (_, { page = 1, perPage = 50 }, context) => {
      checkAuthorization(context);
      return agentController.getAgents(page, perPage);
    },
    getAgent: async (_, { id }, context) => {
      checkAuthorization(context);
      return agentController.getAgent(id);
    },
    filterAgents: async (_, { filter, page = 1, perPage = 50 }, context) => {
      checkAuthorization(context);
      return agentController.filterAgents(filter, page, perPage);
    },
    getCampaigns: async (_, { page = 1, perPage = 50 }, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return campaignController.getCampaigns(agentId, page, perPage);
    },
    getAllCampaigns: async (_, { page = 1, perPage = 50 }, context) => {
      checkAuthorization(context);  
      return campaignController.getAllCampaigns(page, perPage);
    },
    getCampaign: async (_, { id }, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return campaignController.getCampaign(agentId, id);
    },
    filterCampaigns: async (_, { filter, page = 1, perPage = 50 }, context) => {
      checkAuthorization(context);
      return campaignController.filterCampaigns(filter, page, perPage);
    },
    getLeads: async (_, { page = 1, perPage = 3 }, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return leadController.getLeads(agentId, page, perPage);
    },
    getAllLeads: async (_, { page = 1, perPage = 3 }, context) => {
      checkAuthorization(context); 
      return leadController.getAllLeads(page, perPage);
    },
    filterLeads: async (_, { filter, page = 1, perPage = 50 }, context) => {
      checkAuthorization(context);
      return leadController.filterLeads(filter, page, perPage);
    },
    getLocationById: async (_, { id }) => {
      return await locationController.getLocationById({ id });
    },
    getAllLocations: async () => {
      return await locationController.getAllLocations();
    },
    getPolicyById: async (_, { id }) => {
      return await policyController.getPolicyById({ id });
    },
    getAllPolicies: async () => {
      return await policyController.getAllPolicies();
    },
    getProfile: async (_, __, context) => {
        checkAuthorization(context);  
        var agentId=checkUser(context)
        return authController.getProfile(agentId);
      },
      
  },

  Mutation: {
    updateAgent: async (_, { id, data }, context) => {
      checkAuthorization(context)
      return agentController.updateAgent(id, data);
    },
    createCampaign: async (_, args, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return campaignController.createCampaign(args, agentId);
    },
    createAdminCampaign: async (_, args, context) => {
      checkAuthorization(context);  
      return campaignController.createAdminCampaign(args);
    },
    updateCampaign: async (_, { id, data }, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return campaignController.updateCampaign(agentId, id, data);
    },
    deleteCampaign: async (_, { id }, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return campaignController.deleteCampaign(agentId, id);
    },
    updateLead: async (_, { id, data }, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return leadController.updateLead(agentId, id, data);
    },
    deleteLead: async (_, { id }, context) => {
      checkAuthorization(context);
      var agentId=checkUser(context)  
      return leadController.deleteLead(agentId, id);
    },
    createLocation: async (_, { name }) => {
      return await locationController.createLocation({ name });
    },
    updateLocation: async (_, { id, name }) => {
      return await locationController.updateLocation({ id, name });
    },
    deleteLocation: async (_, { id }) => {
      return await locationController.deleteLocation({ id });
    },
    createPolicy: async (_, { name, description }) => {
      return await policyController.createPolicy({ name, description });
    },
    updatePolicy: async (_, { id, name, description }) => {
      return await policyController.updatePolicy({ id, name, description });
    },
    deletePolicy: async (_, { id }) => {
      return await policyController.deletePolicy({ id });
    },
    signup: async (_, { email, password, firstName, lastName, phoneNumber, npnNumber, licenseNo, locationIds, policyIds, planIds }) => {
      return await authController.signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        npnNumber,
        licenseNo,
        locationIds,
        policyIds,
        planIds,
      });
    },
    login: async (_, args) => authController.login(args),
    forgotPassword: async (_, args) => authController.forgotPassword(args),
    resetPassword: async (_, args) => authController.resetPassword(args),
  },

};

module.exports = resolvers;

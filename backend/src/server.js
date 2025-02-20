require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers/resolvers');
const authMiddleware = require('./middleware/auth');
const { PrismaClient } = require('@prisma/client');
const config = require('./config/config');
const logger = require('./utils/logger');
const cors = require('cors');

// Express routes
const leadWebhookAPI = require('./routes/webhooks/leadsWebhook');
const updateLeadWebhookAPI = require('./routes/webhooks/updateLeadsWebhook');
const emailWebhookAPI = require('./routes/webhooks/leadEmailWebhook');
const ghlConnector=require("./services/ghlConnector/connector")
const ghlCallback=require("./services/ghlConnector/callback")
const ghlLocationsDetail=require("./routes/ghl/getLocations")
const inviteEmail=require("./routes/invite/invite")

const prisma = new PrismaClient();
const PORT = config.port;
const BASE_URL = config.baseUrl;

// Load GraphQL schema
const typeDefs = fs.readFileSync(path.join(__dirname, './models/schema.graphql'), 'utf8');

const app = express();
app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// app.use(authMiddleware);
app.use('/api', leadWebhookAPI);
app.use('/api', updateLeadWebhookAPI);
app.use('/api', emailWebhookAPI);
app.use('/api', ghlConnector);
app.use('/api', ghlCallback);
app.use('/api', ghlLocationsDetail);
app.use('/api', inviteEmail);

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    headers: req.headers,
    prisma,
    user: req.user,
  }),
});

// Start Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}${server.graphqlPath}`);
  });
}

startServer().catch((err) => {
  logger.error("Server startup error:", err);
  prisma.$disconnect();
});

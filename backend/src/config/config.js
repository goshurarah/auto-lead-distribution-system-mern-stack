require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  gqlEndpoint: process.env.GRAPHQL_ENDPOINT,
  jwtSecret: process.env.JWT_SECRET,
  baseUrl: process.env.BASE_URL,
  max_leads: process.env.MAX_LEADS_PER_AGENT ,
  email_user: process.env.EMAIL_USER ,
  email_pass: process.env.EMAIL_PASS ,
  email_port: process.env.EMAIL_PORT ,
  email_host: process.env.EMAIL_HOST ,
  email_from: process.env.EMAIL_FROM ,
  email_server: process.env.EMAIL_SERVER ,
};

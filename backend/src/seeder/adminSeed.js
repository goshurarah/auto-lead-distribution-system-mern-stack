const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

const agentData = [
    { firstName: 'Admin', lastName: '1', email: 'crm@agentemp.com', password: 'Leads2025@@', role: 'ADMIN' },
    { firstName: 'Admin', lastName: '2', email: 'jd@agentemp.com', password: 'Leads2025@@', role: 'ADMIN' },
    { firstName: 'Admin', lastName: '3', email: 'ahmedh.marketer@gmail.com', password: 'Leads2025@@', role: 'ADMIN' },
    { firstName: 'Admin', lastName: '4', email: 'hello@agentemp.com', password: 'Leads2025@@', role: 'ADMIN' },
    { firstName: 'Admin', lastName: '5', email: 'ahmed@pumpkindeal.com', password: 'Leads2025@@', role: 'ADMIN' }
];
async function main() {

    for (const agent of agentData) {
        const hashedPassword = await bcrypt.hash(agent.password, 10);
        await prisma.agent.create({
            data: {
                ...agent,
                password: hashedPassword
            }
        });
    }
    console.log('Admin seeding completed successfully!');
}

main()
    .catch((e) => {
        logger.error('Error admin seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

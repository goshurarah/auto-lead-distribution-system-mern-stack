const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

async function main() {
    // Seed Policies
    const policies = [
        { name: 'Dental', description: 'Description' },
        { name: 'ACA Health', description: 'Description' },
        { name: 'Vision', description: 'Description' },
        { name: 'Heart', description: 'Description' },
        { name: 'Life', description: 'Description' },

    ];

    for (const policy of policies) {
        await prisma.policy.create({
            data: policy,
        });
    }

    // Seed Locations
    const stateNames = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
        'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
        'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];
    for (const stateName of stateNames) {
        await prisma.location.create({
            data: { name: stateName },
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        logger.error('Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

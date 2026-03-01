const { PrismaClient } = require('@prisma/client');

console.log('Testing Prisma Instantiation in CommonJS Context...');
const prisma = new PrismaClient();

async function main() {
    console.log('Trying to connect to DB');
    await prisma.$connect();
    console.log('DB Connection OK');
    await prisma.$disconnect();
}

main().catch(console.error);

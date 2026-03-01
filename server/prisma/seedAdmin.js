const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@diyamgaz.com';

    // Verifier si l'admin existe deja
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log(`L'administrateur existe deja: ${adminEmail}`);
        return;
    }

    // Creer le mot de passe hashe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Creer l'utilisateur admin
    const admin = await prisma.user.create({
        data: {
            name: 'Administrateur Principal',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Utilisateur Administrateur cree avec succes !');
    console.log('Email:', admin.email);
    console.log('Mot de passe:', 'admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

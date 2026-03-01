const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCTS = [
    // GAZ
    {
        title: 'Bouteille de Gaz 38 kg',
        description: 'Très grand format, idéal pour les professionnels ou grande consommation.',
        price: 19000,
        category: 'GAZ',
        photos: '["/images/products/gaz/Copie de Livraison de Gaz, eau et charbon à domicile (1).png"]'
    },
    {
        title: 'Bouteille de Gaz 12,5 kg',
        description: 'Idéal pour les familles nombreuses.',
        price: 6250,
        category: 'GAZ',
        photos: '["/images/products/gaz/Copie de Livraison de Gaz, eau et charbon à domicile (3).png"]'
    },
    {
        title: 'Bouteille de Gaz 9 kg',
        description: 'Format standard pour la cuisine de tous les jours.',
        price: 4285,
        category: 'GAZ',
        photos: '["/images/products/gaz/Livraison de Gaz, eau et charbon à domicile (1).png"]'
    },
    {
        title: 'Bouteille de Gaz 6 kg',
        description: 'Format pratique et économique.',
        price: 2885,
        category: 'GAZ',
        photos: '["/images/products/gaz/Copie de Livraison de Gaz, eau et charbon à domicile (1).png"]'
    },

    // EAU
    {
        title: "Pack Eau Casamançaise 10L",
        description: 'Eau minérale naturelle du Sénégal, grand format.',
        price: 1500,
        category: 'EAU',
        photos: '["/images/products/eau/Casamançaise_10L.jfif"]'
    },
    {
        title: "Pack Eau Casamançaise 1.5L",
        description: 'Bouteille individuelle, pureté garantie.',
        price: 500,
        category: 'EAU',
        photos: '["/images/products/eau/Casamançaise_1,5L.jfif"]'
    },
    {
        title: "Pack Eau Casamançaise 0.5L",
        description: 'Petit format pratique.',
        price: 250,
        category: 'EAU',
        photos: '["/images/products/eau/Casamançaise_0,5L.jfif"]'
    },
    {
        title: "Bidon Eau Kirène 10L",
        description: 'Eau minérale naturelle Kirène familiale.',
        price: 1500,
        category: 'EAU',
        photos: '["/images/products/eau/Kirene_10L.jfif"]'
    },
    {
        title: "Bouteille Eau Kirène 1.5L",
        description: 'Format classique Kirène.',
        price: 500,
        category: 'EAU',
        photos: '["/images/products/eau/Kirene 1,5L.jfif"]'
    },
    {
        title: "Pak Séo 1.5L",
        description: 'Eau minérale Séo en pack.',
        price: 2400,
        category: 'EAU',
        photos: '["/images/products/eau/Pack_Séo1,5L.PNG"]'
    },
    {
        title: "Pak Séo 350ML",
        description: 'Pack Mini format Séo.',
        price: 1500,
        category: 'EAU',
        photos: '["/images/products/eau/Pack_Séo 350ML.PNG"]'
    },

    // CHARBON
    {
        title: 'Charbon de bois 2.5kg (Choix 1)',
        description: 'Charbon de qualité prémium pour la cuisson rapide.',
        price: 1500,
        category: 'CHARBON',
        photos: '["/images/products/charbon/1.png"]'
    },
    {
        title: 'Charbon écologique (Choix 2)',
        description: 'Brûle plus longtemps, sans fumée nocive.',
        price: 2000,
        category: 'CHARBON',
        photos: '["/images/products/charbon/2.png"]'
    },
    {
        title: 'Sac de Charbon Traditionnel (Choix 3)',
        description: 'L\'essentiel pour vos grillades.',
        price: 2500,
        category: 'CHARBON',
        photos: '["/images/products/charbon/3.png"]'
    }
];

async function main() {
    console.log('Clearing existing products...');
    await prisma.product.deleteMany({});

    console.log('Start seeding...');
    for (const p of PRODUCTS) {
        const product = await prisma.product.create({
            data: p,
        });
        console.log(`Created product with id: ${product.id}`);
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    for (let i = 0; i < 50; i++) {
        await prisma.buyer.create({
            data: {
                name: faker.person.fullName(),
                purchaseDate: faker.date.past(),
            },
        });
    }

    const buyers = await prisma.buyer.findMany();

    for (let i = 0; i < 50; i++) {
        const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
        await prisma.purchase.create({
            data: {
                number: faker.number.int({ min: 1, max: 400 }),
                buyer: {
                    connect: { id: randomBuyer.id },
                },
            },
        });
    }

    for (let i = 0; i < 50; i++) {
        const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
        await prisma.winner.create({
            data: {
                buyerName: randomBuyer.name,
                number: faker.number.int({ min: 1, max: 400 }),
                drawDate: faker.date.recent(),
                buyer: {
                    connect: { id: randomBuyer.id },
                },
            },
        });
    }

    for (let i = 0; i < 50; i++) {
        await prisma.raffleState.create({
            data: {
                totalNumbers: faker.number.int({ min: 50, max: 150 }),
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { prisma } from "../prisma.js";

const buyerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    numbers: z.array(z.number()).min(1, "At least one number is required"),
});

const winnerSchema = z.object({
    buyerId: z.string().min(1, "Buyer ID is required"),
    number: z.number(),
    buyerName: z.string().min(1, "Buyer name is required"),
});

const mainApp = new Hono()
    .basePath("/api").
    post('/buyer', zValidator("json", buyerSchema), async (c) => {
        try {
            const JSONdata = c.req.valid("json");

            const savedBuyer = await prisma.buyer.create({
                data: {
                    name: JSONdata.name,
                    purchaseDate: new Date(),
                    purchases: {
                        create: JSONdata.numbers.map((number) => ({
                            number: number,
                        })),
                    },
                },
            });

            return c.json(savedBuyer, 201);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({ error: error.errors }, 400);
            }
            console.error('Error saving buyer:', error);
            return c.json({ error: 'Failed to save buyer' }, 500);
        }
    }).
    post('/winners', zValidator("json", z.array(winnerSchema)), async (c) => {
        try {
            const winnersData = c.req.valid("json");
            const savedWinners = await prisma.$transaction(
                winnersData.map(winner => {
                    return prisma.winner.create({
                        data: {
                            buyerId: winner.buyerId,
                            buyerName: winner.buyerName,
                            number: winner.number,
                            drawDate: new Date(),
                        },
                    });
                })
            );

            return c.json(savedWinners, 201);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({ error: error.errors }, 400);
            }
            console.error('Error saving winners:', error);
            return c.json({ error: 'Failed to save winners' }, 500);
        }
    }).
    get('/buyers', async (c) => {
        try {
            const buyers = await prisma.buyer.findMany({
                include: {
                    purchases: true,
                },
            });
            return c.json(buyers, 200);
        } catch (error) {
            console.error('Error fetching buyers:', error);
            return c.json({ error: 'Failed to fetch buyers' }, 500);
        }
    }).
    get('/get-winners', async (c) => {
        try {
            const winners = await prisma.winner.findMany();
            return c.json(winners, 200);
        } catch (error) {
            console.error('Error fetching winners:', error);
            return c.json({ error: 'Failed to fetch winners' }, 500);
        }
    });

export { mainApp };
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all dashboard statistics (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { period } = req.query; // 'week', 'month', 'year'

        // Date calculation for filtering
        let startDate = null;
        if (period) {
            startDate = new Date();
            if (period === 'week') startDate.setDate(startDate.getDate() - 7);
            else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
            else if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const totalUsers = await prisma.user.count();
        const totalProducts = await prisma.product.count();

        // Filter orders by date if period is provided
        const orderWhereClause = startDate ? { createdAt: { gte: startDate } } : {};

        const totalOrders = await prisma.order.count({ where: orderWhereClause });

        // Sum total amount (filtered by date)
        const revenueAggregation = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: orderWhereClause
        });
        const totalRevenue = revenueAggregation._sum.totalAmount || 0;

        // Top 5 Visites
        const topViewedProducts = await prisma.product.findMany({
            orderBy: { views: 'desc' },
            take: 5
        });

        // Evolution de l'inventaire quotidien des 30 derniers jours (Agrégation dynamique)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const inventoryLogs = await prisma.inventoryLog.findMany({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Build a chart curve for inventory over the last 30 days
        const inventoryByDayMap = new Map();

        inventoryLogs.forEach(log => {
            const dateStr = log.createdAt.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            if (!inventoryByDayMap.has(dateStr)) {
                inventoryByDayMap.set(dateStr, []);
            }
            inventoryByDayMap.get(dateStr).push(log);
        });

        const inventoryCurve = Array.from(inventoryByDayMap.entries()).map(([date, logs]) => {
            const totalStockRecordedThatDay = logs.reduce((sum, log) => sum + log.quantity, 0);
            return {
                date,
                totalStockActivity: totalStockRecordedThatDay,
                logCount: logs.length
            };
        });

        res.json({
            data: {
                summary: { totalUsers, totalProducts, totalOrders, totalRevenue },
                charts: { inventoryCurve },
                topViewedProducts
            }
        });

    } catch (error) {
        console.error("Erreur Dashboard Stats:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

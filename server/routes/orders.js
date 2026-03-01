const express = require('express');
const prisma = require('../prismaClient.js');

const router = express.Router();

// POST a new order
router.post('/', async (req, res) => {
    const { total_amount, delivery_zone, delivery_fee } = req.body;

    try {
        const newOrder = await prisma.order.create({
            data: {
                totalAmount: parseFloat(total_amount),
                deliveryZone: delivery_zone,
                deliveryFee: parseFloat(delivery_fee)
            }
        });
        res.json({ message: 'Order placed successfully', orderId: newOrder.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

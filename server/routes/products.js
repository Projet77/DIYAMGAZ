const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Multer config for photo uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { files: 3 } });

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Parse photos JSON string to array for frontend
        const formattedProducts = products.map(p => ({
            ...p,
            photos: p.photos ? JSON.parse(p.photos) : []
        }));

        res.json({ data: formattedProducts });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// POST new product (Admin)
router.post('/', authMiddleware, adminMiddleware, upload.array('photos', 3), async (req, res) => {
    const { title, description, price, quantity, category } = req.body;
    const photos = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    try {
        const newProduct = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price) || 0,
                quantity: parseInt(quantity) || 0,
                category,
                photos: JSON.stringify(photos)
            }
        });
        res.json({ message: 'success', data: { id: newProduct.id } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update product (Admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, quantity, category } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { title, description, price: parseFloat(price), quantity: parseInt(quantity), category }
        });
        res.json({ message: 'success', data: updatedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE product (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'success' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

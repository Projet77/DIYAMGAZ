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
const upload = multer({ storage: storage, limits: { files: 4 } });

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
router.post('/', authMiddleware, adminMiddleware, upload.array('photos', 4), async (req, res) => {
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

        // Log initial inventory
        if (newProduct.quantity > 0) {
            await prisma.inventoryLog.create({
                data: {
                    productId: newProduct.id,
                    quantity: newProduct.quantity
                }
            });
        }

        res.json({ message: 'success', data: { id: newProduct.id } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update product (Admin)
router.put('/:id', authMiddleware, adminMiddleware, upload.array('photos', 4), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, quantity, category } = req.body;
        const parsedQuantity = parseInt(quantity);

        const updateData = { title, description, price: parseFloat(price), quantity: parsedQuantity, category };

        // Si de nouvelles photos sont envoyées, on les met à jour
        if (req.files && req.files.length > 0) {
            const photos = req.files.map(f => `/uploads/${f.filename}`);
            updateData.photos = JSON.stringify(photos);
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        // Log inventory change
        await prisma.inventoryLog.create({
            data: {
                productId: updatedProduct.id,
                quantity: parsedQuantity
            }
        });

        // Convert string logic to array for frontend
        const formattedUpdatedProduct = {
            ...updatedProduct,
            photos: updatedProduct.photos ? JSON.parse(updatedProduct.photos) : []
        };

        res.json({ message: 'success', data: formattedUpdatedProduct });
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

// PUT increment views (Public)
router.put('/:id/views', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.update({
            where: { id: parseInt(id) },
            data: { views: { increment: 1 } }
        });
        res.json({ message: 'success' });
    } catch (error) {
        // Fail silently so it doesn't break frontend mapping
        res.status(200).json({ message: 'ignored' });
    }
});

module.exports = router;

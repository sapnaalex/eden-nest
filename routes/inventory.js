const express = require('express');
const router = express.Router();
const { InventoryItem } = require('../models');

// 3. API: Add New Pet to Inventory (Create)
router.post('/', async (req, res) => {
    try {
        const newItem = await InventoryItem.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. API: Get All Inventory Items (Read All)
router.get('/', async (req, res) => {
    try {
        const items = await InventoryItem.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. API: Get Single Item Details (Read One)
router.get('/:id', async (req, res) => {
    try {
        const item = await InventoryItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. API: Update Pet Details (Update)
router.put('/:id', async (req, res) => {
    try {
        const item = await InventoryItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        await item.update(req.body);
        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 7. API: Remove Item from Inventory (Delete)
router.delete('/:id', async (req, res) => {
    try {
        const item = await InventoryItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        await item.destroy();
        res.status(200).json({ message: 'Item deleted from inventory' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
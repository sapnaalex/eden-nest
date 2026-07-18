const express = require('express');
const router = express.Router();
const { Booking } = require('../models');

// 8. API: Create Boarding Booking
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, petType, startDate, endDate, cageType } = req.body;
        if (!customerName || !customerPhone || !petType || !startDate || !endDate || !cageType) {
            return res.status(400).json({ error: 'Missing mandatory boarding fields.' });
        }
        const newBooking = await Booking.create(req.body);
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 9. API: Get All Boarding Bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 10. API: Cancel Boarding Booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        await booking.update({ bookingStatus: 'Cancelled' });
        res.status(200).json({ message: 'Booking successfully cancelled', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
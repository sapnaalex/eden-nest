// routes/bookings.js
const express = require('express');
const router = express.Router();
const { Booking } = require('../models');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new booking
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create({
      customerName: req.body.customerName,
      phone: req.body.phone,
      petType: req.body.petType || 'Bird',
      breed: req.body.breed,
      birdCount: Number(req.body.birdCount) || 1,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      cageType: req.body.cageType,
      ratesSummary: String(req.body.ratesSummary || ''),
      days: Number(req.body.days) || 1,
      totalCost: Number(req.body.totalCost) || 0,
      requirements: req.body.requirements || '',
      status: req.body.status || 'Active'
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update booking (For marking return / completion with actual dates)
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update({
      endDate: req.body.endDate || booking.endDate,
      days: req.body.days !== undefined ? req.body.days : booking.days,
      totalCost: req.body.totalCost !== undefined ? req.body.totalCost : booking.totalCost,
      status: req.body.status || booking.status
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Mount API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/ai', require('./routes/ai')); // Day 6: AI Integration

app.get('/', (req, res) => {
    res.send('Eden Nest Pets API: 11 Core Endpoints & Gemini AI Active.');
});

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database sync failed:', err);
});
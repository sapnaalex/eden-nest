const express = require('express');
const { sequelize } = require('./models');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Mount our 10 REST API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/', (req, res) => {
    res.send('Eden Nest Pets API: 10 Core Routing Endpoints Configured.');
});

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database sync failed:', err);
});
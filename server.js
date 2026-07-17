const express = require('express');
const { sequelize } = require('./models'); // Import database models
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Eden Nest Pets API is running and SQLite Database is active.');
});

// Sync database before starting server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database sync failed:', err);
});
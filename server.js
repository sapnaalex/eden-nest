const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// This allows your app to read incoming data formatted as JSON
app.use(express.json());

// A simple test route to make sure our server works
app.get('/', (req, res) => {
    res.send('Eden Nest Pets API is running successfully!');
});

// Start the server listening for requests
app.listen(PORT, () => {
    console.log(`Server is happily running on port ${PORT}`);
});

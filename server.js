const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Eden Nest Pets API is running successfully with Java DSA Module core ready.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
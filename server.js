const express = require('express');

const app = express();

app.get('/', (reqest, response) => response.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

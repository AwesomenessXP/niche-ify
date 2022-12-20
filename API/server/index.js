// set up server
const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const app = express();

app.get("/api", (req, res) => {
  res.json({ client_id: `${process.env.CLIENT_ID}`});
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
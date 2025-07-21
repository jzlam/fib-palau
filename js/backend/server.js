// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/data', async (req, res) => {
  const response = await fetch("https://api.example.com/data", {
    headers: {
      Authorization: `Bearer ${process.env.DEV_TOKEN}`,
    },
  });
  const data = await response.json();
  res.json(data); // Forward response to frontend
});

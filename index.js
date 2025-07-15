const express = require('express');
const { startScheduler } = require('./function/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Start aligned scheduler
startScheduler();

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.send('✅ Backend is running and scheduler is active.');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
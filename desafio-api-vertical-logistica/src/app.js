const express = require('express');
const routes = require('./routes');

const app = express();

// Routes
app.use('/api', routes);

module.exports = app;
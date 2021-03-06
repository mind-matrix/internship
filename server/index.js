// Get dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');

// Get our API routes
const api = require('./api/v1');

const app = express();

// Set our api routes
app.use('/api', api);

/**
 * Get port from environment and store in Express.
 */
let port = process.env.PORT || '3000';

app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

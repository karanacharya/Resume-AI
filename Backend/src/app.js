const express = require('express');
const cookieparser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const interviewRouter = require('./routes/interview.routes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieparser());

/**
 * This Route is for User related routes
 */
app.use('/api/auth', userRoutes);

/**
 * This Route is for AI related routes
 */
app.use('/api/report', interviewRouter);

module.exports = app;
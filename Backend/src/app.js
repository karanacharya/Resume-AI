const express = require('express');
const cookieparser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const interviewRouter = require('./routes/interview.routes');

const app = express();
const Frontend_URI = process.env.FRONTEND_URI

app.use(
  cors({
    origin: Frontend_URI,
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
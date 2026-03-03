const express = require('express');
const cookieparser = require('cookie-parser');

const userRoutes = require('./routes/user.routes')

const app = express();


app.use(express.json());
app.use(cookieparser());

/**
 * This Route is for User related routes
 */
app.use('/api/auth' , userRoutes)


module.exports = app
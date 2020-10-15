const express = require('express');
const commonMiddleware = require('./middleware/common');
const authRoute = require('./api/routes/authRoute');
const postsRoute = require('./api/routes/postsRoute');
const morgan = require('morgan');

let app = express();
// Imported middelware
app.use(morgan('dev'));
app.use(express.json());


//Routes
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);

// Common middleware
app.use(commonMiddleware.notFound);
app.use(commonMiddleware.errorHandler);



module.exports = app;

const http = require('http');
const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    
    });
} catch (error) {
    console.error(error);
    return;
}

let httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
    console.log(`Server listening on localhost:${process.env.PORT}`);
});


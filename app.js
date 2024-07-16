const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const config = dotenv.config();
const helmet = require('helmet');
const uuid = require('uuid');
const mongoose = require('mongoose');
const routes = require("./routes/routes");

app.use(helmet());
app.use(bodyParser.urlencoded( { extended:false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.DATABASE_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
}

app.use("/api/auth", routes);
app.use("/api/products", routes);

app.use("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
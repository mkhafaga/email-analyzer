const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const emailsRouter = require('./routes/emails');
const exporterRouter = require('./routes/exporter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/emails', emailsRouter);
app.use('/exporter', exporterRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', function (req, res) {
    console.log('it comes here!')
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

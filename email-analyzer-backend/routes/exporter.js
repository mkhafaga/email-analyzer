var express = require('express');
var router = express.Router();
const objectstocsv = require('objects-to-csv');
const fs = require("fs");
/**
 * API for sending csv file created by /analyze-sent-messages
 */
router.get('/exportCsv', async function(req, res, next) {
    console.log('/exportCsv');
    const {csvFileName} = req.query;

    res.download(`/tmp/${csvFileName}`);
});

module.exports = router;

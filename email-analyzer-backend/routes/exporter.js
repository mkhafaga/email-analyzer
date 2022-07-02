var express = require('express');
var router = express.Router();
const objectstocsv = require('objects-to-csv');
const fs = require("fs");

router.get('/exportCsv', async function(req, res, next) {
    console.log('/exportCsv');
    const {csvFileName} = req.query;

    res.download(`/tmp/${csvFileName}`,() => {
        // fs.unlinkSync("./test.csv")
    })
});

module.exports = router;

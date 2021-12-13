'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('db_test.sqlite', (err) => {
    if (err) throw err;
});

module.exports = db;

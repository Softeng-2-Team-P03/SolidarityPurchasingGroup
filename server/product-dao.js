'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');
// const db =;
// ----------->  <---------------

exports.getProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Products';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const products = rows.map((e) => ({ Id: e.Id, FarmerId: e.FarmerId, Name: e.Name, Description: e.Description,Quantity: e.Quantity,State:e.State,TypeId:e.TypeId,PricePerUnit:e.PricePerUnit}));
            resolve(products);
        });
    });
};

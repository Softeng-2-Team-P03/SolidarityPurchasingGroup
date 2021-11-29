'use strict';

const db = require('./db');
const bcrypt = require('bcrypt');



// add a new client
exports.createClient = (client) => {
    return new Promise((resolve, reject) => {
      let id = -1;
      const id_sql = 'SELECT MAX(id) AS maxId FROM Users';
      db.get(id_sql, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row.maxId == null) {
          id = 1;
        } else {
          id = row.maxId+1;
        }
        let pass= bcrypt.hashSync(client.password,10);
        const sql = 'INSERT INTO Users (Id, Password, Name, Surname, Email, PhoneNumber, AccessType, Wallet, Address) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [id, pass, client.name, client.surname, client.email, client.phoneNumber, client.accessType, 0.0, client.address], function (err1) {
          if (err1) {
            reject(err1);
            return;
          }
          resolve(id);
        });
  
      });
    }); 
  };
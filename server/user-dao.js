'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');
// const db =; 
// ----------->  <---------------
exports.getUsers = (pageNumber) => {
    return new Promise(async (resolve, reject) => {
        var sqlQuery = 'SELECT * From Users LIMIT 10 OFFSET "' + pageNumber + '"';
        db.all(sqlQuery, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users = rows.map((row) => ({
                id: row.Id,
                name: row.name,
                surName: row.surName,
                email: row.Email,
                phoneNumber: row.PhoneNumber,
                accessType: row.AccessType,
                wallet: row.wallet,
                address: row.Address,
            })
            );
            console.log(users);
            resolve(users);
        });

    });
};


exports.getUsersByAccessType = (accessType) => {
    return new Promise(async (resolve, reject) => {
        var sqlQuery = "SELECT * From Users WHERE AccessType=" + accessType + " LIMIT 10 OFFSET " + pageNumber + '"';
        db.all(sqlQuery, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users = rows.map((row) => ({
                id: row.Id,
                name: row.name,
                surName: row.surName,
                email: row.Email,
                phoneNumber: row.PhoneNumber,
                accessType: row.AccessType,
                wallet: row.wallet,
                address: row.Address,
            })
            );
            console.log(users);
            resolve(users);
        });

    });
};


exports.doLogin = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = {
                    id: row.Id,
                    name: row.name,
                    surName: row.surName,
                    email: row.Email,
                    phoneNumber: row.PhoneNumber,
                    accessType: row.AccessType,
                    wallet: row.wallet,
                    address: row.Address,
                };
                // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
                bcrypt.compare(password, row.hash).then((result) => {
                    if (result)
                        resolve(user);
                    else
                        resolve(false);
                });
            }
        });
    });
  }
/* Data Access Object (DAO) module for accessing users */

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const user = {id: row.Id, username: row.Email}
          resolve(user);
        }
    });
  });
};

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined) {
          resolve(false);
        }
        else {
          const user = {id: row.Id, username: row.email};
            
          // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
          bcrypt.compare(password, row.Password).then(result => {
            if(result)
              resolve(user);
            else
              resolve(false);
          });
        }
    });
  });
};
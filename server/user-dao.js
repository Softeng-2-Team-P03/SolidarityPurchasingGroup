'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');
const { log } = require('npmlog');
// const db =;
// ----------->  <---------------

function userReturned(rows){
  return rows.map((row) => ({
    id: row.Id,
    name: row.Name,
    surname: row.Surname,
    email: row.Email,
    phoneNumber: row.PhoneNumber,
    accessType: row.AccessType,
    wallet: row.Wallet,
    address: row.Address,
})
);
}

exports.getUsers = (pageNumber) => {
    return new Promise(async (resolve, reject) => {
        var sqlQuery = 'SELECT * From Users LIMIT 10 OFFSET "' + pageNumber + '"';
        db.all(sqlQuery, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users =userReturned(rows);
            resolve(users);
        });

    });
};


exports.getUsersByAccessType = (accessType) => {
    return new Promise(async (resolve, reject) => {
        var sqlQuery = "SELECT * From Users WHERE AccessType= ? ";
        db.all(sqlQuery, [accessType], (err, rows) => { //NOSONAR
            if (err) {
                reject(err);
                return;
            }
            const users = userReturned(rows);
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
                    surname: row.Surname,
                    email: row.Email,
                    phoneNumber: row.PhoneNumber,
                    accessType: row.AccessType,
                    wallet: row.Wallet,
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
          const user = {id: row.Id, username: row.Email, name: row.Name, accessType: row.AccessType}
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
          const user = {id: row.Id, username: row.Email, name: row.Name, accessType: row.AccessType};

          // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
          bcrypt.compare(password, row.Password).then(result => { //NOSONAR
            if(result)
              resolve(user);
            else
              resolve(false);
          });
        }
    });
  });
};
exports.getWalletBalance = (id) => {
  console.log("getWalletBalance");
  return new Promise(async (resolve, reject) => {
      var sqlQuery = 'SELECT Wallet From Users where Id=?';
      db.all(sqlQuery, [id], (err, rows) => {
          if (err) {
              reject(err);
              return;
          }
          console.log(rows[0])
          resolve(rows[0]);
      });

  });
};

// ----------->  <---------------
exports.getRequiredCharge = (id) => {
  return new Promise(async (resolve, reject) => {
      var sqlQuery = 'select Sum(TotalPrice) as TotalPrice from Bookings where UserId=? and State=1';
      db.all(sqlQuery,[id], (err, rows) => {
          if (err) {
            console.log(err)
              reject(err);
              return;
          }
          if (rows[0]["TotalPrice"]==null)
          rows[0]["TotalPrice"]=0
          resolve(rows[0]);
      });

  });
};
// ----------->  <---------------
exports.getRequiredChargeByBookingId = (userId,id) => {
  return new Promise(async (resolve, reject) => {
      var sqlQuery = 'select (Users.Wallet - Bookings.TotalPrice)as TotalPrice from Bookings,Users where Bookings.UserId=? and Bookings.Id=? AND Users.Id=?';
      db.all(sqlQuery, [userId,id,userId], (err, rows) => {
          if (err) {
              reject(err);
              return;
          }
          resolve(rows[0]);
      });

  });
};

'use strict';

const axios = require('axios')
const db = require('./../db');
const bcrypt = require('bcrypt');

exports.getMobile = (chatId) => {
  return new Promise((resolve, reject) => {
    let id = -1;
    const id_sql = 'SELECT Mobile  FROM Telegram Where ChatId=?';
    db.get(id_sql,[chatId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row!=null)
      resolve(row.Mobile);
      else
      resolve();

    });
  }); 
};

exports.getChatIdWitMobile = (mobile) => {
  return new Promise((resolve, reject) => {
    let id = -1;
    const id_sql = 'SELECT ChatId  FROM Telegram Where Mobile=?';
    db.get(id_sql,[mobile], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row!=null)
      resolve(row.ChatId);
      else
      resolve();

    });
  }); 
};

exports.getAllChatId = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT ChatId  FROM Telegram';
    db.all(sql, function (err, rows)  {
      if (err) {
        reject(err);
        return;
      }
      if (rows!=null)
      resolve(rows);
      else
      resolve();
    });
  }); 
};
exports.checkAuth = (chatId) => {
  return new Promise((resolve, reject) => {
    let id = -1;
    const id_sql = 'SELECT SuccessLogin  FROM Telegram Where ChatId=? ';
    db.get(id_sql,[chatId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row!=null)
      resolve(row.SuccessLogin);
      else
      resolve();
    });
  }); 
};

exports.getWalletBalance = (mobile) => {
  return new Promise((resolve, reject) => {
    // select from notifications
      resolve("Youre Wallet Balance Is Insufficent");
  }); 
};

exports.getAllNotifications = (mobile) => {
  return new Promise((resolve, reject) => {
      const notificationsSql = '  SELECT Notifications.*,Telegram.ChatId,Users.PhoneNumber as Mobile From Notifications,Telegram,Users WHERE Notifications.UserId=Users.Id  AND Notifications.TelegramStatus=0 And Telegram.SuccessLogin=1 AND Telegram.Mobile=Users.PhoneNumber';
    db.all(notificationsSql, function (err, rows) {//NOSONAR
      if (err) {
        reject(err);
        return;
      }
      const notifications = rows.map((e) => ({
        NotificationId: e.NotificationId,
        NotificationHeader: e.NotificationHeader,
        NotificationBody: e.NotificationBody,
        ChatId: e.ChatId,
        Mobile: e.Mobile
      }));
      resolve(notifications);
  }); 
  }); 
};

exports.listOfNotifications = (mobile) => {
  return new Promise((resolve, reject) => {
      const notificationsSql = '  SELECT Notifications.*,Telegram.ChatId,Users.PhoneNumber as Mobile From Notifications,Telegram,Users WHERE Notifications.UserId=Users.Id AND Telegram.Mobile=Users.PhoneNumber AND Notifications.TelegramStatus=0  AND Telegram.Mobile=?';
    db.all(notificationsSql,[mobile], function (err, rows) {//NOSONAR
      if (err) {
        reject(err);
        return;
      }
      const notifications = rows.map((e) => ({
        NotificationId: e.NotificationId,
        NotificationHeader: e.NotificationHeader,
        NotificationBody: e.NotificationBody,
        ChatId: e.ChatId,
        Mobile: e.Mobile
      }));
      resolve(notifications);
  }); 
  }); 
};

exports.UpdateNotificatonStatusForTelgram = (notificationId) => {
  return new Promise((resolve, reject) => {
    const sqlUpdateBookingProduct = 'UPDATE Notifications SET TelegramStatus=1   WHERE  NotificationId=? ';
    db.run(sqlUpdateBookingProduct, [notificationId], function (err) {//NOSONAR
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  })
}

exports.updateSuccessLogin = (mobile,password) => {
  return new Promise((resolve, reject) => {
    let id = -1;
    const id_sql = 'SELECT Id,Password  FROM Users Where PhoneNumber=? ';
    db.get(id_sql,[mobile], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row!=null)
      {
        bcrypt.compare(password, row.Password).then((result) => {
          var c= result==true ?1:0;
            const sql = 'Update Telegram  set SuccessLogin='+c+'  Where mobile=?';
            db.run(sql, [mobile], function (err1) {
              if (err1) {
                reject(err1);
              }
              resolve(result);
              return
            });
        });
    }
      else
      {resolve(false);
      return
      }
    });
  }); 
};

exports.InsertChatId = (chatId,userName) => {
    return new Promise((resolve, reject) => {
      let id = -1;
      const id_sql = 'SELECT ChatId  FROM Telegram Where ChatId=?';
      db.get(id_sql,[chatId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row==null) {
        // let pass= bcrypt.hashSync(clientpassword.,10);
        const sql = 'INSERT INTO Telegram (ChatId,UserName) VALUES(?,?)';
        db.run(sql, [ chatId,userName], function (err1) {
          if (err1) {
            reject(err1);
            return;
          }
          resolve("OK");
        });
        resolve("OK");
        }
        resolve("OK");

      });
    }); 
  };

exports.updateMobile = (mobile,chatId) => {
    return new Promise((resolve, reject) => {
        // let pass= bcrypt.hashSync(clientpassword.,10);
        const sql = 'Update Telegram  set Mobile=? Where ChatId=?';
        db.run(sql, [ mobile,chatId], function (err1) {
          if (err1) {
            reject(err1);
            return;
          }
        });
        resolve("OK");
    }); 
  };


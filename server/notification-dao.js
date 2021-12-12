'use strict';
const e = require('express');
const db = require('./db');

exports.InsertNotification = (userId, header, body, notificationType) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'INSERT INTO Notifications( UserId, NotificationHeader, NotificationBody, Status, Visibility, NotificationType) VALUES(?,?,?,?,?,?)';
    db.run(sql1, [
      userId,
      header,
      body,
      0,
      0,
      notificationType], function (err) {
        if (err) {
          console.log(err);
          reject(err);
        }
      });
    resolve(this.lastID);
  });
}


exports.getNotificationForChangedBooking = () => {
  return new Promise((resolve, reject) => {
    const notificationsSql = 'SELECT Notifications.*,Users.Email from Notifications, Users  where  NotificationType=1 And  Visibility=0 And Users.Id=UserId And Status=0';
    db.all(notificationsSql, function (err, rows) {//NOSONAR
      if (err) {
        reject(err);
        return;
      }
      const notifications = rows.map((e) => ({
        NotificationId: e.NotificationId,
        UserId: e.UserId,
        NotificationHeader: e.NotificationHeader,
        NotificationBody: e.NotificationBody,
        Status: e.Status,
        Visibility: e.Visibility,
        NotificationType: e.NotificationType,
        Email: e.Email,

      }));

      resolve(notifications);
    });
  });
}

exports.UpdateNotificaton = (notificationId) => {
  return new Promise((resolve, reject) => {
    const sqlUpdateBookingProduct = 'UPDATE Notifications SET Status=1   WHERE  NotificationId=? ';
    db.run(sqlUpdateBookingProduct, [notificationId], function (err) {//NOSONAR
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  })
}

exports.getNotificationsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * 
                FROM Notifications 
                WHERE UserId = ? AND Visibility = 0 
                ORDER BY NotificationId DESC`;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      }
      const notifications = rows.map(row => (
        {
          notificationId: row.NotificationId, userId: row.userId,
          notificationHeader: row.NotificationHeader, notificationBody: row.NotificationBody,
          notificationType: row.NotificationType, status: row.Status
        }))
      resolve(notifications);
    })
  })
}

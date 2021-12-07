'use strict';
const e = require('express');
const db = require('./db');

exports.createBooking = (booking, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Bookings( BookingStartDate, UserId, TotalPrice, State, PickupTime, DeliveryTime) VALUES(?,?,?,?,?,?)';
        db.run(sql, [
            booking.bookingStartDate,
            booking.userId,
            booking.totalPrice,
            booking.state,
            booking.pickupTime,
            booking.deliveryTime], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
    });
};

exports.createBookingAndProduct = (bookingProduct, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO BookingAndProducts( BookingId, ProductId, Quantity, Price) VALUES(?,?,?,?)';
        db.run(sql, [
            bookingProduct.bookingId,
            bookingProduct.productId,
            bookingProduct.quantity,
            bookingProduct.price], function (err) {//NOSONAR
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
    });
};

exports.updateProductQuantity = (quantity,id) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE Products SET Quantity=Quantity - ?   WHERE  Id=?';
      db.run(sql, [quantity, id], function (err) {//NOSONAR
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };

exports.updateBookingState = (state,id) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE Bookings SET State= ? WHERE Id = ?';
      db.run(sql, [state, id], function (err) {//NOSONAR
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };


exports.getOrders = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT Bookings.*, Users.Name, Users.Surname FROM Bookings,Users where Bookings.UserId=Users.Id ';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const orders = rows.map((e) => ({BookingId : e.Id,UserName:e.Name,UserSurname:e.Surname, BookingStartDate : e.BookingStartDate, UserId : e.UserId, TotalPrice : e.TotalPrice, State:e.State, PickupTime : e.PickupTime, DeliveryTime : e.DeliveryTime}));
            resolve(orders);
        });
    });
};
exports.getOrdersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT Bookings.*, Users.Name, Users.Surname FROM Bookings,Users Where UserId=? And Bookings.UserId=Users.Id';
      db.all(sql, [userId], (err, rows) => { //NOSONAR
          if (err) {
              reject(err);
              return;
          }
          const orders = rows.map((e) => ({BookingId : e.Id,UserName:e.Name,UserSurname:e.Surname, BookingStartDate : e.BookingStartDate, UserId : e.UserId, TotalPrice : e.TotalPrice, State:e.State, PickupTime : e.PickupTime, DeliveryTime : e.DeliveryTime}));
          resolve(orders);
      });
  });
};

exports.deleteOrder = (id) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT ProductId, Quantity FROM BookingAndProducts WHERE BookingId = ?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const productAndQuantity = rows.map((e) => (
              {productId : e.ProductId, productQuantity: e.Quantity}
            ));
            productAndQuantity.map((productAndQuantity)=>{
              const sqlAdd = 'UPDATE Products SET Quantity=Quantity + ?   WHERE  Id=?';
              db.run(sqlAdd, [productAndQuantity.productQuantity, productAndQuantity.productId], function (err) {//NOSONAR
                if (err) {
                  reject(err);
                  return;
                } else
                resolve(null);
              })  
            });

    const sqlDelete = 'DELETE FROM Bookings WHERE Id = ?';
    db.run(sqlDelete, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
    const sqlDelete1 = 'DELETE FROM BookingAndProducts WHERE BookingId = ?';
    db.run(sqlDelete1, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    }); 
  });
});
}


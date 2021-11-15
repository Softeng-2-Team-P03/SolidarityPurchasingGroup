'use strict';
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
            bookingProduct.price], function (err) {
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
      db.run(sql, [state, id], function (err) {
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
        const sql = 'SELECT * FROM Bookings';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const orders = rows.map((e) => ({BookingStartDate : e.BookingStartDate, UserId : e.UserId, TotalPrice : e.TotalPrice, State:e.State, PickupTime : e.PickupTime, DeliveryTime : e.DeliveryTime}));
            resolve(products);
        });
    });
};


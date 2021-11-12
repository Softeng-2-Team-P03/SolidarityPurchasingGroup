'use strict';
const db = require('./db');

exports.createBooking = (booking, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Bookings( BookingStartDate, UserId, TotalPrice, State,PickupTime) VALUES(?,?,?,?,?)';
        db.run(sql, [
            booking.bookingStartDate,
            booking.userId,
            booking.totalPrice,
            booking.state,
            booking.pickupTime], function (err) {
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
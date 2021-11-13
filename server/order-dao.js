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

exports.getOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Bookings';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const orders = rows.map((e) => ({ Id: e.Id, FarmerId: e.FarmerId, Name: e.Name, Description: e.Description,Quantity: e.Quantity,State:e.State,TypeId:e.TypeId,PricePerUnit:e.PricePerUnit}));
            resolve(products);
        });
    });
};
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

        }
        resolve(this.lastID);
      });
  });
};

exports.updateProductQuantity = (quantity, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Products SET Quantity=Quantity - ?   WHERE  Id=?';
    db.run(sql, [quantity, id], function (err) {//NOSONAR
      if (err) {
        reject(err);

      }
      resolve(this.lastID);
    });
  });
};

exports.updateBookingState = (state, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Bookings SET State= ? WHERE Id = ?';
    db.run(sql, [state, id], function (err) {//NOSONAR
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
  });
};


exports.getOrders = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Bookings.*, bookings.Id AS BookingId, Users.* FROM Bookings,Users where Bookings.UserId=Users.Id ';
    db.all(sql, [], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      const orders = rows.map((e) => ({ Email: e.Email, PhoneNumber: e.PhoneNumber, Wallet: e.Wallet, BookingId: e.BookingId, UserName: e.Name, UserSurname: e.Surname, BookingStartDate: e.BookingStartDate, UserId: e.UserId, TotalPrice: e.TotalPrice, State: e.State, PickupTime: e.PickupTime, DeliveryTime: e.DeliveryTime }));
      resolve(orders);
    });
  });
}

exports.getOrdersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Bookings.*, Users.Name, Users.Surname FROM Bookings,Users Where UserId=? And Bookings.UserId=Users.Id';
    db.all(sql, [userId], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      const orders = rows.map((e) => ({ BookingId: e.Id, UserName: e.Name, UserSurname: e.Surname, BookingStartDate: e.BookingStartDate, UserId: e.UserId, TotalPrice: e.TotalPrice, State: e.State, PickupTime: e.PickupTime, DeliveryTime: e.DeliveryTime }));
      resolve(orders);
    });
  });
}

exports.deleteOrder = (id) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT ProductId, Quantity FROM BookingAndProducts WHERE BookingId = ?';
    db.all(sql, [id], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      const productAndQuantity = rows.map((e) => (
        { productId: e.ProductId, productQuantity: e.Quantity }
      ));
      productAndQuantity.map((productAndQuantity) => {
        const sqlAdd = 'UPDATE Products SET Quantity=Quantity + ?   WHERE  Id=?';
        db.run(sqlAdd, [productAndQuantity.productQuantity, productAndQuantity.productId], function (err) {//NOSONAR
          if (err) {
            reject(err);

          } else
            resolve(null);
        })
      });

      const sqlDelete = 'DELETE FROM Bookings WHERE Id = ?';
      db.run(sqlDelete, [id], (err) => { //NOSONAR
        if (err) {
          reject(err);

        } else
          resolve(null);
      });
      const sqlDelete1 = 'DELETE FROM BookingAndProducts WHERE BookingId = ?';
      db.run(sqlDelete1, [id], (err) => { //NOSONAR
        if (err) {
          reject(err);

        } else
          resolve(null);
      });
    });
  });
}
/*
**# Regain For Confirm booking Product
For This Function, After Change And Update Product Available By Farmer We Use the Url /api/confirmBookingProduct/2  
*/
exports.GetProductInfoForConfirmation = (productId) => {
  return new Promise((resolve, reject) => {
    const sqlProduct = 'SELECT Name,Quantity , FarmerId,PricePerUnit FROM Products WHERE Id=? ';
    db.all(sqlProduct, [productId], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      var Product = ({ ProductName: rows[0].Name, Quantity: rows[0].Quantity, FarmerId: rows[0].FarmerId, PricePerUnit: rows[0].PricePerUnit });
      resolve(Product);
    });
  });
}

exports.GetBookingProductsByProduct = (productId) => {
  return new Promise((resolve, reject) => { //NOSONAR
    const sqlBookingAndProduct = "SELECT Bookings.UserId as UserId ,BookingAndProducts.* FROM BookingAndProducts ,Bookings WHERE BookingAndProducts.ProductId=?  AND Bookings.State=0 And BookingAndProducts.BookingId=Bookings.Id And BookingAndProducts.State=0";
    db.all(sqlBookingAndProduct, [productId], (err, BookingProducts) => {
      if (err) {
        reject(err);

      }
      console.log(BookingProducts)
      const Products = BookingProducts.map((e) => ({ BookingId: e.BookingId, UserId: e.UserId, ProductId: e.ProductId, Quantity: e.Quantity, Price: e.Price, State: e.State }));
      resolve(Products);
    });
  });
}

exports.GetProductsFromBookingId = (bookingId) => {
  return new Promise((resolve, reject) => { //NOSONAR
    const sqlProductsFromBooking = "SELECT * FROM BookingAndProducts JOIN Products ON BookingAndProducts.ProductId = Products.Id  WHERE BookingAndProducts.BookingId=?  AND BookingAndProducts.State=0";
    db.all(sqlProductsFromBooking, [bookingId], (err, ProductsFromBooking) => {
      if (err) {
        reject(err);

      }
      console.log(ProductsFromBooking)
      const Products = ProductsFromBooking.map((e) => ({ BookingId: e.BookingId, ProductId: e.ProductId, Quantity: e.Quantity, Price: e.Price, State: e.State }));
      resolve(Products);
    });
  });
}

exports.InsertNotification = (userId, header, body) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'INSERT INTO Notifications( UserId, NotificationHeader, NotificationBody, Status, Visibility, NotificationType) VALUES(?,?,?,?,?,?)';
    db.run(sql1, [
      userId,
      header,
      body,
      0,
      0,
      1], function (err) {
        if (err) {
          console.log(err);

          exports.deleteBooking = (id) => {
            return new Promise((resolve, reject) => {
              const sql = 'DELETE from Bookings WHERE id = ?';
              db.run(sql, [id], function (err) {//NOSONAR
                if (err) {
                  reject(err);
                }
                resolve(this.lastID);
              });
            });
          };

          reject(err);
        }
      });
    resolve(this.lastID);
  });
}

exports.UpdateBookingProduct = (quantity, pricePerUnit, bookingId, productId) => {
  return new Promise((resolve, reject) => {
    const sqlUpdateBookingProduct = 'UPDATE BookingAndProducts SET Quantity=?, State=?,Price=?   WHERE  BookingId=? AND ProductId=?';
    db.run(sqlUpdateBookingProduct, [quantity, 1, quantity * pricePerUnit, bookingId, productId], function (err) {//NOSONAR
      if (err) {
        console.log(err)
        reject(err);
      }
      resolve(this.lastID);
    });
  })
}

exports.UpdateBookingPaid = (paid, BookingId) => {
  console.log("paid" + paid)
  console.log("BookingId" + BookingId)
  return new Promise((resolve, reject) => {
    const sqlUpdateBooking = 'UPDATE Bookings SET Paid=Paid+?   WHERE  Id=?';
    db.run(sqlUpdateBooking, [paid, BookingId], function (err) {//NOSONAR
      if (err) {
        console.log(err)
        reject(err);
      }

    });
    resolve(this.lastID);
  });
}

exports.UpdateBookingByClient = (Id, deliveryTime,totalPrice) => {
  return new Promise((resolve, reject) => {
    const sqlUpdateBooking = 'UPDATE Bookings SET DeliveryTime=?, TotalPrice=?   WHERE  Id=?';
    db.run(sqlUpdateBooking, [deliveryTime, totalPrice, Id], function (err) {//NOSONAR
      if (err) {
        console.log(err)
        reject(err);
      }
      resolve(this.lastID);
    });
  })
}

exports.getOrderUserId = (bookingId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT UserId From Bookings where Id=? ';
    db.all(sql, [bookingId], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      const userId = rows[0].UserId;
      resolve(userId);
    });
  });
}

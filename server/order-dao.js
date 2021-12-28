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
    const sql = 'UPDATE Products SET EstimatedQuantity=EstimatedQuantity - ?, SoldQuantity=SoldQuantity + ?   WHERE  Id=?';
    db.run(sql, [quantity, quantity, id], function (err) {//NOSONAR
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

exports.getIssuedBookingsAndUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Bookings.*, Bookings.Id as BookingId, Users.* FROM Bookings,Users where Bookings.UserId=Users.Id AND Bookings.State=0';
    db.all(sql, [], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      const orders = rows.map((e) => ({ Email: e.Email, PhoneNumber: e.PhoneNumber, Wallet: e.Wallet, BookingId: e.BookingId, UserName: e.Name, UserSurname: e.Surname, BookingStartDate: e.BookingStartDate, UserId: e.UserId, TotalPrice: e.TotalPrice, State: e.State, PickupTime: e.PickupTime, DeliveryTime: e.DeliveryTime }));
      resolve(orders);
    });
  });
}




exports.getPendingCancelationBookingsAndUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Bookings.*, Bookings.Id as BookingId, Users.* FROM Bookings,Users where Bookings.UserId=Users.Id AND Bookings.State=1';
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
        const sqlAdd = 'UPDATE Products SET EstimatedQuantity=EstimatedQuantity + ?   WHERE  Id=?';
        db.run(sqlAdd, [productAndQuantity.productQuantity, productAndQuantity.productId], function (err) {//NOSONAR
          if (err) {
            reject(err);

          } else
            resolve(null);
        })
      });

      const sqlDelete = 'UPDATE Bookings SET State = 4 WHERE Id = ?';
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
    const sqlProduct = 'SELECT Name, AvailableQuantity, SoldQuantity, FarmerId, PricePerUnit FROM Products WHERE Id=? ';
    db.all(sqlProduct, [productId], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      var Product = ({ ProductName: rows[0].Name, Quantity: rows[0].AvailableQuantity, SoldQuantity: rows[0].SoldQuantity, FarmerId: rows[0].FarmerId, PricePerUnit: rows[0].PricePerUnit });
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
    const sqlProductsFromBooking = "SELECT *,  BookingAndProducts.Quantity as Qty  FROM BookingAndProducts JOIN Products ON BookingAndProducts.ProductId = Products.Id JOIN ProductImages  ON Products.Id = ProductImages.ProductId  WHERE BookingAndProducts.BookingId=?";
    db.all(sqlProductsFromBooking, [bookingId], (err, ProductsFromBooking) => {
      if (err) {
        reject(err);

      }

      const Products = ProductsFromBooking.map((e) => ({ BookingId: e.BookingId, Name: e.Name, ProductId: e.ProductId, Qty: e.Qty, Quantity: e.EstimatedQuantity, Price: e.Price, State: e.State, ImagePath: e.Path, PricePerUnit: e.PricePerUnit }));
      resolve(Products);
    });
  });
}

exports.GetUnretrievedBookings = () => {
  return new Promise((resolve, reject) => { //NOSONAR
    const sqlUnretrievedBookings = "SELECT *,  BookingAndProducts.Quantity as ProductQty  FROM Bookings JOIN BookingAndProducts ON BookingAndProducts.BookingId = Bookings.Id JOIN Products  ON Products.Id = BookingAndProducts.ProductId  WHERE Bookings.State=5";
    db.all(sqlUnretrievedBookings, [], (err, ProductsFromBooking) => {
      if (err) {
        reject(err);

      }

      const Products = ProductsFromBooking.map((e) => ({ BookingId: e.BookingId, Name: e.Name, ProductId: e.ProductId, ProductQty: e.ProductQty, Quantity: e.AvailableQuantity, Price: e.Price, State: e.State, TypeId: e.TypeId }));
      resolve(Products);
    });
  });
}

exports.createUnretrieved = (date, productId, unretrievedQty, typeId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO UnretrievedFood(Date, ProductId, UnretrievedQuantity, ProductType) VALUES(?,?,?,?)';
    db.run(sql, [date, productId, unretrievedQty, typeId], function (err) {//NOSONAR
      if (err) {
        reject(err);

      }
      resolve(this.lastID);
    });
  });
};

/**
 * Gets unretrieved food of a certain week
 * @param {String} saturdayDate iso 8601 date indicating the Saturday of the week we want to select 
 */
exports.getUnretrievedFoodByWeek = (saturdayDate) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM UnretrievedFood WHERE Date=?';
    db.all(sql, [saturdayDate], (err, rows) => {
      if (err) {
        reject(err);

      }

      const UnretrievedProducts = rows.map((e) => ({ Date: e.Date, ProductId: e.ProductId, UnretrievedQuantity: e.UnretrievedQuantity, ProductType: e.ProductType }));
      resolve(UnretrievedProducts);
    });
  });
};

/**
 * 
 * @param {integer} monthNum the month we want to select
 * @param {integer} year the year of the month
 * @returns array of unretrieved food objects having Date with same month and year as the parameters
 */
exports.getUnretrievedFoodByMonth = (monthNum, year) => {
  return new Promise((resolve, reject) => {

    //necessary cast to string to let strftime() work as intended.
    monthNum = monthNum+"";
    year = year+"";

    const sql = `SELECT *
    FROM UnretrievedFood
    WHERE strftime('%m',Date)=? AND strftime('%Y',Date)=?`;
    db.all(sql, [monthNum, year], (err, rows) => {
      if (err) {
        reject(err);

      }

      const UnretrievedProducts = rows.map((e) => ({ Date: e.Date, ProductId: e.ProductId, UnretrievedQuantity: e.UnretrievedQuantity, ProductType: e.ProductType }));
      resolve(UnretrievedProducts);
    });
  });
};

/**
 * Gets unretrieved food of a certain prudct
 * @param {integer} productId iso 8601 date indicating the Saturday of the week we want to select 
 * @returns array of unretrieved food objects having productId as indicated by the parameter
 */
 exports.getUnretrievedFoodByProductId = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM UnretrievedFood WHERE ProductId = ?';
    db.all(sql, [productId], (err, rows) => {
      if (err) {
        reject(err);

      }

      const UnretrievedProducts = rows.map((e) => ({ Date: e.Date, ProductId: e.ProductId, UnretrievedQuantity: e.UnretrievedQuantity, ProductType: e.ProductType }));
      resolve(UnretrievedProducts);
    });
  });
};

/**
 * Gets unretrieved food of a certain prudct type
 * @param {integer} ProductType iso 8601 date indicating the Saturday of the week we want to select 
 * @returns array of unretrieved food objects having produc type as indicated by the parameter
 */
 exports.getUnretrievedFoodByProductType = (productType) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM UnretrievedFood WHERE ProductType = ?';
    db.all(sql, [productType], (err, rows) => {
      if (err) {
        reject(err);

      }

      const UnretrievedProducts = rows.map((e) => ({ Date: e.Date, ProductId: e.ProductId, UnretrievedQuantity: e.UnretrievedQuantity, ProductType: e.ProductType }));
      resolve(UnretrievedProducts);
    });
  });
};

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

exports.DeleteBookingProduct = (bookingId) => {
  return new Promise((resolve, reject) => {
    const sqlUpdateBookingProduct = 'UPDATE BookingAndProducts SET Quantity=0 WHERE  BookingId=? ';
    db.run(sqlUpdateBookingProduct, [bookingId], function (err) {//NOSONAR
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

exports.UpdateBookingTotalPrice = (diff, BookingId) => {
  console.log("total price difference: " + diff)
  console.log("BookingId" + BookingId)
  return new Promise((resolve, reject) => {
    const sqlUpdateBooking = 'UPDATE Bookings SET TotalPrice=TotalPrice-?   WHERE  Id=?';
    db.run(sqlUpdateBooking, [diff, BookingId], function (err) {//NOSONAR
      if (err) {
        console.log(err)
        reject(err);
      }

    });
    resolve(this.lastID);
  });
}

exports.UpdateBookingByClient = (Id, deliveryTime, pickupTime, totalPrice) => {
  return new Promise((resolve, reject) => {
    const sqlUpdateBooking = 'UPDATE Bookings SET DeliveryTime=?, PickupTime=?,  TotalPrice=?   WHERE  Id=?';
    db.run(sqlUpdateBooking, [deliveryTime, pickupTime, totalPrice, Id], function (err) {//NOSONAR
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

exports.GetUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlUser = 'SELECT * FROM Users WHERE Id=? ';
    db.all(sqlUser, [userId], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      var User = ({ Id: rows[0].Id, Name: rows[0].Name, Surname: rows[0].Surname, Email: rows[0].Email, PhoneNumber: rows[0].PhoneNumber, AccessType: rows[0].AccessType, Wallet: rows[0].Wallet, Address: rows[0].Address });
      resolve(User);
    });
  });
}

exports.GetBookingById = (bookingId) => {
  return new Promise((resolve, reject) => {
    const sqlBooking = 'SELECT * FROM Bookings WHERE Id=? ';
    db.all(sqlBooking, [bookingId], (err, rows) => { //NOSONAR
      if (err) {
        reject(err);

      }
      var Booking = ({ Id: rows[0].Id, BookingStartDate: rows[0].BookingStartDate, UserId: rows[0].UserId, TotalPrice: rows[0].TotalPrice, State: rows[0].State, PickupTime: rows[0].PickupTime, DeliveryTime: rows[0].DeliveryTime, Paid: rows[0].Paid });
      resolve(Booking);
    });
  });
}
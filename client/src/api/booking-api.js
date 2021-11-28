/**
 * All the API For Product
 */
import React from "react";
const BASEURL = '/api';

async function getOrders() {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/bookings');
  const ordersJson = await response.json();
  if (response.ok) {
    return ordersJson;
  } else {
    throw ordersJson;  // an object with the error coming from the server
  }
}

function addBooking(booking) {
  return new Promise((resolve, reject) => {
    let order = {
      bookingStartDate: booking.bookingStartDate,
      totalPrice: booking.totalPrice,
      pickupTime: booking.pickupTime,
      deliveryTime: booking.deliveryTime,
      state: booking.state,
      products: booking.products,
      userId: booking.userId //could be undefined
    };
    console.log(JSON.stringify(order));
    fetch(BASEURL + '/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    }).then((response) => {
      if (response.ok) {
        resolve (response.json());
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject (obj) }) // error msg in the response body
          .catch((err) => { reject ({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject ({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
  })
}

function updateBookingState(booking) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/bookings/' + booking.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: booking.state }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error msg in the response body
          .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
      }
    }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
  });
}

async function getWalletBalance() {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/clients/getWallet');
  const walletBalance = await response.json();
  if (response.ok) {
    return walletBalance;
  } else {
    throw walletBalance;  // an object with the error coming from the server
  }
}

async function getOrdersByUserId(userId) {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/users/'+userId+'/bookings');
  const ordersJson = await response.json();
  if (response.ok) {
    return ordersJson;
  } else {
    throw ordersJson;  // an object with the error coming from the server
  }
}
const bookingApi = { addBooking, updateBookingState, getOrders,getWalletBalance,getOrdersByUserId };
export default bookingApi;
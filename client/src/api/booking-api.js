/**
 * All the API For Product
 */
import React from "react";
const BASEURL = '/api';

async function addBooking(booking) {
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
  await fetch(BASEURL + '/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  }).then((response) => {
    if (response.ok) {
      console.log(JSON.stringify(response.body));
      return (response);
    } else {
      // analyze the cause of error
      response.json()
        .then((obj) => { return obj; }) // error msg in the response body
        .catch((err) => { return ({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
    }
  }).catch((err) => { return ({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
}

function updateBookingState(booking) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/bookings/' + booking.Id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({...booking}),
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


const bookingApi = { addBooking, updateBookingState };
export default bookingApi;
/**
 * All the API For Product
 */
 import React from "react";
 const BASEURL = '/api';
 async function addBooking(booking) {
    let order = {
        bookingStartDate:booking.bookingStartDate,
        totalPrice:booking.totalPrice,
        pickupTime:booking.pickupTime,
        deliveryTime:booking.deliveryTime,
        state:booking.state,
        products:booking.products};
  
    await fetch(BASEURL + '/booking', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body : JSON.stringify(order),
       }).then((response) => {
         if (response.ok) {
             console.log(JSON.stringify(response.body));
           return (response);
         } else {
           // analyze the cause of error
           response.json()
             .then((obj) => { return (obj); }) // error msg in the response body
             .catch((err) => { return({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
         }
       }).catch((err) => { return ({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
 }
 const bookingApi = {addBooking};
 export default bookingApi;
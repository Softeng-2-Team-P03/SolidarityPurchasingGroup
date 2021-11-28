/**
 * All the API For Product
 */
 import React from "react";
 const BASEURL = '/api';
 
 async function getRequiredCharge() {
   // call: GET /api/orders
   const response = await fetch(BASEURL + '/clients/riquredCharge');
   const required = await response.json();
   if (response.ok) {
     return required;
   } else {
     throw required;  // an object with the error coming from the server
   }
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

   
async function getRequiredChargeByBookingId(bookinId) {
    // call: GET /api/orders
    const response = await fetch(BASEURL + '/clients/getRequiredChargeByBookingId?bookingId='+bookinId);
    const walletBalance = await response.json();
    if (response.ok) {
        console.log("rimined 22.5");
        console.log(response)
      return walletBalance;
    } else {
      throw walletBalance;  // an object with the error coming from the server
    }
  }

 const userApi = { getRequiredCharge,getWalletBalance,getRequiredChargeByBookingId };
 export default userApi;
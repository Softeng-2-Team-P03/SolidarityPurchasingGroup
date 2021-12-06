
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


async function getWalletBalance(userId) {
    // call: GET /api/orders
    const response = await fetch(BASEURL + '/clients/getWallet/'+ userId);
    const walletBalance = await response.json();
    if (response.ok) {
      return walletBalance;
    } else {
      throw walletBalance;  // an object with the error coming from the server
    }
  }

  async function getUserById(userId) {
    // call: GET /api/orders
    const response = await fetch(BASEURL + '/client/'+ userId);
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

  async function chargeWallet(userId, amount) {
      return new Promise((resolve, reject) => {
        fetch(BASEURL + '/topup/' + userId +'/'+amount, {
          method: 'PUT'
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

  

 const userApi = { getRequiredCharge,getWalletBalance,getRequiredChargeByBookingId, chargeWallet, getUserById};
 export default userApi; 
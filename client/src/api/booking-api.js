/**
 * All the API For Product
 */
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

function updateBookingState(id, state) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/bookings/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state : state }), 
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

async function getWalletBalance(userId) {
  console.log("getWalletBalance");
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/clients/'+userId+'/getWallet');
  const walletBalance = await response.json();
  if (response.ok) {
    return walletBalance;
  } else {
    throw walletBalance;  // an object with the error coming from the server
  }

}

async function confirmBookingProduct(productId) {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/confirmBookingProduct/'+ productId);
  const ordersJson = await response.json();
  if (response.ok) {
    return ordersJson;
  } else {
    throw ordersJson;  // an object with the error coming from the server
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


async function getProductsFromBooking(bookingId) {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/bookings/'+bookingId+'/products');
  const ordersJson = await response.json();
  if (response.ok) {
    return ordersJson;
  } else {
    throw ordersJson;  // an object with the error coming from the server
  }
}


function deleteBooking(id) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/deletebooking/' + id, {
      method: 'DELETE',
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



function updateBooking(booking) {
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/bookingUpdateByClient/' + booking.BookingId, {
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

function addUnretrievedFood(date) {
  return new Promise((resolve, reject) => {
    console.log(JSON.stringify(date));
    fetch(BASEURL + '/unretrievedfood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: date }),
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

/**
 * 
 * @param {string} saturdayDate iso date yyyy-mm-dd indicating the **Saturday** of the week to select 
 * @returns array of unretrievedFood objects { Date, ProductId, UnretrievedQuantity, ProductType }
 */
async function getUnretrievedOfWeek(saturdayDate) {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/unretrievedFoodOfWeek?date=' + saturdayDate, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const unretrievedFoodsJson = await response.json();
  if (response.ok) {
    return unretrievedFoodsJson;
  } else {
    throw unretrievedFoodsJson;  // an object with the error coming from the server
  }
}

/**
 * 
 * @param {Integer} monthNum the month we want to query, as a umber from 1 to 12
 * @param {Integer} year the year as a number from 1970 to 2999
 * @returns 
 */
async function getUnretrievedOfMonth(monthNum, year) {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/unretrievedFoodOfMonth?monthNum=' + monthNum + "&year=" + year, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const unretrievedFoodsJson = await response.json();
  if (response.ok) {
    return unretrievedFoodsJson;
  } else {
    throw unretrievedFoodsJson;  // an object with the error coming from the server
  }
}

/**
 * 
 * @param {Integer} productId the productId we want to query
 * @returns 
 */
 async function getUnretrievedByProductId(productId) {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/unretrievedFoodByProductId/' + productId , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const unretrievedFoodsJson = await response.json();
  if (response.ok) {
    return unretrievedFoodsJson;
  } else {
    throw unretrievedFoodsJson;  // an object with the error coming from the server
  }
}

/**
 * 
 * @param {Integer} productType the productId we want to query
 * @returns 
 */
 async function getUnretrievedByProductType(productType) {
  // call: GET /api/orders
  const response = await fetch(BASEURL + '/unretrievedFoodByProductType/' + productType , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const unretrievedFoodsJson = await response.json();
  if (response.ok) {
    return unretrievedFoodsJson;
  } else {
    throw unretrievedFoodsJson;  // an object with the error coming from the server
  }
}


const bookingApi = { addBooking, updateBookingState, getOrders ,getWalletBalance,getOrdersByUserId,deleteBooking, confirmBookingProduct, getProductsFromBooking, updateBooking, addUnretrievedFood, getUnretrievedOfWeek, getUnretrievedOfMonth, getUnretrievedByProductId, getUnretrievedByProductType};
export default bookingApi;
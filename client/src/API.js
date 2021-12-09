/**
 * All the API calls
 */
const BASEURL = '/api';


async function getAllProducts() {
    // call: GET /api/products
    const response = await fetch(BASEURL + '/products');
    const productsJson = await response.json();
    if (response.ok) {
        return productsJson;
    } else {
        throw productsJson;  // an object with the error coming from the server
    }
}

async function getProductsByDate(day,month,year) {
    // call: GET /api/products
    const response = await fetch(BASEURL + '/products/' + day +'/' + month +'/'+ year);
    const productsJson = await response.json();
    console.log(productsJson);
    if (response.ok) {
        return productsJson;
    } else {
        throw productsJson;  // an object with the error coming from the server
    }
}

function addImage(id,path) {
    // call: POST /api/image
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id, path: path}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getProdFarmer(farmerId,state) {
    // call: GET /api/products/farmerId/state/
    const response = await fetch(BASEURL + '/products/' + farmerId +'/' + state);
    const prodJson = await response.json();
    if (response.ok) {
        return prodJson;
    } else {
        throw prodJson;  // an object with the error coming from the server
    }
}

async function addNewClient(client) {
    const response = await fetch('/api/new_client',  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...client})
    });
    if (response.ok) {
        return null;
    } else return { 'err': 'POST error' };
}

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        return response.json(); //return user
    }
    else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

async function getAllClients() {
    // call: GET /api/clients
    const response = await fetch(BASEURL + '/clients');
    const clientsJson = await response.json();
    if (response.ok) {
        return clientsJson;
    } else {
        throw clientsJson;  // an object with the error coming from the server
    }
}

function addProduct(FarmerId, Name, Description,Quantity,State,TypeId,PricePerUnit,ExpiringDate) {
    // call: POST /api/product
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({FarmerId: FarmerId, Name: Name,Description:Description,
                Quantity:Quantity,State:State,TypeId:TypeId,PricePerUnit:PricePerUnit,ExpiringDate:ExpiringDate}),
        }).then((response) => {//NOSONAR
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateProductState(State,Id) {
    // call: PUT /api/product/:State/:Id
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/product/' + State +'/' + Id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({State: State, Id:Id}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}
function updateNotificationState(State,Id) {
    // call: PUT /api/notification/:State/:Id
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/notification/' + State +'/' + Id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({State: State, Id:Id}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateProductInfo(Quantity,Id,Name,Description,PricePerUnit,TypeId) {
    // call: PUT /api/product/:Id
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/product/' + Id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Quantity: Quantity, Id:Id, Name:Name, Description:Description, PricePerUnit:PricePerUnit,TypeId:TypeId}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


const API = { logIn, logOut, getUserInfo,addNewClient,getAllProducts,getProductsByDate,addImage,getAllClients,getProdFarmer,addProduct,updateProductState, updateProductInfo,updateNotificationState};
export default API;

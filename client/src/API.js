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

async function addNewClient(client) {
    const response = await fetch('/api/new_client', {
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
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
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

const API = { logIn, logOut, getUserInfo,addNewClient,getAllProducts};
export default API;

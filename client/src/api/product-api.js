/**
 * All the API For Product
 */
const BASEURL = '/api';

async function getProductsByType(category, date) {
    // call: GET /api/products/day/month/year
    let response;
    if (category !== 0) {
        response = await fetch(BASEURL + '/products/type/' + category + '/' + date);
    }
    else {
        response = await fetch(BASEURL + '/products/' + date);
    }
    const productsJson = await response.json();
    if (response.ok) {
        return productsJson;
    } else {
        throw productsJson;  // an object with the error coming from the server
    }
}


async function getProducts(arg) {
    // call: GET /api/products
    const response = await fetch(BASEURL + '/products/' + arg.id);
    const productsJson = await response.json();
    if (response.ok) {
        return productsJson;
    } else {
        throw productsJson;  // an object with the error coming from the server
    }
}

async function getProductTypes() {
    // call: GET /api/types
    const response = await fetch(BASEURL + '/types');
    const typesJson = await response.json();
    if (response.ok) {
        return typesJson;
    } else {
        throw typesJson;  // an object with the error coming from the server
    }
}

const API = { getProducts, getProductTypes, getProductsByType };
export default API;
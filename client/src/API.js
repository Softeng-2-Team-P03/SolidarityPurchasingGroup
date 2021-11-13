/**
 * All the API calls
 */
import React from "react";

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


const API = {getAllProducts};
export default API;

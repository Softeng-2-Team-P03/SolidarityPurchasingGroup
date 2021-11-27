/**
 * All the API For Product
 */
import React from "react";
const BASEURL = '/api';

async function getAllProducts(date) {
    // call: GET /api/products/day/month/year
    const response = await fetch(BASEURL + '/products/' + date);
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

async function getProductsByType(typeId) {
    const response = await fetch(BASEURL + '/products/type/' + typeId);
    const productsJson = await response.json();
    if (response.ok) {
        return productsJson;
    } else {
        throw productsJson;
    }
}

const API = { getAllProducts, getProducts, getProductTypes, getProductsByType };
export default API;
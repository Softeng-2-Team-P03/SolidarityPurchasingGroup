/**
 * All the API For Product
 */
import React from "react";
//import { propTypes } from "react-bootstrap/esm/Image";
const BASEURL = '/api';

async function getAllProducts(day,month,year) {
    // call: GET /api/products/day/month/year
    const response = await fetch(BASEURL + '/products/' + year +'/' + month +'/'+ day);
    const productsJson = await response.json();
    console.log(productsJson);
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
/**
 * All the API For Product
 */
 import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";
 const BASEURL = '/api';
 async function getAllProducts(arg) {
     // call: GET /api/products
     const response = await fetch(BASEURL + '/products?page='+arg.page);
     const productsJson = await response.json();
     if (response.ok) {
         return productsJson;
     } else {
         throw productsJson;  // an object with the error coming from the server
     }
 }
 

 async function getProducts(arg) {
  // call: GET /api/products
  const response = await fetch(BASEURL + '/products/'+arg.id);
  const productsJson = await response.json();
  if (response.ok) {
      return productsJson;
  } else {
      throw productsJson;  // an object with the error coming from the server
  }
}

 
 const API = {getAllProducts,getProducts};
 export default API;
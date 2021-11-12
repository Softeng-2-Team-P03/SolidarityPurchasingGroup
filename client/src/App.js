import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from "./Components/ProductList/ProductList";
import { Container } from "react-bootstrap";
import ClientList from './Components/ClientList/ClientList';
import { useState } from 'react';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Components/HomePage/HomePage';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import bookingApi from "./api/booking-api";
import productApi from "./api/product-api";

import booking from './models/booking';
import {useEffect} from "react";


const fakeClients = [
  { userId: '1', name: "Mario", surname: "Rossi", email: "m@gmail.com" },
  { userId: '2', name: "Mario", surname: "Rossi", email: "ma@gmail.com" },
  { userId: '3', name: "Mario", surname: "Rossi", email: "mb@gmail.com" },
  { userId: '4', name: "Mario", surname: "Rossi", email: "mc@gmail.com" },
];

const fakeProducts = [
  { name: "Cipolla", description: "Rossi", price: "m@gmail.com" },
  { name: "Cipollo", description: "Rossi", price: "ma@gmail.com" },
  { name: "Cipollu", description: "Rossi", price: "mb@gmail.com" },
  { name: "Mario", description: "Rossi", price: "mc@gmail.com" },
  { name: "dsfsd", description: "Rossi", price: "ma@gmail.com" },
  { name: "uytuty", description: "Rossi", price: "mb@gmail.com" },
  { name: "fdsfsd", description: "Rossi", price: "mc@gmail.com" },
];


function App() {
  const [clients, setClients] = useState([...fakeClients]);
  const [products, setProducts] = useState([...fakeProducts]);

    // useEffect(()=> {
    //     let mounted = true;
    //     let products = [];
    //     const getAllProducts = async () => {
    //         products = await productApi.getAllProducts({page:0});
    //     };
    //     getAllProducts().then(data => {
    //         if (mounted){
    //             console.log("prodotti")
    //             console.log(products);

    //         }
    //     })
    //         .catch(err => {
    //             console.error(err);
    //         });
    //     return () => { mounted = false };
    // }, []);



  //   useEffect(()=> {
  //     let mounted = true;
  //     let order ;
  //     let products = [];

  //     products.push({productId:1,quantity:3,price:3});
  //     products.push({productId:2,quantity:4,price:5});
  //     const insertBooking = async () => {
  //       let order = {
  //         id:null,
  //         bookingStartDate:"2021-11-11",
  //         userId:null,
  //         totalPrice:150,
  //         pickupTime:"2021-12-11",
  //         deliveryTime:"",
  //         state:1,
  //         products:products};
  //        await bookingApi.addBooking(order);
  //     };
  //     insertBooking().then(data => {
  //         if (mounted){
  //             console.log("prodotti")
            

  //         }
  //     })
  //         .catch(err => {
  //             console.error(err);
  //         });
  //     return () => { mounted = false };
  // }, []);




  return (
    <>
      <NavBar />
      <Container fluid>
        <Router>
          <Switch>
            <Route path='/clients' render={() =>
              <ClientList clients={clients} ></ClientList>
            } />
            <Route path="/products" render={() =>
              <ProductList products={products} />
            } />
            <Route exact path="/" render={() =>
              <HomePage />
            } />
            <Route render={() =>
              <Redirect to='/' />
            } />
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default App;
